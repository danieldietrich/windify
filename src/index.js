// @ts-check

/**
 * Aynchronous initialization of the runtime DOM.
 * 
 * @param {Options} options
 * @return {Promise<void>}
 * 
 * @typedef {{
 *   minify?: boolean          // minify the output (default: true)
 *   parseCss: boolean         // parse CSS (default: true)
 *   preflight?: boolean       // enables CSS reset for descendants of the root element (default: true)
 *   root?: HTMLElement        // the DOM element that will be scanned for windi classes (default: document.body)
 *   watch?: boolean           // enable/disable watch mode, only applies to the root element (default: true)
 *   windiCssVersion?: string, // Windi CSS version (default: latest)
 *   config?: any              // optional windicss config
 * }} Options
 */
export default async (options) => {

    /**
     * The runtime configuration.
     */
    const { minify, parseCss, preflight, root, watch, windiCssVersion, config } = Object.assign({
        minify: false,
        parseCss: true,
        preflight: true,
        root: document.body,
        watch: true,
        windiCssVersion: 'latest'
    }, options);

    /**
     * Initialization of Windi CSS Processor and style element containing generated styles.
     */
    const { default: Processor } = await import(/* @vite-ignore */ `https://esm.run/windicss@${windiCssVersion}`);
    const processor = new Processor(config);
    const styleSheet = processor.interpret().styleSheet; // workaround for new StyleSheet();
    const styleElement = document.head.appendChild(document.createElement('style'));

    /**
     * Processing nodes and storing css classes and tag names for updating the generated styles.
     */
    const classes = new Set(), queuedClasses = new Set();
    const tags = new Set(), queuedTags = new Set();
    const process = (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const descendants = node.querySelectorAll('*');
            [node, ...descendants].forEach(childNode => {
                if (childNode.nodeType === Node.ELEMENT_NODE) {
                    childNode.classList.length > 0 && childNode.classList.forEach(className =>
                        !classes.has(className) && queuedClasses.add(className)
                    );
                    if (preflight) {
                        const nodeName = childNode.nodeName.toLowerCase();
                        !tags.has(nodeName) && queuedTags.add(nodeName);
                    }
                }
            });
        }
    }

    /**
     * A scheduler that requests an animation frame (fallback: setTimeout) to update styles.
     */
    const scheduleUpdate = (() => {
        const request = window.requestAnimationFrame || ((callback) => setTimeout(callback, 16.66));
        let id = 0;
        return () => (id == 0) && (id = request(() => { update(); id = 0; }));
    })();

    /**
     * Computes the style element content and updates the style element.
     */
    const update = () => {
        if (queuedClasses.size) {
            const classString = Array.from(queuedClasses).join(' ');
            const classStyleSheet = processor.interpret(classString).styleSheet;
            styleSheet.extend(classStyleSheet);
            queuedClasses.forEach(c => classes.add(c));
            queuedClasses.clear();
        }
        if (preflight && queuedTags.size) {
            const html = Array.from(queuedTags).map(t => `<${t}`).join(' ');
            const preflightStyleSheet = processor.preflight(html);
            styleSheet.extend(preflightStyleSheet);
            queuedTags.forEach(t => tags.add(t));
            queuedTags.clear();
        }
        styleSheet.sort();
        styleElement.innerHTML = styleSheet.build(minify); // use .innerHTML because .textContent does not trigger a style update
    };

    /**
     * Initially parse Windi CSS directives, compute the styles and install a mutation overserver.
     */
    const init = async () => {
        // parse all directives like @apply
        if (parseCss) {
            const { CSSParser } = await import(/* @vite-ignore */ `https://esm.run/windicss@${windiCssVersion}/utils/parser`);
            [document, ...Array.from(document.querySelectorAll("template")).map(t => t.content)].forEach(node =>
                node.querySelectorAll("style[lang='windify']").forEach(style => {
                    const cssParser = new CSSParser(style.textContent, processor);
                    style.innerHTML = cssParser.parse().build();
                    style.removeAttribute('lang');
                })
            );
        }
        // collect all classes and tags
        process(root);
        // update styles immediately in order to have correct styling when showing the root element
        update();
        // remove hidden attribute from html, body and root elements
        [document.documentElement, document.body, root].forEach(node => {
            if (node.hidden) {
                node.removeAttribute('hidden')
            }
        });
        // install mutation observer
        if (watch) {
            new MutationObserver((mutations) => {
                mutations.forEach(({ type, target, addedNodes }) => {
                    type === 'attributes' && process(target);
                    type === 'childList' && addedNodes.forEach(node => process(node));
                });
                !!(queuedClasses.size + queuedTags.size) && scheduleUpdate();
            }).observe(root, {
                childList: true,
                subtree: true,
                attributeFilter: ['class'] // implicitely sets attributes to true
            });
        }
    }

    /**
     * Entry point
     */
    if (typeof window === 'undefined') {
        console.warn('Windify cannot be used outside of a browser.');
        return;
    }
    await init();

}
