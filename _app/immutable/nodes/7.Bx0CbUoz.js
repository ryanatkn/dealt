var wt=n=>{throw TypeError(n)};var zt=(n,e,t)=>e.has(n)||wt("Cannot "+t);var x=(n,e,t)=>(zt(n,e,"read from private field"),t?t.call(n):e.get(n)),S=(n,e,t)=>e.has(n)?wt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t);import{t as Ft,b as W,a as J,h as Ht}from"../chunks/DyCZ_lw9.js";import{ai as I,w as M,X as j,x as Xt,m as St,ah as $t,u as qt,q as bt,j as Gt,c as l,n as Y,r as p,s as v,o as Lt,$ as Wt}from"../chunks/Dkaln31E.js";import{e as Yt}from"../chunks/BS5eLBf_.js";import{s as T}from"../chunks/DMs3BEDJ.js";import{p as Zt,i as Kt}from"../chunks/Cr-AO5Xh.js";import{r as ot,s as P}from"../chunks/C07ZAADA.js";import{d as Qt,R as Vt,r as te,c as ee,e as ne,E as se,f as ie,g as at,U as R,S as Z,h as re}from"../chunks/BERuEieG.js";import{o as oe}from"../chunks/gf-WXI_b.js";import{B as ae}from"../chunks/BwrnnQHH.js";import{a as _e,A as ce,D as ue,c as w}from"../chunks/BrtYs_i3.js";import{S as de,F as le,c as _t,a as pe,H as ve,b as he}from"../chunks/DwfeztsL.js";import{R as me}from"../chunks/CUNsfRJx.js";const fe=(n,e,t=Math.random)=>t()*(e-n)+n,xe=(n,e,t=Math.random)=>Math.floor(t()*(e-n+1))+n,ye=(...n)=>{let e=0,t=0,r=0,u=1;const m=n.length?n:[Date.now()];let _=ge();e=_(" "),t=_(" "),r=_(" ");for(const i of m)e-=_(i),e<0&&(e+=1),t-=_(i),t<0&&(t+=1),r-=_(i),r<0&&(r+=1);_=null;const y=()=>{const i=2091639*e+u*23283064365386963e-26;return e=t,t=r,r=i-(u=i|0)};return y.uint32=()=>y()*4294967296,y.fract53=()=>y()+(y()*2097152|0)*11102230246251565e-32,y.version="Alea 0.9",y.seeds=m,y},ge=()=>{let n=4022871197;return e=>{const t=e+"";for(let r=0;r<t.length;r++){n+=t.charCodeAt(r);let u=.02519603282416938*n;n=u>>>0,u-=n,u*=n,n=u>>>0,u-=n,n+=u*4294967296}return(n>>>0)*23283064365386963e-26}};var U,B,k,z,F,H,X;class Et{constructor(e=Qt){S(this,U,I());S(this,B,I());S(this,k,I());S(this,z,I());S(this,F,I());S(this,H,I());S(this,X,Xt(()=>this.toJSON()));const{width:t=800,height:r=600,unit_count:u=72,unit_scale:m=1,renderer_type:_="pixi",simulation_speed:y=1}=e;this.width=t,this.height=r,this.unit_count=u,this.unit_scale=m,this.renderer_type=_,this.simulation_speed=y}get width(){return M(x(this,U))}set width(e){j(x(this,U),e,!0)}get height(){return M(x(this,B))}set height(e){j(x(this,B),e,!0)}get unit_count(){return M(x(this,k))}set unit_count(e){j(x(this,k),e,!0)}get unit_scale(){return M(x(this,z))}set unit_scale(e){j(x(this,z),e,!0)}get renderer_type(){return M(x(this,F))}set renderer_type(e){j(x(this,F),e,!0)}get simulation_speed(){return M(x(this,H))}set simulation_speed(e){j(x(this,H),e,!0)}get json(){return M(x(this,X))}set json(e){j(x(this,X),e)}toJSON(){return{width:this.width,height:this.height,unit_count:this.unit_count,unit_scale:this.unit_scale,renderer_type:this.renderer_type,simulation_speed:this.simulation_speed}}}U=new WeakMap,B=new WeakMap,k=new WeakMap,z=new WeakMap,F=new WeakMap,H=new WeakMap,X=new WeakMap;const we=n=>{if(!n)return;const e=n.startsWith("#")?n.substring(1):n;let t;try{t=JSON.parse(decodeURIComponent(e))}catch(r){console.error("Failed to parse hash:",e,r)}return console.log("parsed",t),t},$e=n=>encodeURIComponent(JSON.stringify(n));var Se=Ft('<div class="p_md"><header class="pb_md"><!></header> <form class="width_md"><div class="my_md flex"><!> <div class="align_self_end"><!></div></div> <div class="mb_md"><!></div> <div class="row"><!> <input title="unit speed" type="range"></div> <fieldset><div class="row"><!> <input title="unit count" type="range"></div> <div class="row"><!> <input title="unit scale" type="range"></div></fieldset></form> <p> </p> <div class="relative"><!> <!></div> <p class="mt_lg"><!></p> <div><div> </div> <div> </div> <div> </div> <div> </div></div></div>');function be(n,e){St(e,!0);const t=Zt(e,"spawn_demo",23,()=>new Et);console.log("spawn_demo.renderer_type",t().renderer_type);const r=new Vt(te,t().renderer_type,t().width,t().height),u=_e.set(new ce({renderer:r})),{simulation:m}=u;ee.set(u.clock),globalThis.app=u;const _=ne.set(new se({app:u})),{project:y}=_,{scene:i}=y,ct=.002,ut=0,Dt=3,dt=5,Mt=1,jt=1e3,lt=.1,Pt=5,pt=.01;m.speed=t().simulation_speed,$t(()=>{t().renderer_type=r.type}),$t(()=>{t().simulation_speed=m.speed}),oe(()=>{const g=_.playing;_.playing=!0;const h=i.onupdate(It);return()=>{h(),_.playing=g}});const q=1e5,Ct=(g,h,s,c)=>{const a=ye(g,h),d=(f,b)=>fe(f,b,a);console.time("resetting scene"),i.reset(null),console.timeEnd("resetting scene"),i.add_unit(new R(i,{x:0,y:0,strength:Z,movement_multiplier:0,points:[{x:0,y:0},{x:s,y:0},{x:s,y:-1e5},{x:0,y:-1e5}]})),i.add_unit(new R(i,{x:0,y:0,strength:Z,movement_multiplier:0,points:[{x:s,y:0},{x:s,y:c},{x:s+q,y:c},{x:s+q,y:0}]})),i.add_unit(new R(i,{x:0,y:0,strength:Z,movement_multiplier:0,points:[{x:s,y:c},{x:0,y:c},{x:0,y:c+q},{x:s,y:c+q}]})),i.add_unit(new R(i,{x:0,y:0,strength:Z,movement_multiplier:0,points:[{x:0,y:c},{x:0,y:0},{x:-1e5,y:0},{x:-1e5,y:c}]})),console.log("creating shapes"),console.time("creating shapes");for(let f=0;f<g;++f)Rt(a()>.5?f%16===0:!1,h,d,a);console.timeEnd("creating shapes"),console.log("created "+g+" shapes"),i.json_initial=i.json};qt(()=>{console.log("[Spawn_Demo] creating units");const g=t().unit_count,h=t().unit_scale,s=r.width,c=r.height;Gt(()=>Ct(g,h,s,c))});const It=g=>{for(let h=0;h<i.units.length;++h){const s=i.units[h],c=s.body.potentials();for(const a of c)if(ie(s.body,a,w)){const d=s.direction_x*w.overlap_y+s.direction_y*-w.overlap_x;s.direction_x=2*d*w.overlap_y-s.direction_x,s.direction_y=2*d*-w.overlap_x-s.direction_y;const f=a.unit.direction_x*w.overlap_y+a.unit.direction_y*-w.overlap_x;a.unit.direction_x=2*f*w.overlap_y-a.unit.direction_x,a.unit.direction_y=2*f*-w.overlap_x-a.unit.direction_y}}},Rt=(g,h,s,c)=>{const a=dt*1*(g?4.2*h:h),d=dt*2.5*(g?4.2*h:h),f=s(0,r.width),b=s(0,r.height),N=s(0,360)*Math.PI/180;let C;if(c()>.7)C=i.add_unit(new R(i,{x:f,y:b,radius:s(a,d)}));else{let $=[{x:-s(a,d),y:-s(a,d)},{x:s(a,d),y:-s(a,d)},{x:s(a,d),y:s(a,d)},{x:-s(a,d),y:s(a,d)}];if(c()>.17){const K=xe(0,$.length-1,c);$=$.filter((G,L)=>L!==K)}C=i.add_unit(new R(i,{x:f,y:b,points:$,rotation:s(0,360)*Math.PI/180,speed:re*s(.1,1)}))}C.direction_x=Math.cos(N),C.direction_y=Math.sin(N)};ue(n,{children:(g,h)=>{var s=Se(),c=l(s),a=l(c);ae(a,{children:(o,E)=>{Y();var D=W("🔮");J(o,D)},$$slots:{default:!0}}),p(c);var d=v(c,2),f=l(d),b=l(f);de(b,{project:y});var N=v(b,2),C=l(N);le(C,{}),p(N),p(f);var $=v(f,2),K=l($);me(K,{renderer:r}),p($);var G=v($,2),L=l(G);_t(L,{title:"unit speed",row:!0,step:ct,min:ut,get value(){return m.speed},set value(o){m.speed=o},children:(o,E)=>{Y();var D=W("simuation speed");J(o,D)},$$slots:{default:!0}});var O=v(L,2);ot(O),P(O,"step",ct),P(O,"min",ut),P(O,"max",Dt),p(G);var vt=v(G,2),Q=l(vt),ht=l(Q);_t(ht,{title:"unit count",row:!0,min:Mt,get value(){return t().unit_count},set value(o){t().unit_count=o},children:(o,E)=>{Y();var D=W("unit count");J(o,D)},$$slots:{default:!0}});var V=v(ht,2);ot(V),P(V,"max",jt),p(Q);var mt=v(Q,2),ft=l(mt);_t(ft,{title:"unit scale",row:!0,step:pt,min:lt,get value(){return t().unit_scale},set value(o){t().unit_scale=o},children:(o,E)=>{Y();var D=W("unit scale");J(o,D)},$$slots:{default:!0}});var A=v(ft,2);ot(A),P(A,"step",pt),P(A,"min",lt),P(A,"max",Pt),p(mt),p(vt),p(d);var tt=v(d,2),Nt=l(tt);p(tt);var et=v(tt,2),xt=l(et);pe(xt,{get Component(){return r.Component},scene:i,renderer:r});var Ot=v(xt,2);{var At=o=>{he(o,{scene:i,get unit_selection(){return _.unit_selection},get width(){return r.width},get height(){return r.height},get scene_interaction_surface_state(){return _.scene_interaction_surface_state},set scene_interaction_surface_state(E){_.scene_interaction_surface_state=E}})};Kt(Ot,o=>{_.editing&&o(At)})}p(et);var nt=v(et,2),Jt=l(nt);ve(Jt,{}),p(nt);var yt=v(nt,2),st=l(yt),Tt=l(st);p(st);var it=v(st,2),Ut=l(it);p(it);var rt=v(it,2),Bt=l(rt);p(rt);var gt=v(rt,2),kt=l(gt);p(gt),p(yt),p(s),Lt((o,E)=>{T(Nt,`${i.units.length??""} shapes - ${o??""} circles,
			${E??""} polygons`),T(Tt,`pointer_x: ${_.scene_interaction_surface_state.pointer_x??""}px`),T(Ut,`pointer_y: ${_.scene_interaction_surface_state.pointer_y??""}px`),T(Bt,`pointer_down: ${_.scene_interaction_surface_state.pointer_down??""}`),T(kt,`pointing: ${_.scene_interaction_surface_state.pointing??""}`)},[()=>i.units.filter(o=>o.type==="circle").length,()=>i.units.filter(o=>o.type==="polygon").length]),at(O,()=>m.speed,o=>m.speed=o),at(V,()=>t().unit_count,o=>t().unit_count=o),at(A,()=>t().unit_scale,o=>t().unit_scale=o),J(g,s)}}),bt()}function Ue(n,e){St(e,!0);const t=new Et(we(location.hash));let r=t.toJSON();Yt(u=>{const{json:m}=t;u!==1&&m!==r&&(r=m,console.log("[spawn page] writing to hash"),history.replaceState(null,"","#"+$e(m)))}),Ht(u=>{Wt.title="Dealt: spawn demo"}),be(n,{spawn_demo:t}),bt()}export{Ue as component};
