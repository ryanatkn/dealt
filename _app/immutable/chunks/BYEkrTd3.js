var Lt=Object.defineProperty;var Yt=l=>{throw TypeError(l)};var Vt=(l,n,t)=>n in l?Lt(l,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[n]=t;var Et=(l,n,t)=>Vt(l,typeof n!="symbol"?n+"":n,t),Xt=(l,n,t)=>n.has(l)||Yt("Cannot "+t);var Q=(l,n,t)=>(Xt(l,n,"read from private field"),t?t.call(l):n.get(l)),vt=(l,n,t)=>n.has(l)?Yt("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(l):n.set(l,t),It=(l,n,t,r)=>(Xt(l,n,"write to private field"),r?r.call(l,t):n.set(l,t),t);import{t as Z,a as Y,n as rt,c as ft,b as ct}from"./DyCZ_lw9.js";import{aM as Ft,w as e,ax as Wt,k as Ot,j as Ct,aj as Gt,m as tt,v as $,c as B,x as U,s as D,o as W,q as et,r as R,G as zt,n as ot,ai as g,a2 as gt,u as Kt,X as i,aL as L}from"./Dkaln31E.js";import{d as ut,o as Ht,k as A,s as yt}from"./DMs3BEDJ.js";import{i as V,p as nt}from"./Cr-AO5Xh.js";import{s as dt}from"./DQXgQxX-.js";import{g as st,c as at,s as H,r as Tt,j as Zt,a as Jt,b as Ut}from"./C07ZAADA.js";import{t as Qt,s as $t}from"./CD3rAWNL.js";import{ap as te,e as jt,P as ee,k as ne,aq as ie,Q as it,ar as St,as as le,at as re,au as oe,av as se,aw as At,K as ae,M as Pt,N as ue,a2 as ce,L as kt,ax as _e,a3 as de,c as ve,F as ge}from"./BERuEieG.js";import{c as he}from"./DDxrSoXw.js";import{b as fe}from"./DlVdBben.js";function ye(l){let n=0,t=Wt(0),r;return()=>{Ft()&&(e(t),Ot(()=>(n===0&&(r=Ct(()=>l(()=>te(t)))),n+=1,()=>{Gt().then(()=>{n-=1,n===0&&(r==null||r(),r=void 0)})})))}}var mt,pt;class Nt{constructor(n,t){vt(this,mt);vt(this,pt);It(this,mt,n),It(this,pt,ye(t))}get current(){return Q(this,pt).call(this),Q(this,mt).call(this)}}mt=new WeakMap,pt=new WeakMap;var me=(l,n)=>e(n).reset(),pe=Z('<fieldset><label class="row pt_xs"><input type="checkbox"> show bounding volume hierarchy</label></fieldset>'),we=Z('<div class="scene_controls svelte-1l7n56e"><button type="button" title="toggle the clock [Spacebar]"><div class="pr_sm">clock</div> <!></button> <button type="button" title="reset the scene [r]" class="plain">reset</button> <button type="button">edit</button> <!></div> <!>',1);function En(l,n){tt(n,!0);const t=U(()=>n.project.renderer),r=U(()=>n.project.scene),d=U(()=>e(r).clock),a=jt.get();var o=we(),_=$(o),u=B(_);u.__click=function(...y){var s;(s=e(d).toggle)==null||s.apply(this,y)};let c;st(u,"",{},{"min-width":"105px"});var m=D(B(u),2);ee(m,{get running(){return e(d).running}}),R(u);var p=D(u,2);p.__click=[me,r];var f=D(p,2);let k;f.__click=()=>a.editing=!a.editing;var w=D(f,2);dt(w,()=>n.children??zt),R(_);var M=D(_,2);{var K=y=>{var s=pe(),x=B(s),b=B(x);Tt(b),ot(),R(x),R(s),ne(b,()=>e(t).show_bvh,h=>e(t).show_bvh=h),Qt(3,s,()=>$t),Y(y,s)};V(M,y=>{e(t).type==="canvas"&&y(K)})}W((y,s)=>{c=at(u,1,"",null,c,y),k=at(f,1,"plain deselectable",null,k,s),H(f,"title",`${a.editing?"stop editing":"start editing"} [~ Shift+Backtick]`)},[()=>({color_d:e(d).running}),()=>({color_d:a.editing})]),Y(l,o),et()}ut(["click"]);const xe=new Nt(()=>window.innerWidth,l=>Ht(window,"resize",l)),be=new Nt(()=>window.innerHeight,l=>Ht(window,"resize",l));var ke=rt('<line class="svelte-4z6b3j"></line>'),Se=rt('<svg class="scrubbing_indicator svelte-4z6b3j" aria-hidden="true"><!></svg>');function ht(l,n){tt(n,!0);const t=U(()=>n.container_width??xe.current),r=U(()=>n.container_height??be.current);ie(l,{to:document.body,children:(d,a)=>{var o=Se(),_=B(o);{var u=c=>{var m=ke();W(()=>{H(m,"x1",n.x_start),H(m,"y1",n.y_start),H(m,"x2",n.x_last),H(m,"y2",n.y_last)}),Y(c,m)};V(_,c=>{n.x_start!==null&&n.y_start!==null&&n.x_last!==null&&n.y_last!==null&&c(u)})}R(o),W(()=>{H(o,"viewBox",`0 0 ${e(t)??""} ${e(r)??""}`),H(o,"width",e(t)),H(o,"height",e(r))}),Y(d,o)},$$slots:{default:!0}}),et()}const Me=(l,n)=>{l.ctrlKey||n(l.clientX,l.clientY)};var Ie=Z('<div class="title svelte-1emv8hj"><!></div>'),Ye=Z('<label role="slider"><!> <input></label> <!>',1);function Xn(l,n){tt(n,!0);let t=nt(n,"value",15,0),r=nt(n,"type",3,"text"),d=nt(n,"inputmode",3,"numeric"),a=nt(n,"step",3,1),o=nt(n,"min",19,()=>1/0*-1),_=nt(n,"row",3,!1),u=g(gt(t())),c=g(gt(t().toString()));const m=P=>{var N;i(u,P,!0),t(Math.max(o(),P)),i(c,t().toString(),!0),(N=n.oninput)==null||N.call(n,t())};Kt(()=>{t()!==Ct(()=>e(u))&&(i(u,t(),!0),i(c,t().toString(),!0))});const p=P=>{i(c,P,!0);const N=parseFloat(P);Number.isNaN(N)||m(N)},f=P=>{m(e(u)+P)};let k=g(!1),w=g(null),M=g(null),K=g(null),y=g(null),s=g(null),x=g(null),b=g(null);const h=U(()=>e(x)===null||e(y)===null?null:e(x)-e(y)),E=U(()=>e(b)===null||e(s)===null?null:e(s)-e(b)),C=U(()=>e(h)===null||e(E)===null?null:(e(h)+e(E))*a()),z=(P,N)=>{e(k)||(i(k,!0),i(w,t(),!0),i(M,P,!0),i(K,N,!0),i(y,P,!0),i(s,N,!0))},q=()=>{i(k,!1),i(w,null),i(M,null),i(K,null),i(y,null),i(s,null),i(x,null),i(b,null)},O=(P,N)=>{i(y,e(x),!0),i(s,e(b),!0),i(x,P,!0),i(b,N,!0),e(C)!==null&&f(e(C))},G=P=>{q()},S=P=>{q()},v=P=>{O(P.clientX,P.clientY)},X=P=>{P.key==="Escape"&&(m(e(w)),q(),it(P))};var J=Ye();A("pointerup",L,function(...P){var N;(N=e(k)?G:void 0)==null||N.apply(this,P)}),A("pointermove",L,function(...P){var N;(N=e(k)?v:void 0)==null||N.apply(this,P)}),A("pointerleave",L,function(...P){var N;(N=e(k)?S:void 0)==null||N.apply(this,P)}),A("keydown",L,function(...P){var N;(N=e(k)?X:void 0)==null||N.apply(this,P)},!0);var I=$(J);let j;I.__pointerdown=[Me,z];var T=B(I);{var F=P=>{var N=Ie(),Rt=B(N);dt(Rt,()=>n.children),R(N),Y(P,N)};V(T,P=>{n.children&&P(F)})}var xt=D(T,2);Tt(xt);var Mt=P=>p(P.currentTarget.value);let bt;R(I);var Dt=D(I,2);{var Bt=P=>{ht(P,{get x_start(){return e(M)},get y_start(){return e(K)},get x_last(){return e(y)},get y_last(){return e(s)}})};V(Dt,P=>{e(k)&&P(Bt)})}W(P=>{j=at(I,1,Zt(n.classes),"svelte-1emv8hj",j,P),H(I,"aria-valuenow",e(C)),H(I,"title",n.title),bt=Jt(xt,bt,{...n.attrs,class:n.input_classes,value:e(c),oninput:Mt,type:r(),inputmode:d(),step:a(),min:o(),max:n.max},"svelte-1emv8hj")},[()=>({selected:e(k),row:_()})]),Y(l,J),et()}ut(["pointerdown"]);var Ee=Z('<div class="scene_renderer svelte-1hiky75"><!></div>');function Pn(l,n){tt(n,!0);var t=Ee();let r;var d=B(t);{var a=o=>{var _=ft(),u=$(_);he(u,()=>n.Component,(c,m)=>{m(c,{get scene(){return n.scene},get renderer(){return n.renderer}})}),Y(o,_)};V(d,o=>{o(a)})}R(t),W(()=>r=st(t,"",r,{width:`${n.renderer.width??""}px`,height:`${n.renderer.height??""}px`,"min-width":`${n.renderer.width??""}px`,"min-height":`${n.renderer.height??""}px`})),Y(l,t),et()}const Xe=(l,n)=>{n(l.clientX,l.clientY),it(l)};var Pe=rt('<polygon role="none" fill="var(--color_selected)"></polygon><!>',1);function Ce(l,n){tt(n,!0);const t=nt(n,"unit",7),r=nt(n,"size",3,St),d=.5;let a=g(!1),o=g(null),_=g(null),u=g(null),c=g(null),m=g(null),p=g(null),f=g(null);const k=U(()=>t().x),w=U(()=>t().y-Math.max(r(),t().radius*Math.abs(t().scale))),M=U(()=>r()/2),K=(S,v)=>{e(a)||(i(a,!0),i(o,t().radius,!0),i(_,S,!0),i(u,v,!0),i(c,S,!0),i(m,v,!0))},y=()=>{i(a,!1),i(o,null),i(_,null),i(u,null),i(c,null),i(m,null),i(p,null),i(f,null)},s=(S,v)=>{i(c,e(p),!0),i(m,e(f),!0),i(p,S,!0),i(f,v,!0),e(c)!==null&&e(m)!==null&&(t().radius=le(e(o)+d*(e(p)-e(_)-(e(f)-e(u)))))},x=S=>{y()},b=S=>{y()},h=S=>{s(S.clientX,S.clientY)},E=S=>{S.key==="Escape"&&(t().radius=e(o),y(),it(S))};var C=Pe();A("pointerup",L,function(...S){var v;(v=e(a)?x:void 0)==null||v.apply(this,S)}),A("pointermove",L,function(...S){var v;(v=e(a)?h:void 0)==null||v.apply(this,S)}),A("pointerleave",L,function(...S){var v;(v=e(a)?b:void 0)==null||v.apply(this,S)}),A("keydown",L,function(...S){var v;(v=e(a)?E:void 0)==null||v.apply(this,S)},!0);var z=$(C);let q;z.__pointerdown=[Xe,K];var O=D(z);{var G=S=>{ht(S,{get x_start(){return e(_)},get y_start(){return e(u)},get x_last(){return e(c)},get y_last(){return e(m)}})};V(O,S=>{e(a)&&S(G)})}W(S=>{q=at(z,0,"unit_circle_radius_handles svelte-1i5of7p",null,q,S),H(z,"points",`${e(k)-e(M)},${e(w)-e(M)} ${e(k)+e(M)},${e(w)-e(M)} ${e(k)??""},${e(w)+e(M)}`)},[()=>({pressing:e(a)})]),Y(l,C),et()}ut(["pointerdown"]);const ze=(l,n)=>{n(l.clientX,l.clientY),it(l)};var Ke=rt('<circle role="none" fill="var(--color_selected)"></circle><!>',1);function qt(l,n){tt(n,!0);const t=nt(n,"unit",7),r=nt(n,"size",3,St),d=.01;let a=g(!1),o=g(null),_=g(null),u=g(null),c=g(null),m=g(null),p=g(null),f=g(null),k=g(null),w=g(null);const M=U(()=>t().scene.controller.pressing_alt?"move":"nesw-resize"),K=(v,X)=>{e(a)||(i(a,!0),i(o,t().scale,!0),i(_,t().x,!0),i(u,t().y,!0),i(c,v,!0),i(m,X,!0),i(p,v,!0),i(f,X,!0))},y=()=>{i(a,!1),i(o,null),i(_,null),i(u,null),i(c,null),i(m,null),i(p,null),i(f,null),i(k,null),i(w,null)},s=(v,X)=>{i(p,e(k),!0),i(f,e(w),!0),i(k,v,!0),i(w,X,!0),e(p)!==null&&e(f)!==null&&(t().scene.controller.pressing_alt?t().move_center_to(t().x+(e(k)-e(p)),t().y+(e(w)-e(f))):t().scale=re(e(o)+d*(e(k)-e(c)-(e(w)-e(m)))))},x=v=>{y()},b=v=>{y()},h=v=>{s(v.clientX,v.clientY)},E=v=>{v.key==="Escape"&&(t().scene.controller.pressing_alt?t().move_center_to(e(_),e(u)):t().scale=e(o),y(),it(v))};var C=Ke();A("pointerup",L,function(...v){var X;(X=e(a)?x:void 0)==null||X.apply(this,v)}),A("pointermove",L,function(...v){var X;(X=e(a)?h:void 0)==null||X.apply(this,v)}),A("pointerleave",L,function(...v){var X;(X=e(a)?b:void 0)==null||X.apply(this,v)}),A("keydown",L,function(...v){var X;(X=e(a)?E:void 0)==null||X.apply(this,v)},!0);var z=$(C);let q;z.__pointerdown=[ze,K];let O;var G=D(z);{var S=v=>{ht(v,{get x_start(){return e(c)},get y_start(){return e(m)},get x_last(){return e(p)},get y_last(){return e(f)}})};V(G,v=>{e(a)&&v(S)})}W(v=>{q=at(z,0,"unit_scale_handles svelte-rpawlp",null,q,v),H(z,"cx",t().x),H(z,"cy",t().y),H(z,"r",r()/2),O=st(z,"",O,{cursor:e(M)})},[()=>({pressing:e(a)})]),Y(l,C),et()}ut(["pointerdown"]);var He=Z("<!> <!>",1);function Te(l,n){var t=He(),r=$(t);qt(r,{get unit(){return n.unit}});var d=D(r,2);Ce(d,{get unit(){return n.unit}}),Y(l,t)}const Ue=(l,n)=>{n(l.clientX,l.clientY),it(l)};var je=rt('<polygon role="none" fill="var(--color_selected)"></polygon><!>',1);function Ae(l,n){tt(n,!0);const t=nt(n,"size",3,St);let r=g(!1),d=g(null),a=g(null),o=g(null),_=g(null),u=g(null),c=g(null),m=g(null),p=g(null),f=g(gt(n.point)),k=g(null),w=g(null),M=g(!1);const K=1,y=U(()=>n.unit.x+n.transformed_point.x),s=U(()=>n.unit.y+n.transformed_point.y),x=U(()=>t()/2),b=U(()=>n.unit.scene.controller.pressing_ctrl&&n.unit.scene.controller.pressing_alt?"no-drop":n.unit.scene.controller.pressing_alt?n.unit.scene.controller.pressing_shift?"alias":"copy":"move"),h=(T,F)=>{if(n.unit.scene.controller.pressing_ctrl&&n.unit.scene.controller.pressing_alt){n.unit.points.length>3&&n.unit.remove_point(n.point);return}e(r)||(i(r,!0),n.unit.scene.controller.pressing_alt?(i(k,T,!0),i(w,F,!0),i(M,!1),i(f,n.point,!0)):i(f,n.point,!0),i(d,e(f).x,!0),i(a,e(f).y,!0),i(o,T,!0),i(_,F,!0),i(u,T,!0),i(c,F,!0))},E=()=>{i(r,!1),i(d,null),i(a,null),i(o,null),i(_,null),i(u,null),i(c,null),i(m,null),i(p,null),i(k,null),i(w,null),i(M,!1),i(f,n.point,!0)},C=(T,F)=>{if(i(u,e(m),!0),i(c,e(p),!0),i(m,T,!0),i(p,F,!0),n.unit.scene.controller.pressing_alt&&!e(M)&&e(k)!==null){const xt=T-e(k),Mt=F-e(w);if(Math.hypot(xt,Mt)>=K){i(M,!0);const bt=oe(n.unit,n.point,T,F,e(o),e(_));i(f,n.unit.duplicate_point(n.point,bt),!0)}}e(u)!==null&&e(c)!==null&&n.unit.move_transformed_point(e(f),e(m)-e(u),e(p)-e(c))},z=T=>{E()},q=T=>{E()},O=T=>{C(T.clientX,T.clientY)},G=T=>{T.key==="Escape"&&(n.unit.scene.controller.pressing_alt&&e(f)!==n.point?n.unit.remove_point(e(f)):(e(f).x=e(d),e(f).y=e(a),n.unit.update_points()),E(),it(T))};var S=je();A("pointerup",L,function(...T){var F;(F=e(r)?z:void 0)==null||F.apply(this,T)}),A("pointermove",L,function(...T){var F;(F=e(r)?O:void 0)==null||F.apply(this,T)}),A("pointerleave",L,function(...T){var F;(F=e(r)?q:void 0)==null||F.apply(this,T)}),A("keydown",L,function(...T){var F;(F=e(r)?G:void 0)==null||F.apply(this,T)},!0);var v=$(S);let X;v.__pointerdown=[Ue,h];let J;var I=D(v);{var j=T=>{ht(T,{get x_start(){return e(o)},get y_start(){return e(_)},get x_last(){return e(u)},get y_last(){return e(c)}})};V(I,T=>{e(r)&&T(j)})}W(T=>{X=at(v,0,"unit_polygon_point_handles svelte-1fl6mbc",null,X,T),H(v,"points",`${e(y)-e(x)},${e(s)-e(x)} ${e(y)+e(x)},${e(s)-e(x)} ${e(y)??""},${e(s)+e(x)}`),J=st(v,"",J,{cursor:e(b)})},[()=>({pressing:e(r)})]),Y(l,S),et()}ut(["pointerdown"]);const Ne=(l,n)=>{n(l.clientX,l.clientY),it(l)};var qe=rt('<polygon role="none" fill="var(--color_selected)"></polygon><!>',1);function De(l,n){tt(n,!0);const t=nt(n,"unit",7),r=nt(n,"size",3,St),d=.013;let a=g(!1),o=g(null),_=g(null),u=g(null),c=g(null),m=g(null),p=g(null),f=g(null),k=g(null),w=g(null);const M=U(()=>t().scene.controller.pressing_alt?"move":"ew-resize"),K=U(()=>t().x+r()*Math.cos(-1*(t().rotation-Math.PI/2))),y=U(()=>t().y-r()*Math.sin(-1*(t().rotation-Math.PI/2))),s=U(()=>`${e(K)},${e(y)-r()/2} ${e(K)+r()/3},${e(y)} ${e(K)},${e(y)+r()/2} ${e(K)-r()/3},${e(y)}`),x=(I,j)=>{e(a)||(i(a,!0),i(o,t().rotation,!0),i(_,t().x,!0),i(u,t().y,!0),i(c,I,!0),i(m,j,!0),i(p,I,!0),i(f,j,!0))},b=()=>{i(a,!1),i(o,null),i(c,null),i(m,null),i(p,null),i(f,null),i(k,null),i(w,null)},h=(I,j)=>{i(p,e(k),!0),i(f,e(w),!0),i(k,I,!0),i(w,j,!0),e(p)!==null&&e(f)!==null&&(t().scene.controller.pressing_alt?t().move_center_to(t().x+(e(k)-e(p)),t().y+(e(w)-e(f))):t().rotation=se(e(o)+d*(e(k)-e(c)-(e(w)-e(m)))))},E=I=>{b()},C=I=>{b()},z=I=>{h(I.clientX,I.clientY)},q=I=>{I.key==="Escape"&&(t().scene.controller.pressing_alt?t().move_center_to(e(_),e(u)):t().rotation=e(o),b(),it(I))};var O=qe();A("pointerup",L,function(...I){var j;(j=e(a)?E:void 0)==null||j.apply(this,I)}),A("pointermove",L,function(...I){var j;(j=e(a)?z:void 0)==null||j.apply(this,I)}),A("pointerleave",L,function(...I){var j;(j=e(a)?C:void 0)==null||j.apply(this,I)}),A("keydown",L,function(...I){var j;(j=e(a)?q:void 0)==null||j.apply(this,I)},!0);var G=$(O);let S;G.__pointerdown=[Ne,x];let v;var X=D(G);{var J=I=>{ht(I,{get x_start(){return e(c)},get y_start(){return e(m)},get x_last(){return e(p)},get y_last(){return e(f)}})};V(X,I=>{e(a)&&I(J)})}W(I=>{S=at(G,0,"unit_polygon_rotation_handles svelte-tnupuo",null,S,I),H(G,"points",e(s)),H(G,"transform",`rotate(${t().rotation_degrees??""} ${e(K)??""} ${e(y)??""})`),v=st(G,"",v,{cursor:e(M)})},[()=>({pressing:e(a)})]),Y(l,O),et()}ut(["pointerdown"]);var Be=Z("<!> <!> <!>",1);function Re(l,n){tt(n,!0);var t=Be(),r=$(t);Ut(r,18,()=>n.unit.points,o=>o,(o,_,u)=>{Ae(o,{get unit(){return n.unit},get point(){return _},get transformed_point(){return n.unit.transformed_points[e(u)]}})});var d=D(r,2);qt(d,{get unit(){return n.unit}});var a=D(d,2);De(a,{get unit(){return n.unit}}),Y(l,t),et()}function Le(l,n){tt(n,!0);const t=U(()=>n.unit.type);var r=ft(),d=$(r);{var a=_=>{Te(_,{get unit(){return n.unit}})},o=(_,u)=>{{var c=p=>{Re(p,{get unit(){return n.unit}})},m=p=>{var f=ct();W(k=>yt(f,k),[()=>At(e(t))]),Y(p,f)};V(_,p=>{e(t)==="polygon"?p(c):p(m,!1)},u)}};V(d,_=>{e(t)==="circle"?_(a):_(o,!1)})}Y(l,r),et()}var Ve=Z('<menu class="pane unstyled svelte-pa2qv7"><!></menu>'),Fe=Z('<li role="none" class="svelte-pa2qv7"><div role="menuitem" aria-label="contextmenu submenmu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-pa2qv7" aria-hidden="true"></div></div> <!></li>');function We(l,n){tt(n,!0);const t=ae.get(),r=t.add_submenu(),{layout:d}=t,a=U(()=>r.selected);let o=g(void 0);const _=Pt.get(),u=Pt.set();let c=g(0),m=g(0);Kt(()=>{e(o)&&p(e(o),d,_)});const p=(C,z,q)=>{const{x:O,y:G,width:S,height:v}=C.getBoundingClientRect();u.width=S,u.height=v;const X=O-e(c),J=G-e(m),I=X+S+q.width-z.width;if(I<=0)i(c,q.width,!0);else{const j=S-X;j<=0?i(c,-S):j>I?i(c,q.width-I):i(c,j-S)}i(m,Math.min(0,z.height-(J+v)),!0)};var f=Fe();let k;var w=B(f);let M;var K=B(w),y=B(K),s=B(y);dt(s,()=>n.icon??zt),R(y);var x=D(y,2),b=B(x);dt(b,()=>n.children),R(x),R(K),ot(2),R(w);var h=D(w,2);{var E=C=>{var z=Ve();let q;var O=B(z);dt(O,()=>n.menu),R(z),fe(z,G=>i(o,G),()=>e(o)),W(()=>q=st(z,"",q,{transform:`translate3d(${e(c)??""}px, ${e(m)??""}px, 0)`,"max-height":`${d.height??""}px`})),Y(C,z)};V(h,C=>{e(a)&&C(E)})}R(f),W(C=>{k=st(f,"",k,{"--contextmenu_depth":r.depth}),M=at(w,1,"menu_item plain selectable svelte-pa2qv7",null,M,C),H(w,"aria-expanded",e(a))},[()=>({selected:e(a)})]),A("mouseenter",w,C=>{it(C),setTimeout(()=>t.select(r))}),Y(l,f),et()}var Oe=rt('<circle role="none"></circle>'),Ge=rt('<polygon role="none"></polygon>'),Ze=rt('<svg class="unit_icon svelte-yrh1le"><!></svg>');function Je(l,n){tt(n,!0);const t=nt(n,"padding",3,2),r=U(()=>n.unit.type),d=U(()=>n.unit.points),a=U(()=>n.unit.rotation),o=100,_=o/2,u=U(()=>`rotate(${e(a)*360/(Math.PI*2)} ${_} ${_})`),c=U(()=>{if(e(r)!=="polygon"||!e(d).length)return"";const w=e(d).map(E=>E.x),M=e(d).map(E=>E.y),K=(Math.min(...w)+Math.max(...w))/2,y=(Math.min(...M)+Math.max(...M))/2,s=Math.max(...e(d).map(E=>Math.sqrt((E.x-K)**2+(E.y-y)**2))),x=(o-t()*2)/(s*2),b=o/2-K*x,h=o/2-y*x;return e(d).map(E=>`${E.x*x+b},${E.y*x+h}`).join(" ")});var m=Ze();H(m,"viewBox","0 0 100 100");var p=B(m);{var f=w=>{var M=Oe();H(M,"cx",_),H(M,"cy",_),W(()=>{H(M,"r",(o-t()*2)/2.6),H(M,"fill",n.unit.color),H(M,"transform",e(u))}),Y(w,M)},k=(w,M)=>{{var K=s=>{var x=Ge();W(()=>{H(x,"points",e(c)),H(x,"fill",n.unit.color),H(x,"transform",e(u))}),Y(s,x)},y=s=>{var x=ct();W(b=>yt(x,b),[()=>At(e(r))]),Y(s,x)};V(w,s=>{e(r)==="polygon"?s(K):s(y,!1)},M)}};V(p,w=>{e(r)==="circle"?w(f):w(k,!1)})}R(m),Y(l,m),et()}var Qe=Z("<!> <!> <!> <!>",1),$e=Z("<small><code> </code></small>"),tn=Z("Unit <!>",1),en=Z('<div class="display_contents"><!></div>');function nn(l,n){tt(n,!0);const t=_=>{var u=ft(),c=$(u);{var m=p=>{We(p,{menu:w=>{var M=Qe(),K=$(M);kt(K,{icon:"⎘",run:()=>{const h=n.unit.clone();h.x+=10,h.y+=10,n.scene.add_unit(h)},children:(h,E)=>{ot();var C=ct("Duplicate unit");Y(h,C)},$$slots:{default:!0}});var y=D(K,2);{var s=h=>{kt(h,{icon:"◎",run:()=>{n.unit.create_new_point()},children:(E,C)=>{ot();var z=ct("Add point to polygon");Y(E,z)},$$slots:{default:!0}})};V(y,h=>{n.unit.type==="polygon"&&h(s)})}var x=D(y,2);kt(x,{icon:"⌸",run:async()=>{const h=JSON.stringify(n.unit.json);await navigator.clipboard.writeText(h)},children:(h,E)=>{ot();var C=ct("Copy data to clipboard");Y(h,C)},$$slots:{default:!0}});var b=D(x,2);kt(b,{icon:"✕",run:()=>{n.scene.remove_unit(n.unit)},children:(h,E)=>{ot();var C=ct("Delete unit");Y(h,C)},$$slots:{default:!0}}),Y(w,M)},icon:w=>{Je(w,{get unit(){return n.unit}})},children:(w,M)=>{ot();var K=tn(),y=D($(K));{var s=b=>{var h=ct();W(()=>yt(h,n.unit.name)),Y(b,h)},x=b=>{var h=$e(),E=B(h),C=B(E,!0);R(E),R(h),W(()=>yt(C,n.unit.id_string)),Y(b,h)};V(y,b=>{n.unit.name?b(s):b(x,!1)})}Y(w,K)},$$slots:{menu:!0,icon:!0,default:!0}})};V(c,p=>{n.unit&&p(m)})}Y(_,u)};var r=ft(),d=$(r);{var a=_=>{var u=en(),c=B(u);dt(c,()=>n.children),R(u),ue(u,(m,p)=>{var f;return(f=ce)==null?void 0:f(m,p)},()=>t),W(()=>H(u,"data-unit",n.unit.id)),Y(_,u)},o=_=>{var u=ft(),c=$(u);dt(c,()=>n.children),Y(_,u)};V(d,_=>{n.unit?_(a):_(o,!1)})}Y(l,r),et()}const ln=()=>({selecting:!1,selection_start_x:0,selection_start_y:0,selection_width:0,selection_height:0,initial_pointer_x:0,initial_pointer_y:0});var wt,lt,_t;class rn{constructor(n){Et(this,"selection_threshold",0);vt(this,wt,g(gt(ln())));vt(this,lt,g(gt(new Set)));vt(this,_t,g(gt(new Set)));this.helpers=n}get state(){return e(Q(this,wt))}set state(n){i(Q(this,wt),n,!0)}has(n){return e(Q(this,lt)).has(n)}add(n){e(Q(this,lt)).add(n)}delete(n){e(Q(this,lt)).delete(n)}clear(){e(Q(this,lt)).clear()}get_selected_items(){return Array.from(e(Q(this,lt)))}handle_selection_start(n,t,r){const d=this.helpers.find_top_item(n,t),a=d&&this.has(d);if(this.state.initial_pointer_x=n,this.state.initial_pointer_y=t,i(Q(this,_t),new Set(e(Q(this,lt))),!0),r==="subtractive"&&a){this.delete(d);return}d&&r!=="subtractive"?(r==="normal"&&this.clear(),this.add(d)):r==="normal"&&this.clear()}start_drag(n,t){this.state.selecting=!0,this.state.selection_start_x=n,this.state.selection_start_y=t,this.state.selection_width=0,this.state.selection_height=0}update_drag(n,t,r){if(!this.state.selecting)return;this.state.selection_width=n-this.state.selection_start_x,this.state.selection_height=t-this.state.selection_start_y;const d=this.state.selection_width>=0?this.state.selection_start_x:n,a=this.state.selection_height>=0?this.state.selection_start_y:t,o=Math.abs(this.state.selection_width),_=Math.abs(this.state.selection_height),u=this.helpers.find_all_items(d,a,o,_);switch(r){case"additive":i(Q(this,lt),new Set(e(Q(this,_t))),!0);for(const c of u)this.add(c);break;case"subtractive":i(Q(this,lt),new Set(e(Q(this,_t))),!0);for(const c of u)this.delete(c);break;case"normal":this.clear();for(const c of u)this.add(c);break;default:throw new _e(r)}}end_drag(n,t,r){const d=n-this.state.initial_pointer_x,a=t-this.state.initial_pointer_y,o=Math.sqrt(d*d+a*a)>this.selection_threshold;this.state.selecting&&o&&this.update_drag(n,t,r),this.state.selecting=!1,this.state.selection_width=0,this.state.selection_height=0,e(Q(this,_t)).clear()}}wt=new WeakMap,lt=new WeakMap,_t=new WeakMap;const on=(l,n,t,r,d,a,o,_)=>{n(l.offsetX,l.offsetY),t(t().pointer_down=!0,!0),t(t().drag_start_x=t().pointer_x,!0),t(t().drag_start_y=t().pointer_y,!0),t(t().drag_start_client_x=t(t().pointer_last_client_x=l.clientX,!0),!0),t(t().drag_start_client_y=t(t().pointer_last_client_y=l.clientY,!0),!0);const u=l.shiftKey&&l.ctrlKey&&!l.altKey;if(t().hovering_handle){!l.altKey&&l.shiftKey&&t().hovering_unit&&(t(t().dragging_unit=t().hovering_unit,!0),t(t().dragging_selection=!0,!0),r.unit_selection.has(t().hovering_unit)||((!l.ctrlKey||u)&&r.unit_selection.clear(),r.unit_selection.add(t().hovering_unit)),u&&e(d)&&a());return}const c=t().hovering_unit;if(c&&r.unit_selection.has(c)&&(l.shiftKey&&!l.altKey||!l.ctrlKey)){t(t().dragging_unit=c,!0),t(t().dragging_selection=!0,!0),u&&e(d)&&a();return}o.handle_selection_start(t().pointer_x,t().pointer_y,_(l)),r.unit_selection.clear();for(const p of o.get_selected_items())r.unit_selection.add(p)},sn=(l,n,t,r,d,a,o)=>{if(n(l.offsetX,l.offsetY),t.state.selecting){t.end_drag(r().pointer_x,r().pointer_y,d(l)),a.unit_selection.clear();for(const _ of t.get_selected_items())a.unit_selection.add(_)}o()},an=(l,n,t,r,d,a)=>{if(n(l.offsetX,l.offsetY),t(t().pointer_last_client_x=l.clientX,!0),t(t().pointer_last_client_y=l.clientY,!0),t().pointer_down&&!t().dragging_unit){const o=t().pointer_x-r.state.initial_pointer_x,_=t().pointer_y-r.state.initial_pointer_y;Math.sqrt(o*o+_*_)>r.selection_threshold&&!r.state.selecting&&r.start_drag(r.state.initial_pointer_x,r.state.initial_pointer_y)}if(r.state.selecting){r.update_drag(t().pointer_x,t().pointer_y,d(l)),a.unit_selection.clear();for(const o of r.get_selected_items())a.unit_selection.add(o)}};var un=rt('<rect class="selection_rect svelte-1s96klh"></rect>'),cn=Z('<div><svg class="controls_layer svelte-1s96klh"><!><!></svg></div> <!>',1);function Cn(l,n){tt(n,!0);const t=nt(n,"scene_interaction_surface_state",15),r=U(()=>n.scene.controller),d=s=>s,a=s=>s,o=new rn({find_top_item:n.scene.find_top_unit_at_point,find_all_items:n.scene.find_all_units_in_rect}),_=s=>s.shiftKey&&s.ctrlKey?"additive":s.ctrlKey?"subtractive":s.shiftKey?"additive":"normal",u=U(()=>t().hovering_unit!==null&&n.unit_selection.has(t().hovering_unit)),c=(s,x)=>{const b=d(s),h=a(x),E=t().pointer_x,C=t().pointer_y;if(t(t().pointer_x=b,!0),t(t().pointer_y=h,!0),t().dragging_unit){const z=b-E,q=h-C;for(const O of n.unit_selection)O.x+=z,O.y+=q}else t(t().hovering_unit=n.scene.find_top_unit_at_point(b,h),!0),t().hovering_unit&&t(t().hovered_unit=t().hovering_unit,!0)},m=()=>{t(t().pointer_down=!1,!0),t(t().drag_start_x=null,!0),t(t().drag_start_y=null,!0),t(t().dragging_unit=null,!0),t(t().dragging_selection=!1,!0),t(t().drag_start_client_x=null,!0),t(t().drag_start_client_y=null,!0),t(t().pointer_last_client_x=null,!0),t(t().pointer_last_client_y=null,!0)},p=()=>{const s=[];for(const x of n.unit_selection){const b=x.clone();n.scene.add_unit(b),s.push(b)}n.unit_selection.clear(),o.clear();for(const x of s)n.unit_selection.add(x),o.add(x)},f=s=>{c(s.offsetX,s.offsetY),t(t().pointing=!0,!0)},k=s=>{c(s.offsetX,s.offsetY),t(t().pointing=!1,!0),t(t().hovering_unit=null,!0)},w=s=>{t().pointer_down&&t(t().pointer_down=!1,!0),t(t().dragging_unit=null,!0),t(t().dragging_selection=!1,!0)},M=s=>{(s.key==="Shift"||s.key==="Control")&&o.update_drag(t().pointer_x,t().pointer_y,_(s))},K=s=>{(s.key==="Shift"||s.key==="Control")&&o.update_drag(t().pointer_x,t().pointer_y,_(s))},y=s=>{if(!de(s.target))return;const{key:x}=s;if(x==="Escape"){if(!t().dragging_unit)return;const b=t().pointer_x-t().drag_start_x,h=t().pointer_y-t().drag_start_y;for(const E of n.unit_selection)E.x-=b,E.y-=h;m(),it(s)}else if(x==="Delete"){for(const b of n.unit_selection)n.scene.remove_unit(b);n.unit_selection.clear(),o.clear(),m(),it(s)}};A("keydown",L,M),A("keyup",L,K),A("keydown",L,y,!0),nn(l,{get scene(){return n.scene},get unit(){return t().hovered_unit},children:(s,x)=>{var b=cn(),h=$(b);let E;h.__pointerdown=[on,c,t,n,u,p,o,_],h.__pointerup=[sn,c,o,t,_,n,m],h.__pointermove=[an,c,t,o,_,n];let C;var z=B(h),q=B(z);Ut(q,16,()=>Array.from(n.unit_selection),X=>X,(X,J)=>{Le(X,{get unit(){return J}})});var O=D(q);{var G=X=>{var J=un();W((I,j)=>{H(J,"x",o.state.selection_width>=0?o.state.selection_start_x:o.state.selection_start_x+o.state.selection_width),H(J,"y",o.state.selection_height>=0?o.state.selection_start_y:o.state.selection_start_y+o.state.selection_height),H(J,"width",I),H(J,"height",j)},[()=>Math.abs(o.state.selection_width),()=>Math.abs(o.state.selection_height)]),Y(X,J)};V(O,X=>{o.state.selecting&&X(G)})}R(z),R(h);var S=D(h,2);{var v=X=>{ht(X,{get x_start(){return t().drag_start_client_x},get y_start(){return t().drag_start_client_y},get x_last(){return t().pointer_last_client_x},get y_last(){return t().pointer_last_client_y}})};V(S,X=>{t().dragging_unit&&X(v)})}W(X=>{E=at(h,1,"scene_interaction_surface svelte-1s96klh",null,E,X),C=st(h,"",C,{width:`${n.width??""}px`,height:`${n.height??""}px`}),H(z,"width",n.width),H(z,"height",n.height)},[()=>({pressing:t().pointer_down,selecting:o.state.selecting,hovering:!!t().hovering_unit,hovering_selection:e(u),grabbable:t().hovering_unit&&n.unit_selection.has(t().hovering_unit)&&!o.state.selecting&&!t().pointer_down,grabbing:t().dragging_unit!==null,pressing_shift:e(r).pressing_shift,pressing_ctrl:e(r).pressing_ctrl,pressing_alt:e(r).pressing_alt})]),A("pointerenter",h,f),A("pointerleave",h,k),A("pointercancel",h,w),Y(s,b)},$$slots:{default:!0}}),et()}ut(["pointerdown","pointerup","pointermove"]);var _n=Z('<div class="flex align_items_end font_weight_700 px_md font_mono"><div class="text_align_right pr_xs"> </div> <div class="text_color_4">fps</div></div>');function zn(l,n){tt(n,!0);const t=U(()=>n.clock??ve.get());var r=_n(),d=B(r);st(d,"",{},{width:"4rem"});var a=B(d,!0);R(d),ot(2),R(r),W(()=>yt(a,e(t).average_fps)),Y(l,r),et()}var dn=(l,n)=>i(n,!0),vn=Z("<p><strong>WASD</strong> and <strong>arrow keys</strong> to move the player</p>"),gn=Z("<p><strong>` Backtick</strong> to toggle playing</p>"),hn=Z('<div class="box width_md mx_auto"><div class="pane p_md"><h2 class="mt_0">Global controls</h2> <!> <p><strong>r</strong> to reset</p> <p><strong>spacebar</strong> to toggle the clock</p> <!> <p><strong>~ Shift+Backtick</strong> to toggle editing</p> <p>edit with mouse and <strong>Ctrl</strong>/<strong>Shift</strong>/<strong>Alt</strong>:</p> <ul><li><strong>Shift</strong> to add to selection</li> <li><strong>Ctrl</strong> to remove from selection</li> <li><strong>Delete</strong> to delete the selected units</li> <li><strong>Shift+Ctrl</strong> to duplicate the selected units</li> <li><strong>Alt</strong> to recenter polygons</li> <li><strong>Alt</strong> to duplicate points</li> <li><strong>Alt+Ctrl</strong> to delete points</li></ul></div></div>'),fn=Z('<button type="button">help</button> <!>',1);function Kn(l,n){tt(n,!0);const t=jt.get();let r=g(!1);var d=fn(),a=$(d);a.__click=[dn,r];var o=D(a,2);{var _=u=>{ge(u,{onclose:()=>i(r,!1),children:(c,m)=>{var p=hn(),f=B(p),k=D(B(f),2);{var w=y=>{var s=vn();Y(y,s)};V(k,y=>{t.player_input_enabled&&y(w)})}var M=D(k,6);{var K=y=>{var s=gn();Y(y,s)};V(M,y=>{t.player_input_enabled&&y(K)})}ot(6),R(f),R(p),Y(c,p)},$$slots:{default:!0}})};V(o,u=>{e(r)&&u(_)})}Y(l,d),et()}ut(["click"]);export{zn as F,Kn as H,En as S,Je as U,Pn as a,Cn as b,Xn as c,nn as d};
