const T=function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}};T();const v="modulepreload",g={},C="/",L=function(c,l){return!l||l.length===0?c():Promise.all(l.map(s=>{if(s=`${C}${s}`,s in g)return;g[s]=!0;const e=s.endsWith(".css"),t=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${t}`))return;const i=document.createElement("link");if(i.rel=e?"stylesheet":v,e||(i.as="script",i.crossOrigin=""),i.href=s,document.head.appendChild(i),e)return new Promise((f,a)=>{i.addEventListener("load",f),i.addEventListener("error",a)})})).then(()=>c())};(async()=>{const{minify:p,parseCss:c,preflight:l,root:s,watch:e,windiCssVersion:t,config:i}=Object.assign({minify:!1,parseCss:!0,preflight:!0,root:document.body,watch:!0,windiCssVersion:"latest"},window.windifyOptions),f=new Set,a=new Set,E=new Set,d=new Set,y=o=>{if(o.nodeType===Node.ELEMENT_NODE){const n=o.querySelectorAll("*");[o,...n].forEach(r=>{if(r.nodeType===Node.ELEMENT_NODE&&(r.classList.length>0&&r.classList.forEach(u=>!f.has(u)&&a.add(u)),l)){const u=r.nodeName.toLowerCase();!E.has(u)&&d.add(u)}})}},{default:S}=await L(()=>import(`https://esm.run/windicss@${t}`),[]),h=new S(i),m=h.interpret().styleSheet,_=document.head.appendChild(document.createElement("style")),b=(()=>{const o=window.requestAnimationFrame||(r=>setTimeout(r,16.66));let n=0;return()=>n==0&&(n=o(()=>{w(),n=0}))})(),w=()=>{if(a.size){const o=Array.from(a).join(" "),n=h.interpret(o).styleSheet;m.extend(n),a.forEach(r=>f.add(r)),a.clear()}if(l&&d.size){const o=Array.from(d).map(r=>`<${r}`).join(" "),n=h.preflight(o);m.extend(n),d.forEach(r=>E.add(r)),d.clear()}m.sort(),_.innerHTML=m.build(p)};(async()=>{if(c){const{CSSParser:o}=await L(()=>import(`https://esm.run/windicss@${t}/utils/parser`),[]);document.querySelectorAll("style[lang='windi']").forEach(n=>{const r=new o(n.innerHTML,h);n.innerHTML=r.parse().build()})}y(s),w(),s.hidden&&s.removeAttribute("hidden"),e&&new MutationObserver(o=>{o.forEach(({type:n,target:r,addedNodes:u})=>{n==="attributes"&&y(r),n==="childList"&&u.forEach(O=>y(O))}),!!(a.size+d.size)&&b()}).observe(s,{childList:!0,subtree:!0,attributeFilter:["class"]})})()})();
