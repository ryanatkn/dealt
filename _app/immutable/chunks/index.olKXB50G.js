import{E as M,M as z,O as L,w as P,k as U,J as C,P as W,x as q,D as y,T as B,Q as A,R as N,U as I}from"./runtime.BxixJYQn.js";import{b as j}from"./render.CII73B8B.js";const D=()=>performance.now(),l={tick:r=>requestAnimationFrame(r),now:()=>D(),tasks:new Set};function R(){const r=l.now();l.tasks.forEach(t=>{t.c(r)||(l.tasks.delete(t),t.f())}),l.tasks.size!==0&&l.tick(R)}function G(r){let t;return l.tasks.size===0&&l.tick(R),{promise:new Promise(a=>{l.tasks.add(t={c:r,f:a})}),abort(){l.tasks.delete(t)}}}function b(r,t){r.dispatchEvent(new CustomEvent(t))}function J(r){if(r==="float")return"cssFloat";if(r==="offset")return"cssOffset";if(r.startsWith("--"))return r;const t=r.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(a=>a[0].toUpperCase()+a.slice(1)).join("")}function O(r){const t={},a=r.split(";");for(const e of a){const[v,o]=e.split(":");if(!v||o===void 0)break;const c=J(v.trim());t[c]=o.trim()}return t}const K=r=>r;function X(r,t,a,e){var v=(r&B)!==0,o="both",c,m=t.inert,u,s;function i(){var n=I,_=C;A(null),N(null);try{return c??(c=a()(t,(e==null?void 0:e())??{},{direction:o}))}finally{A(n),N(_)}}var $={is_global:v,in(){t.inert=m,b(t,"introstart"),u=E(t,i(),s,1,()=>{b(t,"introend"),u==null||u.abort(),u=c=void 0})},out(n){t.inert=!0,b(t,"outrostart"),s=E(t,i(),u,0,()=>{b(t,"outroend"),n==null||n()})},stop:()=>{u==null||u.abort(),s==null||s.abort()}},p=C;if((p.transitions??(p.transitions=[])).push($),j){var h=v;if(!h){for(var d=p.parent;d&&d.f&M;)for(;(d=d.parent)&&!(d.f&z););h=!d||(d.f&L)!==0}h&&P(()=>{U(()=>$.in())})}}function E(r,t,a,e,v){var o=e===1;if(W(t)){var c,m=!1;return q(()=>{if(!m){var _=t({direction:o?"in":"out"});c=E(r,_,a,e,v)}}),{abort:()=>{m=!0,c==null||c.abort()},deactivate:()=>c.deactivate(),reset:()=>c.reset(),t:()=>c.t()}}if(a==null||a.deactivate(),!(t!=null&&t.duration))return v(),{abort:y,deactivate:y,reset:y,t:()=>e};const{delay:u=0,css:s,tick:i,easing:$=K}=t;var p=[];if(o&&a===void 0&&(i&&i(0,1),s)){var h=O(s(0,1));p.push(h,h)}var d=()=>1-e,n=r.animate(p,{duration:u});return n.onfinish=()=>{var _=(a==null?void 0:a.t())??1-e;a==null||a.abort();var f=e-_,g=t.duration*Math.abs(f),k=[];if(g>0){if(s)for(var T=Math.ceil(g/16.666666666666668),F=0;F<=T;F+=1){var x=_+f*$(F/T),S=s(x,1-x);k.push(O(S))}d=()=>{var w=n.currentTime;return _+f*$(w/g)},i&&G(()=>{if(n.playState!=="running")return!1;var w=d();return i(w,1-w),!0})}n=r.animate(k,{duration:g,fill:"forwards"}),n.onfinish=()=>{d=()=>e,i==null||i(e,1-e),v()}},{abort:()=>{n&&(n.cancel(),n.effect=null,n.onfinish=y)},deactivate:()=>{v=y},reset:()=>{e===0&&(i==null||i(1,0))},t:()=>d()}}function Q(r){const t=r-1;return t*t*t+1}function Y(r,{delay:t=0,duration:a=400,easing:e=Q,axis:v="y"}={}){const o=getComputedStyle(r),c=+o.opacity,m=v==="y"?"height":"width",u=parseFloat(o[m]),s=v==="y"?["top","bottom"]:["left","right"],i=s.map(f=>`${f[0].toUpperCase()}${f.slice(1)}`),$=parseFloat(o[`padding${i[0]}`]),p=parseFloat(o[`padding${i[1]}`]),h=parseFloat(o[`margin${i[0]}`]),d=parseFloat(o[`margin${i[1]}`]),n=parseFloat(o[`border${i[0]}Width`]),_=parseFloat(o[`border${i[1]}Width`]);return{delay:t,duration:a,easing:e,css:f=>`overflow: hidden;opacity: ${Math.min(f*20,1)*c};${m}: ${f*u}px;padding-${s[0]}: ${f*$}px;padding-${s[1]}: ${f*p}px;margin-${s[0]}: ${f*h}px;margin-${s[1]}: ${f*d}px;border-${s[0]}-width: ${f*n}px;border-${s[1]}-width: ${f*_}px;`}}export{Y as s,X as t};
