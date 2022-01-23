// @ts-check

/**
 * Aynchronous initialization of the runtime DOM.
 * 
 * @param {Options} options
 * @return {Promise<ElementProcessor>}
 * 
 * @typedef {{
 *   minify?: boolean          // minify the output (default: true)
 *   parseCss: boolean         // parse CSS (default: true)
 *   preflight?: boolean       // enables CSS reset for descendants of the root element (default: true)
 *   root?: Element            // the DOM element that will be scanned for windi classes (default: document.body)
 *   watch?: boolean           // enable/disable watch mode, only applies to the root element (default: true)
 *   windiCssVersion?: string, // Windi CSS version (default: latest)
 *   config?: any              // optional windicss config
 * }} Options
 * 
 * @typedef {(...elements: Element[]) => Promise<void>} ElementProcessor
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
    const [{ default: Processor }, { CSSParser }] = await Promise.all([
        import(/* @vite-ignore */ `https://esm.run/windicss@${windiCssVersion}`),
        import(/* @vite-ignore */ `https://esm.run/windicss@${windiCssVersion}/utils/parser`)
    ]);
    const processor = new Processor(config);
    const styleSheet = processor.interpret().styleSheet; // workaround for new StyleSheet()
    const styleElement = document.head.appendChild(document.createElement('style'));
    const classes = new Set(), queuedClasses = new Set();
    const tags = new Set(), queuedTags = new Set();

    /**
     * Processing elements and storing css classes and tag names for updating the generated styles.
     * @type {(element: Element, recurse?: boolean) => void}
     */
    const process = (element, recurse = true) => {
        const descendants = recurse ? element.querySelectorAll('*') : [];
        [element, ...descendants].forEach(elem => {
            elem.classList.length > 0 && elem.classList.forEach(className => {
                !classes.has(className) && queuedClasses.add(className);
            });
            if (preflight) {
                const tagName = elem.tagName.toLowerCase();
                !tags.has(tagName) && queuedTags.add(tagName);
            }
        });
    };

    /**
     * A scheduler that requests an animation frame (fallback: setTimeout) to update styles.
     */
    const scheduleUpdate = (() => {
        const request = window.requestAnimationFrame || (callback => setTimeout(callback, 16.66));
        let id = 0;
        return () => !!(queuedClasses.size + queuedTags.size) && (id == 0) && (id = request(() => { update(); id = 0 }));
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
     * Parses the CSS of all style elements and transforms directives.
     * 
     * @param {Element} element
     */
    const parseStyles = (element) => {
        // querySelectorAll does not include template element contents
        // because they are not visible in the DOM
        element.querySelectorAll("style[lang='windify']").forEach(style => {
            const cssParser = new CSSParser(style.textContent, processor);
            style.innerHTML = cssParser.parse().build();
            style.removeAttribute('lang');
        });
    };

    /**
     * Initially parse Windi CSS directives, compute the styles and install a mutation overserver.
     */
    const init = async () => {
        // parse all directives like @apply
        if (parseCss) {
            parseStyles(document.documentElement);
        }
        // collect all classes and tags
        process(root);
        // update styles immediately in order to have correct styling when showing the root element
        update();
        // remove hidden attribute from html, body and root elements
        [document.documentElement, document.body, root].forEach(elem => {
            if (elem.hidden) {
                elem.removeAttribute('hidden');
            }
        });
        // install mutation observer
        if (watch) {
            // note: a mutation observer does not recognize changes to template content!
            new MutationObserver(mutations => {
                mutations.forEach(({ type, target, attributeName, addedNodes }) => {
                    // @ts-ignore (target is always an Element)
                    type === 'attributes' && attributeName === 'class' && process(target, false);
                    // @ts-ignore (node is always an Element)
                    type === 'childList' && addedNodes.forEach(node => node.nodeType === Node.ELEMENT_NODE && process(node));
                });
                scheduleUpdate();
            }).observe(root, {
                childList: true,
                subtree: true,
                attributeFilter: ['class'] // implicitely sets attributes to true
            });
        }
    };

    /**
     * Entry point
     */
    if (typeof window === 'undefined') {
        console.warn('Windify cannot be used outside of a browser.');
        return;
    }
    await init();
    return async (...elements) => {
        elements.forEach(elem => {
            parseCss && parseStyles(elem);
            process(elem);
        });
        // We knowingly don't await the update of the styles. Subsequent calls to process()
        // will not trigger an update if the styles are already up to date or if the styles
        // are still being processed.
        scheduleUpdate();
    };

};
