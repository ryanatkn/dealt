import{a as f,t as g,b as q}from"./disclose-version.Ds06f9Vu.js";import{w as O,q as z,o as A,c as x,s as w,r as b,m as y,v as C,n as S,K as p}from"./runtime.5k9ShzZt.js";import{l as F,s as K}from"./render.CAjsxhF5.js";import{b as L,p as M,i as k}from"./props.lofZ2jro.js";import{e as j,i as B,t as D}from"./string.25aLtQ0-.js";import{a as E}from"./renderer_components.BBKIkb5V.js";import{c as I}from"./Help_Button.BTNV0Dwq.js";function P(e,t,r){if(e.multiple)return J(e,t);for(var a of e.options){var i=m(a);if(L(i,t)){a.selected=!0;return}}(!r||t!==void 0)&&(e.selectedIndex=-1)}function G(e,t){O(()=>{var r=new MutationObserver(()=>{var a=e.__value;P(e,a)});return r.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{r.disconnect()}})}function H(e,t,r=t){var a=!0;F(e,"change",i=>{var l=i?"[selected]":":checked",_;if(e.multiple)_=[].map.call(e.querySelectorAll(l),m);else{var h=e.querySelector(l)??e.querySelector("option:not([disabled])");_=h&&m(h)}r(_)}),O(()=>{var i=t();if(P(e,i,a),a&&i===void 0){var l=e.querySelector(":checked");l!==null&&(i=m(l),r(i))}e.__value=i,a=!1}),G(e)}function J(e,t){for(var r of e.options)r.selected=~t.indexOf(m(r))}function m(e){return"__value"in e?e.__value:e.value}var N=g("<option> </option>"),Q=g('<label class="mb_0 svelte-1hc6x3d"><div class="title svelte-1hc6x3d">renderer</div> <select class="svelte-1hc6x3d"></select></label>'),T=g("<!> <!>",1),U=g('<div class="row gap_xs"><!> <!></div>');function te(e,t){z(t,!0);const r=M(t,"renderer",7);var a=U(),i=x(a);{var l=n=>{var s=Q(),v=w(x(s),2);j(v,21,()=>E,B,(c,o)=>{var u=N(),d={},R=x(u,!0);b(u),y(()=>{d!==(d=p(o))&&(u.value=(u.__value=p(o))==null?"":p(o)),K(R,p(o))}),f(c,u)}),b(v),b(s),y(()=>D(s,"row",t.row)),H(v,()=>r().type,c=>r().type=c),f(n,s)};k(i,n=>{t.omit_type||n(l)})}var _=w(i,2);{var h=n=>{var s=T(),v=C(s);I(v,{get row(){return t.row},title:"renderer width",min:0,get value(){return r().width},set value(o){r().width=o},children:(o,u)=>{S();var d=q("width");f(o,d)},$$slots:{default:!0}});var c=w(v,2);I(c,{get row(){return t.row},title:"renderer height",min:0,get value(){return r().height},set value(o){r().height=o},children:(o,u)=>{S();var d=q("height");f(o,d)},$$slots:{default:!0}}),f(n,s)};k(_,n=>{t.omit_size||n(h)})}b(a),f(e,a),A()}export{te as R};