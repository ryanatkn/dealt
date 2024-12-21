var Rt=Object.defineProperty;var St=l=>{throw TypeError(l)};var Vt=(l,e,t)=>e in l?Rt(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var Mt=(l,e,t)=>Vt(l,typeof e!="symbol"?e+"":e,t),It=(l,e,t)=>e.has(l)||St("Cannot "+t);var O=(l,e,t)=>(It(l,e,"read from private field"),t?t.call(l):e.get(l)),_t=(l,e,t)=>e.has(l)?St("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(l):e.set(l,t),wt=(l,e,t,o)=>(It(l,e,"write to private field"),o?o.call(l,t):e.set(l,t),t);import{a as I,t as L,n as it,c as ut,b as st}from"./disclose-version.Ds06f9Vu.js";import{aJ as Wt,K as n,k as Ft,j as Xt,a1 as Lt,a4 as Jt,v as F,m as N,o as Z,q as G,L as U,c as q,s as T,D as Et,r as B,n as ot,a0 as p,u as Pt,W as i,aI as D}from"./runtime.5k9ShzZt.js";import{d as rt,o as Kt,k as j,s as vt}from"./render.CAjsxhF5.js";import{i as R,p as Q,c as v}from"./props.lofZ2jro.js";import{s as ct}from"./snippet.CcawutmI.js";import{b as tt,r as Ct,t as J,s as z,g as Ot,a as Zt,e as zt}from"./string.25aLtQ0-.js";import{t as Gt,s as Qt}from"./index.DteDSzYE.js";import{ao as $t,e as Ht,P as te,u as ee,ap as ne,Q as nt,aq as pt,ar as ie,as as le,at as oe,au as Ut,K as re,M as Yt,N as se,a2 as ae,L as mt,av as ue,c as ce,F as de}from"./renderer_components.CDs5-iuN.js";import{c as _e}from"./svelte-component.BgFhLqea.js";import{b as ge}from"./preload-helper.DV2ohNv5.js";function ve(l){let e=0,t=Jt(0),o;return()=>{Wt()&&(n(t),Ft(()=>(e===0&&(o=Xt(()=>l(()=>$t(t)))),e+=1,()=>{Lt().then(()=>{e-=1,e===0&&(o==null||o(),o=void 0)})})))}}var ht,ft;class jt{constructor(e,t){_t(this,ht);_t(this,ft);wt(this,ht,e),wt(this,ft,ve(t))}get current(){return O(this,ft).call(this),O(this,ht).call(this)}}ht=new WeakMap,ft=new WeakMap;var he=(l,e)=>n(e).reset(),fe=L('<fieldset><label class="row pt_xs"><input type="checkbox"> show bounding volume hierarchy</label></fieldset>'),ye=L('<div class="scene_controls svelte-1l7n56e"><button type="button" title="toggle the clock [Spacebar]"><div class="pr_sm">clock</div> <!></button> <button type="button" title="reset the scene [r]" class="plain">reset</button> <button type="button" class="plain deselectable">edit</button> <!></div> <!>',1);function Mn(l,e){G(e,!0);const t=U(()=>e.project.renderer),o=U(()=>e.project.scene),h=U(()=>n(o).clock),u=Ht.get();var r=ye(),g=F(r),c=q(g);c.__click=function(...w){var Y;(Y=n(h).toggle)==null||Y.apply(this,w)},tt(c,"min-width","105px");var _=T(q(c),2);te(_,{get running(){return n(h).running}}),B(c);var y=T(c,2);y.__click=[he,o];var b=T(y,2);b.__click=()=>u.editing=!u.editing;var m=T(b,2);ct(m,()=>e.children??Et),B(g);var S=T(g,2);{var k=w=>{var Y=fe(),E=q(Y),f=q(E);Ct(f),ot(),B(E),B(Y),ee(f,()=>n(t).show_bvh,M=>n(t).show_bvh=M),Gt(3,Y,()=>Qt),I(w,Y)};R(S,w=>{n(t).type==="canvas"&&w(k)})}N(()=>{J(c,"color_d",n(h).running),z(b,"title",`${(u.editing?"stop editing":"start editing")??""} [~ Shift+Backtick]`),J(b,"color_d",u.editing)}),I(l,r),Z()}rt(["click"]);const me=new jt(()=>window.innerWidth,l=>Kt(window,"resize",l)),pe=new jt(()=>window.innerHeight,l=>Kt(window,"resize",l));var we=it('<line class="svelte-4z6b3j"></line>'),xe=it('<svg class="scrubbing_indicator svelte-4z6b3j" aria-hidden="true"><!></svg>');function gt(l,e){G(e,!0);const t=U(()=>e.container_width??me.current),o=U(()=>e.container_height??pe.current);ne(l,{to:document.body,children:(h,u)=>{var r=xe(),g=q(r);{var c=_=>{var y=we();N(()=>{z(y,"x1",e.x_start),z(y,"y1",e.y_start),z(y,"x2",e.x_last),z(y,"y2",e.y_last)}),I(_,y)};R(g,_=>{e.x_start!==null&&e.y_start!==null&&e.x_last!==null&&e.y_last!==null&&_(c)})}B(r),N(()=>{z(r,"viewBox",`0 0 ${n(t)??""} ${n(o)??""}`),z(r,"width",n(t)),z(r,"height",n(o))}),I(h,r)},$$slots:{default:!0}}),Z()}const be=(l,e)=>{l.ctrlKey||e(l.clientX,l.clientY)};var ke=L('<div class="title svelte-1emv8hj"><!></div>'),Se=L('<label role="slider"><!> <input></label> <!>',1);function In(l,e){G(e,!0);let t=Q(e,"value",15,0),o=Q(e,"type",3,"text"),h=Q(e,"inputmode",3,"numeric"),u=Q(e,"step",3,1),r=Q(e,"min",19,()=>1/0*-1),g=Q(e,"row",3,!1),c=p(v(t())),_=p(v(t().toString()));const y=P=>{var A;i(c,v(P)),t(Math.max(r(),P)),i(_,v(t().toString())),(A=e.oninput)==null||A.call(e,t())};Pt(()=>{t()!==Xt(()=>n(c))&&(i(c,v(t())),i(_,v(t().toString())))});const b=P=>{i(_,v(P));const A=parseFloat(P);Number.isNaN(A)||y(A)},m=P=>{y(n(c)+P)};let S=p(!1),k=p(null),w=p(null),Y=p(null),E=p(null),f=p(null),M=p(null),x=p(null);const d=U(()=>n(M)===null||n(E)===null?null:n(M)-n(E)),X=U(()=>n(x)===null||n(f)===null?null:n(f)-n(x)),K=U(()=>n(d)===null||n(X)===null?null:(n(d)+n(X))*u()),C=(P,A)=>{n(S)||(i(S,!0),i(k,v(t())),i(w,v(P)),i(Y,v(A)),i(E,v(P)),i(f,v(A)))},V=()=>{i(S,!1),i(k,null),i(w,null),i(Y,null),i(E,null),i(f,null),i(M,null),i(x,null)},W=(P,A)=>{i(E,v(n(M))),i(f,v(n(x))),i(M,v(P)),i(x,v(A)),n(K)!==null&&m(n(K))},s=P=>{V()},a=P=>{V()},H=P=>{W(P.clientX,P.clientY)},$=P=>{P.key==="Escape"&&(y(n(k)),V(),nt(P))};var dt=Se();j("pointerup",D,function(...P){var A;(A=n(S)?s:void 0)==null||A.apply(this,P)}),j("pointermove",D,function(...P){var A;(A=n(S)?H:void 0)==null||A.apply(this,P)}),j("pointerleave",D,function(...P){var A;(A=n(S)?a:void 0)==null||A.apply(this,P)}),j("keydown",D,function(...P){var A;(A=n(S)?$:void 0)==null||A.apply(this,P)},!0);var lt=F(dt);lt.__pointerdown=[be,C];var xt=q(lt);{var Tt=P=>{var A=ke(),Dt=q(A);ct(Dt,()=>e.children),B(A),I(P,A)};R(xt,P=>{e.children&&P(Tt)})}var bt=T(xt,2);Ct(bt);var Nt=P=>b(P.currentTarget.value);let kt;B(lt);var qt=T(lt,2);{var Bt=P=>{gt(P,{get x_start(){return n(w)},get y_start(){return n(Y)},get x_last(){return n(E)},get y_last(){return n(f)}})};R(qt,P=>{n(S)&&P(Bt)})}N(()=>{Ot(lt,`${e.classes??""} svelte-1emv8hj`),z(lt,"aria-valuenow",n(K)),z(lt,"title",e.title),J(lt,"selected",n(S)),J(lt,"row",g()),kt=Zt(bt,kt,{...e.attrs,class:e.input_classes,value:n(_),oninput:Nt,type:o(),inputmode:h(),step:u(),min:r(),max:e.max},"svelte-1emv8hj")}),I(l,dt),Z()}rt(["pointerdown"]);var Me=L('<div class="scene_renderer svelte-1hiky75"><!></div>');function Yn(l,e){G(e,!0);var t=Me(),o=q(t);{var h=u=>{var r=ut(),g=F(r);_e(g,()=>e.Component,(c,_)=>{_(c,{get scene(){return e.scene},get renderer(){return e.renderer}})}),I(u,r)};R(o,u=>{u(h)})}B(t),N(()=>{tt(t,"width",`${e.renderer.width??""}px`),tt(t,"height",`${e.renderer.height??""}px`),tt(t,"min-width",`${e.renderer.width??""}px`),tt(t,"min-height",`${e.renderer.height??""}px`)}),I(l,t),Z()}const Ie=(l,e)=>{e(l.clientX,l.clientY),nt(l)};var Ye=it('<polygon role="none" class="unit_circle_radius_handles svelte-1i5of7p" fill="var(--color_selected)"></polygon><!>',1);function Xe(l,e){G(e,!0);const t=Q(e,"unit",7),o=Q(e,"size",3,pt),h=.5;let u=p(!1),r=p(null),g=p(null),c=p(null),_=p(null),y=p(null),b=p(null),m=p(null);const S=U(()=>t().x),k=U(()=>t().y-Math.max(o(),t().radius*Math.abs(t().scale))),w=U(()=>o()/2),Y=(s,a)=>{n(u)||(i(u,!0),i(r,v(t().radius)),i(g,v(s)),i(c,v(a)),i(_,v(s)),i(y,v(a)))},E=()=>{i(u,!1),i(r,null),i(g,null),i(c,null),i(_,null),i(y,null),i(b,null),i(m,null)},f=(s,a)=>{i(_,v(n(b))),i(y,v(n(m))),i(b,v(s)),i(m,v(a)),n(_)!==null&&n(y)!==null&&(t().radius=ie(n(r)+h*(n(b)-n(g)-(n(m)-n(c)))))},M=s=>{E()},x=s=>{E()},d=s=>{f(s.clientX,s.clientY)},X=s=>{s.key==="Escape"&&(t().radius=n(r),E(),nt(s))};var K=Ye();j("pointerup",D,function(...s){var a;(a=n(u)?M:void 0)==null||a.apply(this,s)}),j("pointermove",D,function(...s){var a;(a=n(u)?d:void 0)==null||a.apply(this,s)}),j("pointerleave",D,function(...s){var a;(a=n(u)?x:void 0)==null||a.apply(this,s)}),j("keydown",D,function(...s){var a;(a=n(u)?X:void 0)==null||a.apply(this,s)},!0);var C=F(K);C.__pointerdown=[Ie,Y];var V=T(C);{var W=s=>{gt(s,{get x_start(){return n(g)},get y_start(){return n(c)},get x_last(){return n(_)},get y_last(){return n(y)}})};R(V,s=>{n(u)&&s(W)})}N(()=>{z(C,"points",`${n(S)-n(w)},${n(k)-n(w)} ${n(S)+n(w)},${n(k)-n(w)} ${n(S)??""},${n(k)+n(w)}`),J(C,"pressing",n(u))}),I(l,K),Z()}rt(["pointerdown"]);const Ee=(l,e)=>{e(l.clientX,l.clientY),nt(l)};var Pe=it('<circle role="none" class="unit_scale_handles svelte-rpawlp" fill="var(--color_selected)"></circle><!>',1);function At(l,e){G(e,!0);const t=Q(e,"unit",7),o=Q(e,"size",3,pt),h=.01;let u=p(!1),r=p(null),g=p(null),c=p(null),_=p(null),y=p(null),b=p(null),m=p(null),S=p(null),k=p(null);const w=U(()=>t().scene.controller.pressing_alt?"move":"nesw-resize"),Y=(s,a)=>{n(u)||(i(u,!0),i(r,v(t().scale)),i(g,v(t().x)),i(c,v(t().y)),i(_,v(s)),i(y,v(a)),i(b,v(s)),i(m,v(a)))},E=()=>{i(u,!1),i(r,null),i(g,null),i(c,null),i(_,null),i(y,null),i(b,null),i(m,null),i(S,null),i(k,null)},f=(s,a)=>{i(b,v(n(S))),i(m,v(n(k))),i(S,v(s)),i(k,v(a)),n(b)!==null&&n(m)!==null&&(t().scene.controller.pressing_alt?t().move_center_to(t().x+(n(S)-n(b)),t().y+(n(k)-n(m))):t().scale=le(n(r)+h*(n(S)-n(_)-(n(k)-n(y)))))},M=s=>{E()},x=s=>{E()},d=s=>{f(s.clientX,s.clientY)},X=s=>{s.key==="Escape"&&(t().scene.controller.pressing_alt?t().move_center_to(n(g),n(c)):t().scale=n(r),E(),nt(s))};var K=Pe();j("pointerup",D,function(...s){var a;(a=n(u)?M:void 0)==null||a.apply(this,s)}),j("pointermove",D,function(...s){var a;(a=n(u)?d:void 0)==null||a.apply(this,s)}),j("pointerleave",D,function(...s){var a;(a=n(u)?x:void 0)==null||a.apply(this,s)}),j("keydown",D,function(...s){var a;(a=n(u)?X:void 0)==null||a.apply(this,s)},!0);var C=F(K);C.__pointerdown=[Ee,Y];var V=T(C);{var W=s=>{gt(s,{get x_start(){return n(_)},get y_start(){return n(y)},get x_last(){return n(b)},get y_last(){return n(m)}})};R(V,s=>{n(u)&&s(W)})}N(()=>{z(C,"cx",t().x),z(C,"cy",t().y),z(C,"r",o()/2),J(C,"pressing",n(u)),tt(C,"cursor",n(w))}),I(l,K),Z()}rt(["pointerdown"]);var Ke=L("<!> <!>",1);function Ce(l,e){var t=Ke(),o=F(t);At(o,{get unit(){return e.unit}});var h=T(o,2);Xe(h,{get unit(){return e.unit}}),I(l,t)}const ze=(l,e)=>{e(l.clientX,l.clientY),nt(l)};var He=it('<polygon role="none" class="unit_polygon_point_handles svelte-1fl6mbc" fill="var(--color_selected)"></polygon><!>',1);function Ue(l,e){G(e,!0);const t=Q(e,"size",3,pt);let o=p(!1),h=p(null),u=p(null),r=p(null),g=p(null),c=p(null),_=p(null),y=p(null),b=p(null),m=p(v(e.point));const S=U(()=>e.unit.x+e.transformed_point.x),k=U(()=>e.unit.y+e.transformed_point.y),w=U(()=>t()/2),Y=U(()=>e.unit.scene.controller.pressing_ctrl&&e.unit.scene.controller.pressing_alt?"no-drop":e.unit.scene.controller.pressing_alt?e.unit.scene.controller.pressing_shift?"alias":"copy":"move"),E=(a,H)=>{if(e.unit.scene.controller.pressing_ctrl&&e.unit.scene.controller.pressing_alt){e.unit.points.length>3&&e.unit.remove_point(e.point);return}n(o)||(i(o,!0),e.unit.scene.controller.pressing_alt?i(m,v(e.unit.duplicate_point(e.point,e.unit.scene.controller.pressing_shift))):i(m,v(e.point)),i(h,v(n(m).x)),i(u,v(n(m).y)),i(r,v(a)),i(g,v(H)),i(c,v(a)),i(_,v(H)))},f=()=>{i(o,!1),i(h,null),i(u,null),i(r,null),i(g,null),i(c,null),i(_,null),i(y,null),i(b,null),i(m,v(e.point))},M=(a,H)=>{i(c,v(n(y))),i(_,v(n(b))),i(y,v(a)),i(b,v(H)),n(c)!==null&&n(_)!==null&&e.unit.move_transformed_point(n(m),n(y)-n(c),n(b)-n(_))},x=a=>{f()},d=a=>{f()},X=a=>{M(a.clientX,a.clientY)},K=a=>{a.key==="Escape"&&(e.unit.scene.controller.pressing_alt&&n(m)!==e.point?e.unit.remove_point(n(m)):(n(m).x=n(h),n(m).y=n(u),e.unit.update_points()),f(),nt(a))};var C=He();j("pointerup",D,function(...a){var H;(H=n(o)?x:void 0)==null||H.apply(this,a)}),j("pointermove",D,function(...a){var H;(H=n(o)?X:void 0)==null||H.apply(this,a)}),j("pointerleave",D,function(...a){var H;(H=n(o)?d:void 0)==null||H.apply(this,a)}),j("keydown",D,function(...a){var H;(H=n(o)?K:void 0)==null||H.apply(this,a)},!0);var V=F(C);V.__pointerdown=[ze,E];var W=T(V);{var s=a=>{gt(a,{get x_start(){return n(r)},get y_start(){return n(g)},get x_last(){return n(c)},get y_last(){return n(_)}})};R(W,a=>{n(o)&&a(s)})}N(()=>{z(V,"points",`${n(S)-n(w)},${n(k)-n(w)} ${n(S)+n(w)},${n(k)-n(w)} ${n(S)??""},${n(k)+n(w)}`),J(V,"pressing",n(o)),tt(V,"cursor",n(Y))}),I(l,C),Z()}rt(["pointerdown"]);const je=(l,e)=>{e(l.clientX,l.clientY),nt(l)};var Ae=it('<polygon role="none" class="unit_angle_handles svelte-185pjka" fill="var(--color_selected)"></polygon><!>',1);function Te(l,e){G(e,!0);const t=Q(e,"unit",7),o=Q(e,"size",3,pt),h=.013;let u=p(!1),r=p(null),g=p(null),c=p(null),_=p(null),y=p(null),b=p(null),m=p(null);const S=(s,a)=>{n(u)||(i(u,!0),i(r,v(t().angle)),i(g,v(s)),i(c,v(a)),i(_,v(s)),i(y,v(a)))},k=()=>{i(u,!1),i(r,null),i(g,null),i(c,null),i(_,null),i(y,null),i(b,null),i(m,null)},w=(s,a)=>{i(_,v(n(b))),i(y,v(n(m))),i(b,v(s)),i(m,v(a)),n(_)!==null&&n(y)!==null&&(t().angle=oe(n(r)+h*(n(b)-n(g)-(n(m)-n(c)))))},Y=s=>{k()},E=s=>{k()},f=s=>{w(s.clientX,s.clientY)},M=s=>{s.key==="Escape"&&(t().angle=n(r),k(),nt(s))},x=U(()=>t().x+o()*Math.cos(-1*(t().angle-Math.PI/2))),d=U(()=>t().y-o()*Math.sin(-1*(t().angle-Math.PI/2))),X=U(()=>`${n(x)},${n(d)-o()/2} ${n(x)+o()/3},${n(d)} ${n(x)},${n(d)+o()/2} ${n(x)-o()/3},${n(d)}`);var K=Ae();j("pointerup",D,function(...s){var a;(a=n(u)?Y:void 0)==null||a.apply(this,s)}),j("pointermove",D,function(...s){var a;(a=n(u)?f:void 0)==null||a.apply(this,s)}),j("pointerleave",D,function(...s){var a;(a=n(u)?E:void 0)==null||a.apply(this,s)}),j("keydown",D,function(...s){var a;(a=n(u)?M:void 0)==null||a.apply(this,s)},!0);var C=F(K);C.__pointerdown=[je,S];var V=T(C);{var W=s=>{gt(s,{get x_start(){return n(g)},get y_start(){return n(c)},get x_last(){return n(_)},get y_last(){return n(y)}})};R(V,s=>{n(u)&&s(W)})}N(()=>{z(C,"points",n(X)),z(C,"transform",`rotate(${t().rotation??""} ${n(x)??""} ${n(d)??""})`),J(C,"pressing",n(u))}),I(l,K),Z()}rt(["pointerdown"]);var Ne=L("<!> <!> <!>",1);function qe(l,e){G(e,!0);var t=Ne(),o=F(t);zt(o,18,()=>e.unit.points,r=>r,(r,g,c)=>{Ue(r,{get unit(){return e.unit},get point(){return g},get transformed_point(){return e.unit.transformed_points[n(c)]}})});var h=T(o,2);At(h,{get unit(){return e.unit}});var u=T(h,2);Te(u,{get unit(){return e.unit}}),I(l,t),Z()}function Be(l,e){G(e,!0);const t=U(()=>e.unit.type);var o=ut(),h=F(o);{var u=g=>{Ce(g,{get unit(){return e.unit}})},r=g=>{var c=ut(),_=F(c);{var y=m=>{qe(m,{get unit(){return e.unit}})},b=m=>{var S=st();N(()=>vt(S,Ut(n(t)))),I(m,S)};R(_,m=>{n(t)==="polygon"?m(y):m(b,!1)},!0)}I(g,c)};R(h,g=>{n(t)==="circle"?g(u):g(r,!1)})}I(l,o),Z()}var De=L('<menu class="pane unstyled svelte-pa2qv7"><!></menu>'),Re=L('<li role="none" class="svelte-pa2qv7"><div class="menu_item plain selectable svelte-pa2qv7" role="menuitem" aria-label="contextmenu submenmu" tabindex="-1"><div class="content"><div class="icon"><!></div> <div class="title"><!></div></div> <div class="chevron svelte-pa2qv7" aria-hidden="true"></div></div> <!></li>');function Ve(l,e){G(e,!0);const t=re.get(),o=t.add_submenu(),{layout:h}=t,u=U(()=>o.selected);let r=p(void 0);const g=Yt.get(),c=Yt.set();let _=p(0),y=p(0);Pt(()=>{n(r)&&b(n(r),h,g)});const b=(d,X,K)=>{const{x:C,y:V,width:W,height:s}=d.getBoundingClientRect();c.width=W,c.height=s;const a=C-n(_),H=V-n(y),$=a+W+K.width-X.width;if($<=0)i(_,v(K.width));else{const dt=W-a;dt<=0?i(_,-W):dt>$?i(_,K.width-$):i(_,dt-W)}i(y,v(Math.min(0,X.height-(H+s))))};var m=Re(),S=q(m),k=q(S),w=q(k),Y=q(w);ct(Y,()=>e.icon??Et),B(w);var E=T(w,2),f=q(E);ct(f,()=>e.children),B(E),B(k),ot(2),B(S);var M=T(S,2);{var x=d=>{var X=De(),K=q(X);ct(K,()=>e.menu),B(X),ge(X,C=>i(r,C),()=>n(r)),N(()=>{tt(X,"transform",`translate3d(${n(_)??""}px, ${n(y)??""}px, 0)`),tt(X,"max-height",`${h.height??""}px`)}),I(d,X)};R(M,d=>{n(u)&&d(x)})}B(m),N(()=>{tt(m,"--contextmenu_depth",o.depth),z(S,"aria-expanded",n(u)),J(S,"selected",n(u))}),j("mouseenter",S,d=>{nt(d),setTimeout(()=>t.select(o))}),I(l,m),Z()}var We=it('<circle role="none"></circle>'),Fe=it('<polygon role="none"></polygon>'),Le=it('<svg class="unit_icon svelte-yrh1le"><!></svg>');function Je(l,e){G(e,!0);const t=Q(e,"padding",3,2),o=U(()=>e.unit.type),h=U(()=>e.unit.points),u=U(()=>e.unit.angle),r=100,g=r/2,c=U(()=>`rotate(${n(u)*360/(Math.PI*2)} ${g} ${g})`),_=U(()=>{if(n(o)!=="polygon"||!n(h).length)return"";const k=n(h).map(X=>X.x),w=n(h).map(X=>X.y),Y=(Math.min(...k)+Math.max(...k))/2,E=(Math.min(...w)+Math.max(...w))/2,f=Math.max(...n(h).map(X=>Math.sqrt((X.x-Y)**2+(X.y-E)**2))),M=(r-t()*2)/(f*2),x=r/2-Y*M,d=r/2-E*M;return n(h).map(X=>`${X.x*M+x},${X.y*M+d}`).join(" ")});var y=Le();z(y,"viewBox",`0 0 ${r} ${r}`);var b=q(y);{var m=k=>{var w=We();z(w,"cx",g),z(w,"cy",g),N(()=>{z(w,"r",(r-t()*2)/2.6),z(w,"fill",e.unit.color),z(w,"transform",n(c))}),I(k,w)},S=k=>{var w=ut(),Y=F(w);{var E=M=>{var x=Fe();N(()=>{z(x,"points",n(_)),z(x,"fill",e.unit.color),z(x,"transform",n(c))}),I(M,x)},f=M=>{var x=st();N(()=>vt(x,Ut(n(o)))),I(M,x)};R(Y,M=>{n(o)==="polygon"?M(E):M(f,!1)},!0)}I(k,w)};R(b,k=>{n(o)==="circle"?k(m):k(S,!1)})}B(y),I(l,y),Z()}var Oe=L("<!> <!> <!> <!>",1),Ze=L("<small><code> </code></small>"),Ge=L("Unit <!>",1),Qe=L('<div class="display_contents"><!></div>');function $e(l,e){G(e,!0);const t=g=>{var c=ut(),_=F(c);{var y=b=>{Ve(b,{menu:k=>{var w=Oe(),Y=F(w);mt(Y,{icon:"⎘",run:()=>{const d=e.unit.clone();d.x+=10,d.y+=10,e.scene.add_unit(d)},children:(d,X)=>{ot();var K=st("Duplicate unit");I(d,K)},$$slots:{default:!0}});var E=T(Y,2);{var f=d=>{mt(d,{icon:"◎",run:()=>{e.unit.create_new_point()},children:(X,K)=>{ot();var C=st("Add point to polygon");I(X,C)},$$slots:{default:!0}})};R(E,d=>{e.unit.type==="polygon"&&d(f)})}var M=T(E,2);mt(M,{icon:"⌸",run:async()=>{const d=JSON.stringify(e.unit.json);await navigator.clipboard.writeText(d)},children:(d,X)=>{ot();var K=st("Copy data to clipboard");I(d,K)},$$slots:{default:!0}});var x=T(M,2);mt(x,{icon:"✕",run:()=>{e.scene.remove_unit(e.unit)},children:(d,X)=>{ot();var K=st("Delete unit");I(d,K)},$$slots:{default:!0}}),I(k,w)},icon:k=>{Je(k,{get unit(){return e.unit}})},children:(k,w)=>{ot();var Y=Ge(),E=T(F(Y));{var f=x=>{var d=st();N(()=>vt(d,e.unit.name)),I(x,d)},M=x=>{var d=Ze(),X=q(d),K=q(X,!0);B(X),B(d),N(()=>vt(K,e.unit.id_string)),I(x,d)};R(E,x=>{e.unit.name?x(f):x(M,!1)})}I(k,Y)},$$slots:{menu:!0,icon:!0,default:!0}})};R(_,b=>{e.unit&&b(y)})}I(g,c)};var o=ut(),h=F(o);{var u=g=>{var c=Qe(),_=q(c);ct(_,()=>e.children),B(c),se(c,(y,b)=>{var m;return(m=ae)==null?void 0:m(y,b)},()=>t),N(()=>z(c,"data-unit",e.unit.id)),I(g,c)},r=g=>{var c=ut(),_=F(c);ct(_,()=>e.children),I(g,c)};R(h,g=>{e.unit?g(u):g(r,!1)})}I(l,o),Z()}const tn=()=>({selecting:!1,selection_start_x:0,selection_start_y:0,selection_width:0,selection_height:0,initial_pointer_x:0,initial_pointer_y:0});var yt,et,at;class en{constructor(e){Mt(this,"selection_threshold",0);_t(this,yt,p(v(tn())));_t(this,et,p(v(new Set)));_t(this,at,p(v(new Set)));this.helpers=e}get state(){return n(O(this,yt))}set state(e){i(O(this,yt),v(e))}has(e){return n(O(this,et)).has(e)}add(e){n(O(this,et)).add(e)}delete(e){n(O(this,et)).delete(e)}clear(){n(O(this,et)).clear()}get_selected_items(){return Array.from(n(O(this,et)))}handle_selection_start(e,t,o){const h=this.helpers.find_top_item(e,t),u=h&&this.has(h);if(this.state.initial_pointer_x=e,this.state.initial_pointer_y=t,i(O(this,at),v(new Set(n(O(this,et))))),o==="subtractive"&&u){this.delete(h);return}h&&o!=="subtractive"?(o==="normal"&&this.clear(),this.add(h)):o==="normal"&&this.clear()}start_drag(e,t){this.state.selecting=!0,this.state.selection_start_x=e,this.state.selection_start_y=t,this.state.selection_width=0,this.state.selection_height=0}update_drag(e,t,o){if(!this.state.selecting)return;this.state.selection_width=e-this.state.selection_start_x,this.state.selection_height=t-this.state.selection_start_y;const h=this.state.selection_width>=0?this.state.selection_start_x:e,u=this.state.selection_height>=0?this.state.selection_start_y:t,r=Math.abs(this.state.selection_width),g=Math.abs(this.state.selection_height),c=this.helpers.find_all_items(h,u,r,g);switch(o){case"additive":i(O(this,et),v(new Set(n(O(this,at)))));for(const _ of c)this.add(_);break;case"subtractive":i(O(this,et),v(new Set(n(O(this,at)))));for(const _ of c)this.delete(_);break;case"normal":this.clear();for(const _ of c)this.add(_);break;default:throw new ue(o)}}end_drag(e,t,o){const h=e-this.state.initial_pointer_x,u=t-this.state.initial_pointer_y,r=Math.sqrt(h*h+u*u)>this.selection_threshold;this.state.selecting&&r&&this.update_drag(e,t,o),this.state.selecting=!1,this.state.selection_width=0,this.state.selection_height=0,n(O(this,at)).clear()}}yt=new WeakMap,et=new WeakMap,at=new WeakMap;const nn=(l,e,t,o,h,u,r,g)=>{e(l.offsetX,l.offsetY),t(t().pointer_down=!0,!0),t(t().drag_start_x=t().pointer_x,!0),t(t().drag_start_y=t().pointer_y,!0),t(t().drag_start_client_x=t(t().pointer_last_client_x=l.clientX,!0),!0),t(t().drag_start_client_y=t(t().pointer_last_client_y=l.clientY,!0),!0);const c=l.shiftKey&&l.ctrlKey&&!l.altKey;if(t().hovering_handle){!l.altKey&&l.shiftKey&&t().hovering_unit&&(t(t().dragging_unit=t().hovering_unit,!0),t(t().dragging_selection=!0,!0),o.unit_selection.has(t().hovering_unit)||((!l.ctrlKey||c)&&o.unit_selection.clear(),o.unit_selection.add(t().hovering_unit)),c&&n(h)&&u());return}const _=t().hovering_unit;if(_&&o.unit_selection.has(_)&&(l.shiftKey&&!l.altKey||!l.ctrlKey)){t(t().dragging_unit=_,!0),t(t().dragging_selection=!0,!0),c&&n(h)&&u();return}r.handle_selection_start(t().pointer_x,t().pointer_y,g(l)),o.unit_selection.clear();for(const b of r.get_selected_items())o.unit_selection.add(b)},ln=(l,e,t,o,h,u,r)=>{if(e(l.offsetX,l.offsetY),t.state.selecting){t.end_drag(o().pointer_x,o().pointer_y,h(l)),u.unit_selection.clear();for(const g of t.get_selected_items())u.unit_selection.add(g)}r()},on=(l,e,t,o,h,u)=>{if(e(l.offsetX,l.offsetY),t(t().pointer_last_client_x=l.clientX,!0),t(t().pointer_last_client_y=l.clientY,!0),t().pointer_down&&!t().dragging_unit){const r=t().pointer_x-o.state.initial_pointer_x,g=t().pointer_y-o.state.initial_pointer_y;Math.sqrt(r*r+g*g)>o.selection_threshold&&!o.state.selecting&&o.start_drag(o.state.initial_pointer_x,o.state.initial_pointer_y)}if(o.state.selecting){o.update_drag(t().pointer_x,t().pointer_y,h(l)),u.unit_selection.clear();for(const r of o.get_selected_items())u.unit_selection.add(r)}};var rn=it('<rect class="selection_rect svelte-1s96klh"></rect>'),sn=L('<div class="scene_interaction_surface svelte-1s96klh"><svg class="controls_layer svelte-1s96klh"><!><!></svg></div> <!>',1);function Xn(l,e){G(e,!0);const t=Q(e,"scene_interaction_surface_state",15),o=U(()=>e.scene.controller),h=f=>f,u=f=>f,r=new en({find_top_item:e.scene.find_top_unit_at_point,find_all_items:e.scene.find_all_units_in_rect}),g=f=>f.shiftKey&&f.ctrlKey?"additive":f.ctrlKey?"subtractive":f.shiftKey?"additive":"normal",c=U(()=>t().hovering_unit!==null&&e.unit_selection.has(t().hovering_unit)),_=(f,M)=>{const x=h(f),d=u(M),X=t().pointer_x,K=t().pointer_y;if(t(t().pointer_x=x,!0),t(t().pointer_y=d,!0),t().dragging_unit){const C=x-X,V=d-K;for(const W of e.unit_selection)W.x+=C,W.y+=V}else t(t().hovering_unit=e.scene.find_top_unit_at_point(x,d),!0),t().hovering_unit&&t(t().hovered_unit=t().hovering_unit,!0)},y=()=>{t(t().pointer_down=!1,!0),t(t().drag_start_x=null,!0),t(t().drag_start_y=null,!0),t(t().dragging_unit=null,!0),t(t().dragging_selection=!1,!0),t(t().drag_start_client_x=null,!0),t(t().drag_start_client_y=null,!0),t(t().pointer_last_client_x=null,!0),t(t().pointer_last_client_y=null,!0)},b=()=>{const f=[];for(const M of e.unit_selection){const x=M.clone();e.scene.add_unit(x),f.push(x)}e.unit_selection.clear(),r.clear();for(const M of f)e.unit_selection.add(M),r.add(M)},m=f=>{_(f.offsetX,f.offsetY),t(t().pointing=!0,!0)},S=f=>{_(f.offsetX,f.offsetY),t(t().pointing=!1,!0),t(t().hovering_unit=null,!0)},k=f=>{t().pointer_down&&t(t().pointer_down=!1,!0),t(t().dragging_unit=null,!0),t(t().dragging_selection=!1,!0)},w=f=>{(f.key==="Shift"||f.key==="Control")&&r.update_drag(t().pointer_x,t().pointer_y,g(f))},Y=f=>{(f.key==="Shift"||f.key==="Control")&&r.update_drag(t().pointer_x,t().pointer_y,g(f))},E=f=>{if(f.key==="Escape"&&t().dragging_unit){const M=t().pointer_x-t().drag_start_x,x=t().pointer_y-t().drag_start_y;for(const d of e.unit_selection)d.x-=M,d.y-=x;y(),nt(f)}};j("keydown",D,w),j("keyup",D,Y),j("keydown",D,E,!0),$e(l,{get scene(){return e.scene},get unit(){return t().hovered_unit},children:(f,M)=>{var x=sn(),d=F(x);d.__pointerdown=[nn,_,t,e,c,b,r,g],d.__pointerup=[ln,_,r,t,g,e,y],d.__pointermove=[on,_,t,r,g,e];const X=U(()=>t().hovering_unit&&e.unit_selection.has(t().hovering_unit)&&!r.state.selecting&&!t().pointer_down);N(()=>J(d,"grabbable",n(X)));var K=q(d),C=q(K);zt(C,16,()=>Array.from(e.unit_selection),H=>H,(H,$)=>{Be(H,{get unit(){return $}})});var V=T(C);{var W=H=>{var $=rn();N(()=>z($,"width",Math.abs(r.state.selection_width))),N(()=>z($,"height",Math.abs(r.state.selection_height))),N(()=>{z($,"x",r.state.selection_width>=0?r.state.selection_start_x:r.state.selection_start_x+r.state.selection_width),z($,"y",r.state.selection_height>=0?r.state.selection_start_y:r.state.selection_start_y+r.state.selection_height)}),I(H,$)};R(V,H=>{r.state.selecting&&H(W)})}B(K),B(d);var s=T(d,2);{var a=H=>{gt(H,{get x_start(){return t().drag_start_client_x},get y_start(){return t().drag_start_client_y},get x_last(){return t().pointer_last_client_x},get y_last(){return t().pointer_last_client_y}})};R(s,H=>{t().dragging_unit&&H(a)})}N(()=>{J(d,"pressing",t().pointer_down),J(d,"selecting",r.state.selecting),J(d,"hovering",!!t().hovering_unit),J(d,"hovering_selection",n(c)),J(d,"grabbing",t().dragging_unit!==null),J(d,"pressing_shift",n(o).pressing_shift),J(d,"pressing_ctrl",n(o).pressing_ctrl),J(d,"pressing_alt",n(o).pressing_alt),tt(d,"width",`${e.width??""}px`),tt(d,"height",`${e.height??""}px`),z(K,"width",e.width),z(K,"height",e.height)}),j("pointerenter",d,m),j("pointerleave",d,S),j("pointercancel",d,k),I(f,x)},$$slots:{default:!0}}),Z()}rt(["pointerdown","pointerup","pointermove"]);var an=L('<div class="flex align_items_end font_weight_700 px_md font_mono"><div class="text_align_right pr_xs"> </div> <div class="text_color_4">fps</div></div>');function En(l,e){G(e,!0);const t=U(()=>e.clock??ce.get());var o=an(),h=q(o);tt(h,"width","4rem");var u=q(h,!0);B(h),ot(2),B(o),N(()=>vt(u,n(t).average_fps)),I(l,o),Z()}var un=(l,e)=>i(e,!0),cn=L("<p><strong>WASD</strong> and <strong>arrow keys</strong> to move the player</p>"),dn=L("<p><strong>` Backtick</strong> to toggle playing</p>"),_n=L('<div class="content pane svelte-1487nr8"><h2 class="mt_0">Global controls</h2> <!> <p><strong>r</strong> to reset</p> <p><strong>spacebar</strong> to toggle the clock</p> <!> <p><strong>~ Shift+Backtick</strong> to toggle editing</p> <p>edit with mouse and <strong>Ctrl</strong>/<strong>Shift</strong>/<strong>Alt</strong>:</p> <ul><li><strong>Shift</strong> to add to selection</li> <li><strong>Ctrl</strong> to remove from selection</li> <li><strong>Shift+Ctrl</strong> to duplicate the selected units</li> <li><strong>Alt</strong> to recenter polygons</li> <li><strong>Alt</strong> to duplicate points</li> <li><strong>Alt+Shift</strong> to duplicate points counterclockwise</li></ul></div>'),gn=L('<button type="button">help</button> <!>',1);function Pn(l,e){G(e,!0);const t=Ht.get();let o=p(!1);var h=gn(),u=F(h);u.__click=[un,o];var r=T(u,2);{var g=c=>{de(c,{onclose:()=>i(o,!1),children:(_,y)=>{var b=_n(),m=T(q(b),2);{var S=Y=>{var E=cn();I(Y,E)};R(m,Y=>{t.player_input_enabled&&Y(S)})}var k=T(m,6);{var w=Y=>{var E=dn();I(Y,E)};R(k,Y=>{t.player_input_enabled&&Y(w)})}ot(6),B(b),I(_,b)},$$slots:{default:!0}})};R(r,c=>{n(o)&&c(g)})}I(l,h),Z()}rt(["click"]);export{En as F,Pn as H,Mn as S,Je as U,Yn as a,Xn as b,In as c,$e as d};