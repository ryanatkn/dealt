import{a as h,t as R,b as T,h as W}from"../chunks/disclose-version.Ds06f9Vu.js";import{o as G,q as J,c as s,s as n,r as a,n as K,$ as N}from"../chunks/runtime.5k9ShzZt.js";import{d as O}from"../chunks/render.CAjsxhF5.js";import{i as S}from"../chunks/props.lofZ2jro.js";import{c as Q,e as V,E as X,p as Y,R as Z,r as ee,b as B}from"../chunks/renderer_components.DC7U4vDT.js";import{o as te}from"../chunks/index-client.Ce0wy-IS.js";import{B as se}from"../chunks/Breadcrumb.1UZR-o_1.js";import{a as ae,A as ne,D as oe}from"../chunks/Dealt.BO2ibptY.js";import{a as re,b as ie,S as de,F as ce,H as _e}from"../chunks/Help_Button.DjgFcgX7.js";import{R as le}from"../chunks/Renderer_Controls.xj11Gv3W.js";import{a as ve,U as pe}from"../chunks/Unit_List_And_Layers.CxdIw5aK.js";import{s as ue}from"../chunks/scene_data.CGVQbHOh.js";const b={id:7464772085109328,name:"sandbox demo",glyph:"?",units:[{id:0x793c6d633a6330,name:"player",type:"circle",x:409,y:302,rotation:.2,strength:20,behaviors:[{name:"Player_Controller_Behavior"}]},...ue.units.slice(1)]};var me=R('<div class="sidebar svelte-zsua3"><div class="topbar svelte-zsua3"><div class="row justify_content_space_between"><!> <button type="button" class="plain" title="toggle editor [` Backtick]">✕</button></div> <div class="py_xs flex"><!> <!></div> <div class="row gap_md"><!> <!></div>  <div class="row mt_xs"><!></div></div> <div class="unit_controls svelte-zsua3"><div class="unit_controls_inner svelte-zsua3"><!></div></div></div>'),ge=R('<div class="sandbox_demo svelte-zsua3"><div class="renderer relative svelte-zsua3"><!> <!></div> <!></div>');function fe(_,x){J(x,!0);const o=new Z(ee,"pixi",0,0),l=ae.set(new ne({renderer:o}));Q.set(l.clock),globalThis.app=l;const e=V.set(new X({app:l})),{project:c}=e;c.set_json(Y({scenes:[b]})),console.log("scene_json",b);const{scene:r}=c;r.set_json(b),r.json_initial=r.json,te(()=>{const v=e.playing;return e.playing=!0,()=>{e.playing=v}}),oe(_,{children:(v,he)=>{var p=ge(),i=s(p),y=s(i);re(y,{get Component(){return o.Component},scene:r,renderer:o});var D=n(y,2);{var A=t=>{ie(t,{scene:r,get unit_selection(){return e.unit_selection},get width(){return o.width},get height(){return o.height},get scene_interaction_surface_state(){return e.scene_interaction_surface_state},set scene_interaction_surface_state(d){e.scene_interaction_surface_state=d}})};S(D,t=>{e.editing&&t(A)})}a(i);var H=n(i,2);{var L=t=>{var d=me(),u=s(d),m=s(u),$=s(m);se($,{children:(q,be)=>{K();var M=T("🔮");h(q,M)},$$slots:{default:!0}});var P=n($,2);P.__click=()=>{e.editing=!e.editing},a(m);var g=n(m,2),w=s(g);de(w,{project:c});var U=n(w,2);ce(U,{}),a(g);var f=n(g,2),j=s(f);le(j,{renderer:o,omit_size:!0,row:!0});var E=n(j,2);_e(E,{}),a(f);var z=n(f,2),F=s(z);ve(F,{editor:e}),a(z),a(u);var k=n(u,2),C=s(k),I=s(C);pe(I,{project:c}),a(C),a(k),a(d),h(t,d)};S(H,t=>{e.editing&&t(L)})}a(p),B(i,"clientWidth",t=>o.width=t),B(i,"clientHeight",t=>o.height=t),h(v,p)},$$slots:{default:!0}}),G()}O(["click"]);function Ae(_){W(x=>{N.title="Dealt: sandbox demo"}),fe(_,{})}export{Ae as component};
