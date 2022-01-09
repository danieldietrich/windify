const p=function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function d(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function c(e){if(e.ep)return;e.ep=!0;const s=d(e);fetch(e.href,s)}};p();const scriptRel="modulepreload",seen={},base="/",__vitePreload=function(l,d){return!d||d.length===0?l():Promise.all(d.map(c=>{if(c=`${base}${c}`,c in seen)return;seen[c]=!0;const e=c.endsWith(".css"),s=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${s}`))return;const i=document.createElement("link");if(i.rel=e?"stylesheet":scriptRel,e||(i.as="script",i.crossOrigin=""),i.href=c,document.head.appendChild(i),e)return new Promise((y,w)=>{i.addEventListener("load",y),i.addEventListener("error",w)})})).then(()=>l())};var windify=async n=>{const{minify:l,parseCss:d,preflight:c,root:e,watch:s,windiCssVersion:i,config:y}=Object.assign({minify:!1,parseCss:!0,preflight:!0,root:document.body,watch:!0,windiCssVersion:"latest"},n),{default:w}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}`),[]),f=new w(y),h=f.interpret().styleSheet,S=document.head.appendChild(document.createElement("style")),E=new Set,u=new Set,g=new Set,m=new Set,b=r=>{if(r.nodeType===Node.ELEMENT_NODE){const o=r.querySelectorAll("*");[r,...o].forEach(t=>{if(t.nodeType===Node.ELEMENT_NODE&&(t.classList.length>0&&t.classList.forEach(a=>!E.has(a)&&u.add(a)),c)){const a=t.nodeName.toLowerCase();!g.has(a)&&m.add(a)}})}},A=(()=>{const r=window.requestAnimationFrame||(t=>setTimeout(t,16.66));let o=0;return()=>o==0&&(o=r(()=>{v(),o=0}))})(),v=()=>{if(u.size){const r=Array.from(u).join(" "),o=f.interpret(r).styleSheet;h.extend(o),u.forEach(t=>E.add(t)),u.clear()}if(c&&m.size){const r=Array.from(m).map(t=>`<${t}`).join(" "),o=f.preflight(r);h.extend(o),m.forEach(t=>g.add(t)),m.clear()}h.sort(),S.innerHTML=h.build(l)},C=async()=>{if(d){const{CSSParser:r}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}/utils/parser`),[]);[document,...Array.from(document.querySelectorAll("template")).map(o=>o.content)].forEach(o=>o.querySelectorAll("style[lang='windi']").forEach(t=>{const a=new r(t.innerHTML,f);t.innerHTML=a.parse().build(),t.removeAttribute("lang")}))}b(e),v(),[document.documentElement,document.body,e].forEach(r=>{r.hidden&&r.removeAttribute("hidden")}),s&&new MutationObserver(r=>{r.forEach(({type:o,target:t,addedNodes:a})=>{o==="attributes"&&b(t),o==="childList"&&a.forEach($=>b($))}),!!(u.size+m.size)&&A()}).observe(e,{childList:!0,subtree:!0,attributeFilter:["class"]}),window.dispatchEvent(new Event("windify-ready"))};if(typeof window=="undefined"){console.warn("Windify cannot be used outside of a browser.");return}await C()};windify({config:{darkMode:"class"}}).then(compify);function compify(){document.querySelectorAll("web-component").forEach(wc=>{const{id}=wc,template=wc.querySelector("template");if(id&&template){const script=Array.from(template.content.querySelectorAll("script[lang='webify']")).map(n=>n.parentNode.removeChild(n).innerText).join(`
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
                  [${attributes.map(n=>`'${n.name}'`).join(", ")}].forEach(prop => {
                    if (this.hasOwnProperty(prop)) {
                      let value = this[prop];
                      delete this[prop];
                      this[prop] = value;
                    }
                  });
                }

                static get observedAttributes() {
                  return [${attributes.map(n=>`'${n.name}'`).join(", ")}];
                }

                ${attributes.map(n=>`
                  get ${n.name}() {
                    return this.getAttribute('${n.name}');
                  }
                  set ${n.name}(v) {
                    if (v === null || v === undefined || v === false) {
                      this.removeAttribute('${n.name}');
                    } else {
                      this.setAttribute('${n.name}', v === true ? '' : v);
                    }
                  }
                `).join(`
`)}
              })`;console.log(clazz),customElements.define(id,eval(clazz))}}),window.dispatchEvent(new Event("compify-ready"))}
