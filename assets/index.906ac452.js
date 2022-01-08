const p=function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function u(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(e){if(e.ep)return;e.ep=!0;const o=u(e);fetch(e.href,o)}};p();const scriptRel="modulepreload",seen={},base="/",__vitePreload=function(d,u){return!u||u.length===0?d():Promise.all(u.map(c=>{if(c=`${base}${c}`,c in seen)return;seen[c]=!0;const e=c.endsWith(".css"),o=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${o}`))return;const i=document.createElement("link");if(i.rel=e?"stylesheet":scriptRel,e||(i.as="script",i.crossOrigin=""),i.href=c,document.head.appendChild(i),e)return new Promise((w,E)=>{i.addEventListener("load",w),i.addEventListener("error",E)})})).then(()=>d())};var windify=async a=>{const{minify:d,parseCss:u,preflight:c,root:e,watch:o,windiCssVersion:i,config:w}=Object.assign({minify:!1,parseCss:!0,preflight:!0,root:document.body,watch:!0,windiCssVersion:"latest"},a),{default:E}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}`),[]),h=new E(w),y=h.interpret().styleSheet,A=document.head.appendChild(document.createElement("style")),b=new Set,f=new Set,v=new Set,m=new Set,g=r=>{if(r.nodeType===Node.ELEMENT_NODE){const s=r.querySelectorAll("*");[r,...s].forEach(n=>{if(n.nodeType===Node.ELEMENT_NODE&&(n.classList.length>0&&n.classList.forEach(l=>!b.has(l)&&f.add(l)),c)){const l=n.nodeName.toLowerCase();!v.has(l)&&m.add(l)}})}},L=(()=>{const r=window.requestAnimationFrame||(n=>setTimeout(n,16.66));let s=0;return()=>s==0&&(s=r(()=>{S(),s=0}))})(),S=()=>{if(f.size){const r=Array.from(f).join(" "),s=h.interpret(r).styleSheet;y.extend(s),f.forEach(n=>b.add(n)),f.clear()}if(c&&m.size){const r=Array.from(m).map(n=>`<${n}`).join(" "),s=h.preflight(r);y.extend(s),m.forEach(n=>v.add(n)),m.clear()}y.sort(),A.innerHTML=y.build(d)},_=async()=>{if(u){const{CSSParser:r}=await __vitePreload(()=>import(`https://esm.run/windicss@${i}/utils/parser`),[]);[document,...Array.from(document.querySelectorAll("template")).map(s=>s.content)].forEach(s=>s.querySelectorAll("style[lang='windi']").forEach(n=>{const l=new r(n.innerHTML,h);n.innerHTML=l.parse().build(),n.removeAttribute("lang")}))}g(e),S(),[document.documentElement,document.body,e].forEach(r=>{r.hidden&&r.removeAttribute("hidden")}),o&&new MutationObserver(r=>{r.forEach(({type:s,target:n,addedNodes:l})=>{s==="attributes"&&g(n),s==="childList"&&l.forEach($=>g($))}),!!(f.size+m.size)&&L()}).observe(e,{childList:!0,subtree:!0,attributeFilter:["class"]}),window.dispatchEvent(new Event("windify-ready"))};if(typeof window=="undefined"){console.warn("Windify cannot be used outside of a browser.");return}await _()};windify({config:{darkMode:"class"}}).then(compify);function compify(){document.querySelectorAll("template[type='compify']").forEach(t=>{if(t.id){const{attributes}=t,clazz=`
              (class extends HTMLElement {
                constructor() {
                  super();
                  const templateContent = document.getElementById('${t.id}').content;
                  const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
                }
                static get observedAttributes() {
                  return [${Array.from(attributes).map(a=>`'${a.name}'`).join(", ")}];
                }
                attributeChangedCallback(name, oldValue, newValue) {
                  switch (name) {
                    ${Array.from(attributes).map(a=>`
                      case '${a.name}':
                        console.log('Value changed from ' + oldValue + ' to ' + newValue);
                        break;
                    `).join(`
`)}
                  }
                }
                ${Array.from(t.attributes).map(a=>`
                  get ${a.name}() {
                    return this.getAttribute('${a.name}');
                  }
                  set ${a.name}(v) {
                    if (a === '' || a === false) {
                      this.removeAttribute('${a.name}');
                    } else {
                      this.setAttribute('${a.name}', v);
                    }
                  }
                `).join(`
`)}
              })`;console.log(clazz),customElements.define(t.id,eval(clazz))}}),window.dispatchEvent(new Event("compify-ready"))}
