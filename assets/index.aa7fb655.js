const p=function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function d(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(e){if(e.ep)return;e.ep=!0;const o=d(e);fetch(e.href,o)}};p();const scriptRel="modulepreload",seen={},base="/",__vitePreload=function(l,d){return!d||d.length===0?l():Promise.all(d.map(a=>{if(a=`${base}${a}`,a in seen)return;seen[a]=!0;const e=a.endsWith(".css"),o=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${o}`))return;const i=document.createElement("link");if(i.rel=e?"stylesheet":scriptRel,e||(i.as="script",i.crossOrigin=""),i.href=a,document.head.appendChild(i),e)return new Promise((b,y)=>{i.addEventListener("load",b),i.addEventListener("error",y)})})).then(()=>l())};var windify=async t=>{const{minify:l,parseCss:d,preflight:a,root:e,watch:o,windiCssVersion:i,config:b}=Object.assign({minify:!1,parseCss:!0,preflight:!0,root:document.body,watch:!0,windiCssVersion:"latest"},t),{default:y}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}`),[]),m=new y(b),f=m.interpret().styleSheet,v=document.head.appendChild(document.createElement("style")),E=new Set,u=new Set,g=new Set,h=new Set,w=r=>{if(r.nodeType===Node.ELEMENT_NODE){const s=r.querySelectorAll("*");[r,...s].forEach(n=>{if(n.nodeType===Node.ELEMENT_NODE&&(n.classList.length>0&&n.classList.forEach(c=>!E.has(c)&&u.add(c)),a)){const c=n.nodeName.toLowerCase();!g.has(c)&&h.add(c)}})}},S=(()=>{const r=window.requestAnimationFrame||(n=>setTimeout(n,16.66));let s=0;return()=>s==0&&(s=r(()=>{C(),s=0}))})(),C=()=>{if(u.size){const r=Array.from(u).join(" "),s=m.interpret(r).styleSheet;f.extend(s),u.forEach(n=>E.add(n)),u.clear()}if(a&&h.size){const r=Array.from(h).map(n=>`<${n}`).join(" "),s=m.preflight(r);f.extend(s),h.forEach(n=>g.add(n)),h.clear()}f.sort(),v.innerHTML=f.build(l)},k=async()=>{if(d){const{CSSParser:r}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}/utils/parser`),[]);[document,...Array.from(document.querySelectorAll("template")).map(s=>s.content)].forEach(s=>s.querySelectorAll("style[lang='windi']").forEach(n=>{const c=new r(n.innerHTML,m);n.innerHTML=c.parse().build(),n.removeAttribute("lang")}))}w(e),C(),[document.documentElement,document.body,e].forEach(r=>{r.hidden&&r.removeAttribute("hidden")}),o&&new MutationObserver(r=>{r.forEach(({type:s,target:n,addedNodes:c})=>{s==="attributes"&&w(n),s==="childList"&&c.forEach(A=>w(A))}),!!(u.size+h.size)&&S()}).observe(e,{childList:!0,subtree:!0,attributeFilter:["class"]}),window.dispatchEvent(new Event("windify-ready"))};if(typeof window=="undefined"){console.warn("Windify cannot be used outside of a browser.");return}await k()};windify({config:{darkMode:"class"}}).then(compify);function compify(){document.querySelectorAll("web-component").forEach(wc=>{const{id}=wc,template=wc.querySelector("template");if(id&&template){const script=Array.from(template.content.querySelectorAll("script[lang='webify']")).map(t=>t.parentNode.removeChild(t).innerText).join(`
`),mode=wc.getAttribute("mode"),attributes=Array.from(template.attributes),clazz=`
              (class extends HTMLElement {

                constructor() {
                  super();
                  (() => {
                    ${script}
                  })();
                  [this.connectedCallback, this.disconnectedCallback, this.attributeChangedCallback, this.adoptedCallback].forEach(cb => {
                    cb && (cb = cb.bind(this))
                  }, this);
                  const templateContent = document.querySelector('web-component#${id} > template').content;
                  const fragment = templateContent.cloneNode(true);
                  ${mode?`this.attachShadow({mode: '${mode}'}).appendChild(fragment);`:"this.appendChild(fragment);"}
                  [${attributes.map(t=>`['${t.name}', '${t.nodeValue}']`).join(", ")}].forEach(([k, v]) => {
                    if (!this.hasAttribute(k) && v !== '') {
                      this.setAttribute(k, v);
                    }
                  });
                }

                connectedCallback() {
                  if (!this.isConnected) {
                    return;
                  }
                  [${attributes.map(t=>`'${t.name}'`).join(", ")}].forEach(prop => {
                    if (this.hasOwnProperty(prop)) {
                      const value = this[prop];
                      delete this[prop];
                      this[prop] = value;
                    }
                  });
                  this.hasOwnProperty('connectedCallback') && this['connectedCallback']();
                }

                disconnectedCallback() {
                  this.hasOwnProperty('disconnectedCallback') && this['disconnectedCallback']();
                }

                attributeChangedCallback(name, oldValue, newValue) {
                  this.hasOwnProperty('attributeChangedCallback') && this['attributeChangedCallback'](name, oldValue, newValue);
                }

                adoptedCallback() {
                  this.hasOwnProperty('adoptedCallback') && this['adoptedCallback']();
                }

                static get observedAttributes() {
                  return [${attributes.map(t=>`'${t.name}'`).join(", ")}];
                }

                ${attributes.map(t=>`
                get ${t.name}() { return this.getAttribute('${t.name}'); }
                set ${t.name}(v) { return this._set('${t.name}', v); }
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
