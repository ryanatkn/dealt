import{a as c,t as q,c as k,b as S}from"./disclose-version.q2jLZV-J.js";import{q as P,m as j,o as Q,c as d,v as y,r as u,s as R,K as a,L as f}from"./runtime.SGEKD4Mg.js";import{s as T}from"./render.DBRt5oD9.js";import{s as U,i as B,a as V}from"./props.CnXMf3nV.js";import{e as W,i as X,s as w,t as z,d as Y,c as Z}from"./string.BgPVBQXn.js";import{s as A}from"./snippet.PgYwo71m.js";import{b as $}from"./paths.CGn1FJ2T.js";import{s as ee}from"./entry.B13nh63G.js";const ae=t=>t.split("/").filter(e=>e&&e!=="."&&e!==".."),te=t=>{const e=[],i=ae(t);i.length&&e.push({type:"separator",path:"/"});let v="";for(let s=0;s<i.length;s++){const _=i[s];v+="/"+_,e.push({type:"piece",name:_,path:v}),s!==i.length-1&&e.push({type:"separator",path:v})}return e},se=()=>{const t=ee;return{page:{subscribe:t.page.subscribe},navigating:{subscribe:t.navigating.subscribe},updated:t.updated}},re={subscribe(t){return se().page.subscribe(t)}};var oe=q('<a class="svelte-c9k2g"> </a>'),ne=q('<span class="separator svelte-c9k2g"><!></span>'),ce=q('<div class="breadcrumb svelte-c9k2g"><a class="svelte-c9k2g"><!></a><!></div>');function he(t,e){P(e,!0);const i=U(),v=()=>V(re,"$page",i),s=f(()=>e.base_path??$),_=f(()=>e.path??Y(v().url.pathname,a(s))),K=f(()=>e.selected_path===null?null:e.selected_path??a(_)),C=f(()=>te(a(_))),L=f(()=>Z(a(s),"/"));var b=ce(),m=d(b),D=d(m);{var E=n=>{var r=k(),g=y(r);A(g,()=>e.children),c(n,r)},F=n=>{var r=S("•");c(n,r)};B(D,n=>{e.children?n(E):n(F,!1)})}u(m);var G=R(m);W(G,17,()=>a(C),X,(n,r)=>{var g=k(),H=y(g);{var I=p=>{var o=oe(),x=d(o,!0);u(o),j(()=>{w(o,"href",a(s)+a(r).path),z(o,"selected",a(r).path===a(K)),T(x,a(r).name)}),c(p,o)},J=p=>{var o=ne(),x=d(o);{var M=l=>{var h=k(),O=y(h);A(O,()=>e.separator),c(l,h)},N=l=>{var h=S("/");c(l,h)};B(x,l=>{e.separator?l(M):l(N,!1)})}u(o),c(p,o)};B(H,p=>{a(r).type==="piece"?p(I):p(J,!1)})}c(n,g)}),u(b),j(()=>{w(m,"href",a(L)),z(m,"selected",a(L)===a(s)+a(K))}),c(t,b),Q()}export{he as B,re as p};