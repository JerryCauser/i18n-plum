"use strict";var u=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var M=Object.prototype.hasOwnProperty;var b=(i,t)=>{for(var e in t)u(i,e,{get:t[e],enumerable:!0})},x=(i,t,e,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of p(t))!M.call(i,n)&&n!==e&&u(i,n,{get:()=>t[n],enumerable:!(r=d(t,n))||r.enumerable});return i};var R=i=>x(u({},"__esModule",{value:!0}),i);var m={};b(m,{I18n:()=>a,default:()=>y});module.exports=R(m);function T(i,t,e="."){if(i==null)return Array.isArray(t)?t.join(e):t;if(typeof t=="string"&&(t=t.split(e)),!Array.isArray(t)||t.length===0)return;if(t.length===1)return i.get(t[0]);let r=i.get(t[0]);for(let n=1;Boolean(r)&&n<t.length;++n)r=r.get(t[n]);return r}var f=T;function v(i,t){let e=/{{(.*?)}}/g;return i.replace(e,(r,n)=>{let s=n.trim().split(".");if(s.length===0)return"";let o=t[s[0]];if(s.length>1)for(let c=1;Boolean(o)&&c<s.length;++c)o=o[s[c]];return typeof o=="string"?o:""})}var g=v;function h(i){var e;let t=new Map;for(let r in i)if(Object.hasOwn(i,r)){let n=i[r];n!==null&&typeof n=="object"&&((e=n.constructor)==null?void 0:e.name)==="Object"?t.set(r,h(n)):t.set(r,n)}return t}var l=h;var a=class{#e;#t=new Map;#r;#n=new Map;constructor(t){this.#t=l((t==null?void 0:t.tables)??{}),this.#e=(t==null?void 0:t.locale)??"",this.#r=(t==null?void 0:t.separator)??"."}get locale(){return this.#e}has(t){return this.#t.has(t)}set(t,e){e instanceof Map?this.#t.set(t,e):this.#t.set(t,l(e))}extend(t,e){let r=this.#t.get(t);if(r==null)return this.set(t,e);e instanceof Map||(e=l(e));for(let n of e)r.set(n[0],n[1])}delete(t){return this.#t.delete(t)}setLocale(t){this.#e!==t&&(this.#e=t,this.emit("change",t))}get(t){return this.#t.get(t)}t(t,e,r){let n=this.get(r??this.#e),s=f(n,t,this.#r)??t.toString();return typeof s=="function"?s(e):g(s,e)}emit(t,e){let r=!1;for(let[n,s]of this.#n)t===s.eventName&&(setTimeout(()=>n(e),0),s.once&&this.#n.delete(n),r=!0);return r}on(t,e){return this.#n.set(e,{eventName:t,once:!1}),this}once(t,e){return this.#n.set(e,{eventName:t,once:!0}),this}off(t){return this.#n.delete(t),this}},y=a;
//# sourceMappingURL=i18n.js.map