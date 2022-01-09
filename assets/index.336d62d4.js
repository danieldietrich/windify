const p=function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function d(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(e){if(e.ep)return;e.ep=!0;const s=d(e);fetch(e.href,s)}};p();const scriptRel="modulepreload",seen={},base="/",__vitePreload=function(a,d){return!d||d.length===0?a():Promise.all(d.map(c=>{if(c=`${base}${c}`,c in seen)return;seen[c]=!0;const e=c.endsWith(".css"),s=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${s}`))return;const i=document.createElement("link");if(i.rel=e?"stylesheet":scriptRel,e||(i.as="script",i.crossOrigin=""),i.href=c,document.head.appendChild(i),e)return new Promise((w,y)=>{i.addEventListener("load",w),i.addEventListener("error",y)})})).then(()=>a())};var windify=async t=>{const{minify:a,parseCss:d,preflight:c,root:e,watch:s,windiCssVersion:i,config:w}=Object.assign({minify:!1,parseCss:!0,preflight:!0,root:document.body,watch:!0,windiCssVersion:"latest"},t),{default:y}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}`),[]),h=new y(w),f=h.interpret().styleSheet,v=document.head.appendChild(document.createElement("style")),g=new Set,u=new Set,E=new Set,m=new Set,b=o=>{if(o.nodeType===Node.ELEMENT_NODE){const r=o.querySelectorAll("*");[o,...r].forEach(n=>{if(n.nodeType===Node.ELEMENT_NODE&&(n.classList.length>0&&n.classList.forEach(l=>!g.has(l)&&u.add(l)),c)){const l=n.nodeName.toLowerCase();!E.has(l)&&m.add(l)}})}},S=(()=>{const o=window.requestAnimationFrame||(n=>setTimeout(n,16.66));let r=0;return()=>r==0&&(r=o(()=>{C(),r=0}))})(),C=()=>{if(u.size){const o=Array.from(u).join(" "),r=h.interpret(o).styleSheet;f.extend(r),u.forEach(n=>g.add(n)),u.clear()}if(c&&m.size){const o=Array.from(m).map(n=>`<${n}`).join(" "),r=h.preflight(o);f.extend(r),m.forEach(n=>E.add(n)),m.clear()}f.sort(),v.innerHTML=f.build(a)},A=async()=>{if(d){const{CSSParser:o}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}/utils/parser`),[]);[document,...Array.from(document.querySelectorAll("template")).map(r=>r.content)].forEach(r=>r.querySelectorAll("style[lang='windi']").forEach(n=>{const l=new o(n.innerHTML,h);n.innerHTML=l.parse().build(),n.removeAttribute("lang")}))}b(e),C(),[document.documentElement,document.body,e].forEach(o=>{o.hidden&&o.removeAttribute("hidden")}),s&&new MutationObserver(o=>{o.forEach(({type:r,target:n,addedNodes:l})=>{r==="attributes"&&b(n),r==="childList"&&l.forEach(L=>b(L))}),!!(u.size+m.size)&&S()}).observe(e,{childList:!0,subtree:!0,attributeFilter:["class"]}),window.dispatchEvent(new Event("windify-ready"))};if(typeof window=="undefined"){console.warn("Windify cannot be used outside of a browser.");return}await A()};windify({config:{darkMode:"class"}}).then(compify);function compify(){document.querySelectorAll("web-component").forEach(wc=>{const{id}=wc,template=wc.querySelector("template");if(id&&template){const script=Array.from(template.content.querySelectorAll("script[lang='webify']")).map(t=>t.parentNode.removeChild(t).innerText).join(`
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
                }

                connectedCallback() {
                  if (!this.isConnected) {
                    return;
                  }
                  [${attributes.map(t=>`'${t.name}'`).join(", ")}].forEach(prop => {
                    if (this.hasOwnProperty(prop)) {
                      let value = this[prop];
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
                  this.hasOwnProperty('disconnectedCallback') && this['disconnectedCallback'](name, oldValue, newValue);
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
              })`;console.log(clazz),customElements.define(id,eval(clazz));{const t=document.createElement("div");t.innerHTML="<hello-world></hello-world>";const a=t.firstChild;var one=document.getElementById("one"),two=document.getElementById("two");console.log("!! appending to one"),one.appendChild(a),console.log("!! appending to two"),two.appendChild(a),console.log("!! appending to one"),one.appendChild(a),console.log("!! appending to two"),two.appendChild(a)}}}),window.dispatchEvent(new Event("compify-ready"))}
