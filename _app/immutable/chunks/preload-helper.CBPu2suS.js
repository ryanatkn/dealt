import{w as S,k,j as w,x as y,S as P}from"./runtime.SGEKD4Mg.js";function f(r,s){return r===s||(r==null?void 0:r[P])===s}function q(r={},s,c,d){return S(()=>{var a,e;return k(()=>{a=e,e=[],w(()=>{r!==c(...e)&&(s(r,...e),a&&f(c(...a),r)&&s(null,...a))})}),()=>{y(()=>{e&&f(c(...e),r)&&s(null,...e)})}}),r}const g="modulepreload",L=function(r){return"/"+r},u={},v=function(s,c,d){let a=Promise.resolve();if(c&&c.length>0){document.getElementsByTagName("link");const t=document.querySelector("meta[property=csp-nonce]"),n=(t==null?void 0:t.nonce)||(t==null?void 0:t.getAttribute("nonce"));a=Promise.allSettled(c.map(i=>{if(i=L(i),i in u)return;u[i]=!0;const l=i.endsWith(".css"),h=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${h}`))return;const o=document.createElement("link");if(o.rel=l?"stylesheet":g,l||(o.as="script"),o.crossOrigin="",o.href=i,n&&o.setAttribute("nonce",n),document.head.appendChild(o),l)return new Promise((m,E)=>{o.addEventListener("load",m),o.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${i}`)))})}))}function e(t){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=t,window.dispatchEvent(n),!n.defaultPrevented)throw t}return a.then(t=>{for(const n of t||[])n.status==="rejected"&&e(n.reason);return s().catch(e)})};export{v as _,q as b};