var bt=n=>{throw TypeError(n)};var Xt=(n,e,t)=>e.has(n)||bt("Cannot "+t);var y=(n,e,t)=>(Xt(n,e,"read from private field"),t?t.call(n):e.get(n)),D=(n,e,t)=>e.has(n)?bt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t);import{b as Y,a as T,t as Yt,h as Zt}from"../chunks/disclose-version.hpen2EY6.js";import{a0 as R,K as w,W as U,L as Q,_ as Et,u as qt,m as It,o as Mt,s as v,t as Dt,k as Qt,c as l,n as Z,r as p,$ as Vt}from"../chunks/runtime.BxixJYQn.js";import{e as te}from"../chunks/rune_helpers.svelte.CCORh8IK.js";import{s as z}from"../chunks/render.CII73B8B.js";import{c as j,p as ee,i as ne}from"../chunks/props.DCp65xQH.js";import{s as P,r as ct}from"../chunks/string.Bu0lHRZq.js";import{d as se,R as ie,r as re,c as oe,e as ae,E as _e,f as dt,g as ce,U as N,S as q,h as de}from"../chunks/renderer_components.Br8110jH.js";import{o as ue}from"../chunks/index-client.DzeqT_l4.js";import{B as le}from"../chunks/Breadcrumb.ghOmMoS9.js";import{a as pe,A as ve,D as me,c as S}from"../chunks/Dealt.D1lvKBEC.js";import{S as he,F as fe,c as ut,a as xe,b as ye}from"../chunks/Fps_Indicator.Dwbq6601.js";import{R as ge}from"../chunks/Renderer_Controls.CJNHXm6L.js";import{U as we}from"../chunks/User_Input_Info.B5ugMjFl.js";const $e=(n,e,t=Math.random)=>t()*(e-n)+n,Se=(n,e,t=Math.random)=>Math.floor(t()*(e-n+1))+n,be=(...n)=>{let e=0,t=0,i=0,d=1;const g=n.length?n:[Date.now()];let m=Ee();e=m(" "),t=m(" "),i=m(" ");for(const $ of g)e-=m($),e<0&&(e+=1),t-=m($),t<0&&(t+=1),i-=m($),i<0&&(i+=1);m=null;const _=()=>{const $=2091639*e+d*23283064365386963e-26;return e=t,t=i,i=$-(d=$|0)};return _.uint32=()=>_()*4294967296,_.fract53=()=>_()+(_()*2097152|0)*11102230246251565e-32,_.version="Alea 0.9",_.seeds=g,_},Ee=()=>{let n=4022871197;return e=>{const t=e+"";for(let i=0;i<t.length;i++){n+=t.charCodeAt(i);let d=.02519603282416938*n;n=d>>>0,d-=n,d*=n,n=d>>>0,d-=n,n+=d*4294967296}return(n>>>0)*23283064365386963e-26}};var B,F,L,W,G,H,V;class Pt{constructor(e=se){D(this,B,R());D(this,F,R());D(this,L,R());D(this,W,R());D(this,G,R());D(this,H,R());D(this,V,Q(()=>this.toJSON()));const{width:t=800,height:i=600,unit_count:d=72,unit_scale:g=1,renderer_type:m="pixi",simulation_speed:_=1}=e;this.width=t,this.height=i,this.unit_count=d,this.unit_scale=g,this.renderer_type=m,this.simulation_speed=_}get width(){return w(y(this,B))}set width(e){U(y(this,B),j(e))}get height(){return w(y(this,F))}set height(e){U(y(this,F),j(e))}get unit_count(){return w(y(this,L))}set unit_count(e){U(y(this,L),j(e))}get unit_scale(){return w(y(this,W))}set unit_scale(e){U(y(this,W),j(e))}get renderer_type(){return w(y(this,G))}set renderer_type(e){U(y(this,G),j(e))}get simulation_speed(){return w(y(this,H))}set simulation_speed(e){U(y(this,H),j(e))}get json(){return w(y(this,V))}toJSON(){return{width:this.width,height:this.height,unit_count:this.unit_count,unit_scale:this.unit_scale,renderer_type:this.renderer_type,simulation_speed:this.simulation_speed}}}B=new WeakMap,F=new WeakMap,L=new WeakMap,W=new WeakMap,G=new WeakMap,H=new WeakMap,V=new WeakMap;const De=n=>{if(!n)return;const e=n.startsWith("#")?n.substring(1):n;let t;try{t=JSON.parse(decodeURIComponent(e))}catch(i){console.error("Failed to parse hash:",e,i)}return console.log("parsed",t),t},Ie=n=>encodeURIComponent(JSON.stringify(n));var Me=Yt('<div class="p_md"><header class="pb_md"><!></header> <form class="width_md"><div class="my_md flex"><!> <div class="align_self_end"><!></div></div> <div class="mb_md"><!></div> <div class="row"><!> <input title="unit speed" type="range"></div> <fieldset><div class="row"><!> <input title="unit count" type="range"></div> <div class="row"><!> <input title="unit scale" type="range"></div></fieldset></form> <p> </p> <div class="relative"><!> <!></div> <p class="mt_lg"><!></p> <div><div> </div> <div> </div> <div> </div> <div> </div></div></div>');function Pe(n,e){Mt(e,!0);const t=ee(e,"spawn_demo",23,()=>new Pt);console.log("spawn_demo.renderer_type",t().renderer_type);const i=new ie(re,t().renderer_type,t().width,t().height),d=pe.set(new ve({renderer:i})),{clock:g,simulation:m}=d;oe.set(d.clock),globalThis.app=d;const _=ae.set(new _e({app:d})),{project:$}=_,{scene:o}=$,lt=.002,pt=0,Ct=3,vt=5,Rt=1,Ut=1e3,mt=.1,jt=5,ht=.01;m.speed=t().simulation_speed,Et(()=>{t().renderer_type=i.type}),Et(()=>{t().simulation_speed=m.speed}),ue(()=>{const f=g.watch(Ot);return g.start(),()=>{f(),g.stop()}});const b=1e5,Nt=(f,x,s,c)=>{const a=be(f,x),u=(h,I)=>$e(h,I,a);console.time("resetting scene"),o.reset(null),console.timeEnd("resetting scene"),o.add_unit(new N(o,{x:0,y:0,strength:q,movement_multiplier:0,points:[{x:0,y:0},{x:s,y:0},{x:s,y:-b},{x:0,y:-b}]})),o.add_unit(new N(o,{x:0,y:0,strength:q,movement_multiplier:0,points:[{x:s,y:0},{x:s,y:c},{x:s+b,y:c},{x:s+b,y:0}]})),o.add_unit(new N(o,{x:0,y:0,strength:q,movement_multiplier:0,points:[{x:s,y:c},{x:0,y:c},{x:0,y:c+b},{x:s,y:c+b}]})),o.add_unit(new N(o,{x:0,y:0,strength:q,movement_multiplier:0,points:[{x:0,y:c},{x:0,y:0},{x:-b,y:0},{x:-b,y:c}]})),console.log("creating shapes"),console.time("creating shapes");for(let h=0;h<f;++h)kt(a()>.5?h%16===0:!1,x,u,a);console.timeEnd("creating shapes"),console.log("created "+f+" shapes"),o.json_initial=o.json};qt(()=>{console.log("[Spawn_Demo] creating units");const f=t().unit_count,x=t().unit_scale,s=i.width,c=i.height;Qt(()=>Nt(f,x,s,c))});const Ot=f=>{for(let x=0;x<o.units.length;++x){const s=o.units[x],c=s.body.potentials();for(const a of c)if(ce(s.body,a,S)){const u=s.direction_x*S.overlap_y+s.direction_y*-S.overlap_x;s.direction_x=2*u*S.overlap_y-s.direction_x,s.direction_y=2*u*-S.overlap_x-s.direction_y;const h=a.unit.direction_x*S.overlap_y+a.unit.direction_y*-S.overlap_x;a.unit.direction_x=2*h*S.overlap_y-a.unit.direction_x,a.unit.direction_y=2*h*-S.overlap_x-a.unit.direction_y}}o.update(f)},kt=(f,x,s,c)=>{const a=vt*1*(f?4.2*x:x),u=vt*2.5*(f?4.2*x:x),h=s(0,i.width),I=s(0,i.height),O=s(0,360)*Math.PI/180;let C;if(c()>.7)C=o.add_unit(new N(o,{x:h,y:I,radius:s(a,u)}));else{let E=[{x:-s(a,u),y:-s(a,u)},{x:s(a,u),y:-s(a,u)},{x:s(a,u),y:s(a,u)},{x:-s(a,u),y:s(a,u)}];if(c()>.17){const tt=Se(0,E.length-1,c);E=E.filter((K,X)=>X!==tt)}C=o.add_unit(new N(o,{x:h,y:I,points:E,angle:s(0,360)*Math.PI/180,speed:de*s(.1,1)}))}C.direction_x=Math.cos(O),C.direction_y=Math.sin(O)};me(n,{children:(f,x)=>{var s=Me(),c=l(s),a=l(c);le(a,{children:(r,J)=>{Z();var M=Y("🔮");T(r,M)},$$slots:{default:!0}}),p(c);var u=v(c,2),h=l(u),I=l(h);he(I,{project:$});var O=v(I,2),C=l(O);fe(C,{}),p(O),p(h);var E=v(h,2),tt=l(E);ge(tt,{renderer:i}),p(E);var K=v(E,2),X=l(K);ut(X,{title:"unit speed",row:!0,step:lt,min:pt,get value(){return m.speed},set value(r){m.speed=r},children:(r,J)=>{Z();var M=Y("simuation speed");T(r,M)},$$slots:{default:!0}});var k=v(X,2);ct(k),P(k,"step",lt),P(k,"min",pt),P(k,"max",Ct),p(K);var ft=v(K,2),et=l(ft),xt=l(et);ut(xt,{title:"unit count",row:!0,min:Rt,get value(){return t().unit_count},set value(r){t().unit_count=r},children:(r,J)=>{Z();var M=Y("unit count");T(r,M)},$$slots:{default:!0}});var nt=v(xt,2);ct(nt),P(nt,"max",Ut),p(et);var yt=v(et,2),gt=l(yt);ut(gt,{title:"unit scale",row:!0,step:ht,min:mt,get value(){return t().unit_scale},set value(r){t().unit_scale=r},children:(r,J)=>{Z();var M=Y("unit scale");T(r,M)},$$slots:{default:!0}});var A=v(gt,2);ct(A),P(A,"step",ht),P(A,"min",mt),P(A,"max",jt),p(yt),p(ft),p(u);var st=v(u,2);const At=Q(()=>o.units.length??""),Jt=Q(()=>o.units.filter(r=>r.type==="circle").length??""),Tt=Q(()=>o.units.filter(r=>r.type==="polygon").length??"");var zt=l(st);Dt(()=>z(zt,`${w(At)} shapes - ${w(Jt)} circles,
			${w(Tt)} polygons`)),p(st);var it=v(st,2),wt=l(it);xe(wt,{get Component(){return i.Component},scene:o,renderer:i});var Bt=v(wt,2);{var Ft=r=>{ye(r,{scene:o,get unit_selection(){return _.unit_selection},get width(){return i.width},get height(){return i.height},get scene_interaction_surface_state(){return _.scene_interaction_surface_state},set scene_interaction_surface_state(J){_.scene_interaction_surface_state=J}})};ne(Bt,r=>{_.editing&&r(Ft)})}p(it);var rt=v(it,2),Lt=l(rt);we(Lt,{no_movement:!0,edit:!0}),p(rt);var $t=v(rt,2),ot=l($t),Wt=l(ot);p(ot);var at=v(ot,2),Gt=l(at);p(at);var _t=v(at,2),Ht=l(_t);p(_t);var St=v(_t,2),Kt=l(St);p(St),p($t),p(s),Dt(()=>{z(Wt,`pointer_x: ${_.scene_interaction_surface_state.pointer_x??""}px`),z(Gt,`pointer_y: ${_.scene_interaction_surface_state.pointer_y??""}px`),z(Ht,`pointer_down: ${_.scene_interaction_surface_state.pointer_down??""}`),z(Kt,`pointing: ${_.scene_interaction_surface_state.pointing??""}`)}),dt(k,()=>m.speed,r=>m.speed=r),dt(nt,()=>t().unit_count,r=>t().unit_count=r),dt(A,()=>t().unit_scale,r=>t().unit_scale=r),T(f,s)},$$slots:{default:!0}}),It()}function We(n,e){Mt(e,!0);const t=new Pt(De(location.hash));let i=t.toJSON();te(d=>{const{json:g}=t;d!==1&&g!==i&&(i=g,console.log("[spawn page] writing to hash"),history.replaceState(null,"","#"+Ie(g)))}),Zt(d=>{Vt.title="Dealt: spawn demo"}),Pe(n,{spawn_demo:t}),It()}export{We as component};
