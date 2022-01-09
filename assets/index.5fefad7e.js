const p=function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function d(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(e){if(e.ep)return;e.ep=!0;const o=d(e);fetch(e.href,o)}};p();const scriptRel="modulepreload",seen={},base="/",__vitePreload=function(l,d){return!d||d.length===0?l():Promise.all(d.map(c=>{if(c=`${base}${c}`,c in seen)return;seen[c]=!0;const e=c.endsWith(".css"),o=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${o}`))return;const i=document.createElement("link");if(i.rel=e?"stylesheet":scriptRel,e||(i.as="script",i.crossOrigin=""),i.href=c,document.head.appendChild(i),e)return new Promise((y,w)=>{i.addEventListener("load",y),i.addEventListener("error",w)})})).then(()=>l())};var windify=async s=>{const{minify:l,parseCss:d,preflight:c,root:e,watch:o,windiCssVersion:i,config:y}=Object.assign({minify:!1,parseCss:!0,preflight:!0,root:document.body,watch:!0,windiCssVersion:"latest"},s),{default:w}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}`),[]),m=new w(y),h=m.interpret().styleSheet,S=document.head.appendChild(document.createElement("style")),E=new Set,u=new Set,g=new Set,f=new Set,b=n=>{if(n.nodeType===Node.ELEMENT_NODE){const r=n.querySelectorAll("*");[n,...r].forEach(t=>{if(t.nodeType===Node.ELEMENT_NODE&&(t.classList.length>0&&t.classList.forEach(a=>!E.has(a)&&u.add(a)),c)){const a=t.nodeName.toLowerCase();!g.has(a)&&f.add(a)}})}},A=(()=>{const n=window.requestAnimationFrame||(t=>setTimeout(t,16.66));let r=0;return()=>r==0&&(r=n(()=>{v(),r=0}))})(),v=()=>{if(u.size){const n=Array.from(u).join(" "),r=m.interpret(n).styleSheet;h.extend(r),u.forEach(t=>E.add(t)),u.clear()}if(c&&f.size){const n=Array.from(f).map(t=>`<${t}`).join(" "),r=m.preflight(n);h.extend(r),f.forEach(t=>g.add(t)),f.clear()}h.sort(),S.innerHTML=h.build(l)},C=async()=>{if(d){const{CSSParser:n}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}/utils/parser`),[]);[document,...Array.from(document.querySelectorAll("template")).map(r=>r.content)].forEach(r=>r.querySelectorAll("style[lang='windi']").forEach(t=>{const a=new n(t.innerHTML,m);t.innerHTML=a.parse().build(),t.removeAttribute("lang")}))}b(e),v(),[document.documentElement,document.body,e].forEach(n=>{n.hidden&&n.removeAttribute("hidden")}),o&&new MutationObserver(n=>{n.forEach(({type:r,target:t,addedNodes:a})=>{r==="attributes"&&b(t),r==="childList"&&a.forEach(L=>b(L))}),!!(u.size+f.size)&&A()}).observe(e,{childList:!0,subtree:!0,attributeFilter:["class"]}),window.dispatchEvent(new Event("windify-ready"))};if(typeof window=="undefined"){console.warn("Windify cannot be used outside of a browser.");return}await C()};windify({config:{darkMode:"class"}}).then(compify);function compify(){document.querySelectorAll("web-component").forEach(wc=>{const{id}=wc,template=wc.querySelector("template");if(id&&template){const script=Array.from(template.content.querySelectorAll("script[lang='webify']")).map(s=>s.parentNode.removeChild(s).innerText).join(`
`),mode=wc.getAttribute("mode"),attributes=Array.from(template.attributes),clazz=`
              (class extends HTMLElement {

                constructor() {
                  super();
                  (() => {
                    ${script}
                  })();
                  /*
                  [this.connectedCallback, this.disconnectedCallback, this.attributeChangedCallback, this.adoptedCallback].forEach(cb => {
                    cb && (cb = cb.bind(this))
                  }, this);
                  */
                  const templateContent = document.querySelector('web-component#${id} > template').content;
                  const fragment = templateContent.cloneNode(true);
                  ${mode?`this.attachShadow({mode: '${mode}'}).appendChild(fragment);`:"this.appendChild(fragment);"}
                }

                connectedCallback() {
                  [${attributes.map(s=>`'${s.name}'`).join(", ")}].forEach(prop => {
                    if (this.hasOwnProperty(prop)) {
                      let value = this[prop];
                      delete this[prop];
                      this[prop] = value;
                    }
                  });
                }

                static get observedAttributes() {
                  return [${attributes.map(s=>`'${s.name}'`).join(", ")}];
                }

                ${attributes.map(s=>`
                get ${s.name}() { return this.getAttribute('${s.name}'); }
                set ${s.name}(v) { return this._set('${s.name}', v); }
                `).join(`
`)}

                _set(p, v) {
                  if (v === null || v === undefined || v === false) {
                    this.removeAttribute(p);
                  } else {
                    this.setAttribute(p, v === true ? '' : v);
                  }
                }
              })`;console.log(clazz),customElements.define(id,eval(clazz))}}),window.dispatchEvent(new Event("compify-ready"))}
