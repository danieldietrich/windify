const p=function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function d(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(e){if(e.ep)return;e.ep=!0;const o=d(e);fetch(e.href,o)}};p();const scriptRel="modulepreload",seen={},base="/",__vitePreload=function(l,d){return!d||d.length===0?l():Promise.all(d.map(c=>{if(c=`${base}${c}`,c in seen)return;seen[c]=!0;const e=c.endsWith(".css"),o=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${o}`))return;const s=document.createElement("link");if(s.rel=e?"stylesheet":scriptRel,e||(s.as="script",s.crossOrigin=""),s.href=c,document.head.appendChild(s),e)return new Promise((w,y)=>{s.addEventListener("load",w),s.addEventListener("error",y)})})).then(()=>l())};var windify=async i=>{const{minify:l,parseCss:d,preflight:c,root:e,watch:o,windiCssVersion:s,config:w}=Object.assign({minify:!1,parseCss:!0,preflight:!0,root:document.body,watch:!0,windiCssVersion:"latest"},i),{default:y}=await __vitePreload(()=>import(`https://esm.run/windicss@${s}`),[]),f=new y(w),h=f.interpret().styleSheet,v=document.head.appendChild(document.createElement("style")),b=new Set,u=new Set,E=new Set,m=new Set,g=n=>{if(n.nodeType===Node.ELEMENT_NODE){const r=n.querySelectorAll("*");[n,...r].forEach(t=>{if(t.nodeType===Node.ELEMENT_NODE&&(t.classList.length>0&&t.classList.forEach(a=>!b.has(a)&&u.add(a)),c)){const a=t.nodeName.toLowerCase();!E.has(a)&&m.add(a)}})}},A=(()=>{const n=window.requestAnimationFrame||(t=>setTimeout(t,16.66));let r=0;return()=>r==0&&(r=n(()=>{S(),r=0}))})(),S=()=>{if(u.size){const n=Array.from(u).join(" "),r=f.interpret(n).styleSheet;h.extend(r),u.forEach(t=>b.add(t)),u.clear()}if(c&&m.size){const n=Array.from(m).map(t=>`<${t}`).join(" "),r=f.preflight(n);h.extend(r),m.forEach(t=>E.add(t)),m.clear()}h.sort(),v.innerHTML=h.build(l)},$=async()=>{if(d){const{CSSParser:n}=await __vitePreload(()=>import(`https://esm.run/windicss@${s}/utils/parser`),[]);[document,...Array.from(document.querySelectorAll("template")).map(r=>r.content)].forEach(r=>r.querySelectorAll("style[lang='windi']").forEach(t=>{const a=new n(t.innerHTML,f);t.innerHTML=a.parse().build(),t.removeAttribute("lang")}))}g(e),S(),[document.documentElement,document.body,e].forEach(n=>{n.hidden&&n.removeAttribute("hidden")}),o&&new MutationObserver(n=>{n.forEach(({type:r,target:t,addedNodes:a})=>{r==="attributes"&&g(t),r==="childList"&&a.forEach(L=>g(L))}),!!(u.size+m.size)&&A()}).observe(e,{childList:!0,subtree:!0,attributeFilter:["class"]}),window.dispatchEvent(new Event("windify-ready"))};if(typeof window=="undefined"){console.warn("Windify cannot be used outside of a browser.");return}await $()};windify({config:{darkMode:"class"}}).then(compify);function compify(){document.querySelectorAll("web-component").forEach(wc=>{const{id}=wc,script=wc.querySelector("script"),template=wc.querySelector("template");if(id&&(script||template)){const mode=wc.getAttribute("mode"),{attributes}=template,clazz=`
              (class extends HTMLElement {
                constructor() {
                  super();
                  ${script.innerText}
                  if (constructor) {
                    constructor = constructor.bind(this);
                    constructor();
                  }
                  const templateContent = document.querySelector('web-component#${id} > template').content;
                  const fragment = templateContent.cloneNode(true);
                  // TODO(@@dd): we might need to this.appendChild(fragment) in the connectedCallback()
                  ${mode?`
                      console.log("Creating shadowRoot[mode='" + mode + "']");
                      const shadowRoot = this.attachShadow({mode: '${mode}'}).appendChild(fragment);
                    `:`
                      console.log("Shadowless root");
                      this.appendChild(fragment);
                    `}
                }
                static get observedAttributes() {
                  return [${Array.from(attributes).map(i=>`'${i.name}'`).join(", ")}];
                }
                attributeChangedCallback(name, oldValue, newValue) {
                  if (oldValue !== newValue) {
                    return;
                  }
                  switch (name) {
                    ${Array.from(attributes).map(i=>`
                      case '${i.name}':
                        console.log('Value changed from ' + oldValue + ' to ' + newValue);
                        break;
                    `).join(`
`)}
                  }
                }
                ${Array.from(attributes).map(i=>`
                  get ${i.name}() {
                    return this.getAttribute('${i.name}');
                  }
                  set ${i.name}(v) {
                    if (a === '' || a === false) {
                      this.removeAttribute('${i.name}');
                    } else {
                      this.setAttribute('${i.name}', v);
                    }
                  }
                `).join(`
`)}
              })`;console.log(clazz),customElements.define(id,eval(clazz))}}),window.dispatchEvent(new Event("compify-ready"))}
