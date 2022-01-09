const p=function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const s of e)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function d(e){const s={};return e.integrity&&(s.integrity=e.integrity),e.referrerpolicy&&(s.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?s.credentials="include":e.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(e){if(e.ep)return;e.ep=!0;const s=d(e);fetch(e.href,s)}};p();const scriptRel="modulepreload",seen={},base="/",__vitePreload=function(l,d){return!d||d.length===0?l():Promise.all(d.map(a=>{if(a=`${base}${a}`,a in seen)return;seen[a]=!0;const e=a.endsWith(".css"),s=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${s}`))return;const i=document.createElement("link");if(i.rel=e?"stylesheet":scriptRel,e||(i.as="script",i.crossOrigin=""),i.href=a,document.head.appendChild(i),e)return new Promise((y,w)=>{i.addEventListener("load",y),i.addEventListener("error",w)})})).then(()=>l())};var windify=async n=>{const{minify:l,parseCss:d,preflight:a,root:e,watch:s,windiCssVersion:i,config:y}=Object.assign({minify:!1,parseCss:!0,preflight:!0,root:document.body,watch:!0,windiCssVersion:"latest"},n),{default:w}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}`),[]),f=new w(y),h=f.interpret().styleSheet,S=document.head.appendChild(document.createElement("style")),g=new Set,u=new Set,E=new Set,m=new Set,b=r=>{if(r.nodeType===Node.ELEMENT_NODE){const o=r.querySelectorAll("*");[r,...o].forEach(t=>{if(t.nodeType===Node.ELEMENT_NODE&&(t.classList.length>0&&t.classList.forEach(c=>!g.has(c)&&u.add(c)),a)){const c=t.nodeName.toLowerCase();!E.has(c)&&m.add(c)}})}},C=(()=>{const r=window.requestAnimationFrame||(t=>setTimeout(t,16.66));let o=0;return()=>o==0&&(o=r(()=>{v(),o=0}))})(),v=()=>{if(u.size){const r=Array.from(u).join(" "),o=f.interpret(r).styleSheet;h.extend(o),u.forEach(t=>g.add(t)),u.clear()}if(a&&m.size){const r=Array.from(m).map(t=>`<${t}`).join(" "),o=f.preflight(r);h.extend(o),m.forEach(t=>E.add(t)),m.clear()}h.sort(),S.innerHTML=h.build(l)},A=async()=>{if(d){const{CSSParser:r}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}/utils/parser`),[]);[document,...Array.from(document.querySelectorAll("template")).map(o=>o.content)].forEach(o=>o.querySelectorAll("style[lang='windi']").forEach(t=>{const c=new r(t.innerHTML,f);t.innerHTML=c.parse().build(),t.removeAttribute("lang")}))}b(e),v(),[document.documentElement,document.body,e].forEach(r=>{r.hidden&&r.removeAttribute("hidden")}),s&&new MutationObserver(r=>{r.forEach(({type:o,target:t,addedNodes:c})=>{o==="attributes"&&b(t),o==="childList"&&c.forEach($=>b($))}),!!(u.size+m.size)&&C()}).observe(e,{childList:!0,subtree:!0,attributeFilter:["class"]}),window.dispatchEvent(new Event("windify-ready"))};if(typeof window=="undefined"){console.warn("Windify cannot be used outside of a browser.");return}await A()};windify({config:{darkMode:"class"}}).then(compify);function compify(){document.querySelectorAll("web-component").forEach(wc=>{const{id}=wc,template=wc.querySelector("template");if(id&&template){const script=Array.from(template.content.querySelectorAll("script[lang='webify']")).map(n=>n.parentNode.removeChild(n).innerText).join(`
`),mode=wc.getAttribute("mode"),{attributes}=template,clazz=`
              (class extends HTMLElement {
                constructor() {
                  super();
                  (() => {
                    ${script};
                    [connectedCallback, disconnectedCallback, attributeChangedCallback, adoptedCallback].forEach(cb =>
                      cb && (cb = cb.bind(this))
                    );
                  })();
                  const templateContent = document.querySelector('web-component#${id} > template').content;
                  const fragment = templateContent.cloneNode(true);
                  // TODO(@@dd): we might need to this.appendChild(fragment) in the connectedCallback()
                  ${mode?`this.attachShadow({mode: '${mode}'}).appendChild(fragment);`:"this.appendChild(fragment);"}
                }
                static get observedAttributes() {
                  return [${Array.from(attributes).map(n=>`'${n.name}'`).join(", ")}];
                }
                attributeChangedCallback(name, oldValue, newValue) {
                  if (oldValue === newValue) {
                    return;
                  }
                  switch (name) {
                    ${Array.from(attributes).map(n=>`
                      case '${n.name}':
                        console.log('Value ' + name + ' changed from ' + oldValue + ' to ' + newValue);
                        break;
                    `).join(`
`)}
                  }
                }
                ${Array.from(attributes).map(n=>`
                  get ${n.name}() {
                    return this.getAttribute('${n.name}');
                  }
                  // TODO: handle undefined, true, false in a special way?
                  set ${n.name}(v) {
                    if (v === null) {
                      this.removeAttribute('${n.name}');
                    } else {
                      this.setAttribute('${n.name}', v);
                    }
                  }
                `).join(`
`)}
              })`;console.log(clazz),customElements.define(id,eval(clazz))}}),window.dispatchEvent(new Event("compify-ready"))}
