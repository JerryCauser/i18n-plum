function h(s,t,e="."){if(s==null)return Array.isArray(t)?t.join(e):t;if(typeof t=="string"&&(t=t.split(e)),!Array.isArray(t)||t.length===0)return;if(t.length===1)return s.get(t[0]);let n=s.get(t[0]);for(let r=1;Boolean(n)&&r<t.length;++r)n=n.get(t[r]);return n}var u=h;function d(s,t){let e=/{{(.*?)}}/g;return s.replace(e,(n,r)=>{let i=r.trim().split(".");if(i.length===0)return"";let o=t[i[0]];if(i.length>1)for(let a=1;Boolean(o)&&a<i.length;++a)o=o[i[a]];return typeof o=="string"?o:""})}var f=d;function g(s){var e;let t=new Map;for(let n in s)if(Object.hasOwn(s,n)){let r=s[n];r!==null&&typeof r=="object"&&((e=r.constructor)==null?void 0:e.name)==="Object"?t.set(n,g(r)):t.set(n,r)}return t}var l=g;var c=class{#e;#t=new Map;#r;#n=new Map;constructor(t){this.#t=l((t==null?void 0:t.tables)??{}),this.#e=(t==null?void 0:t.locale)??"",this.#r=(t==null?void 0:t.separator)??"."}get locale(){return this.#e}has(t){return this.#t.has(t)}set(t,e){e instanceof Map?this.#t.set(t,e):this.#t.set(t,l(e))}extend(t,e){let n=this.#t.get(t);if(n==null)return this.set(t,e);e instanceof Map||(e=l(e));for(let r of e)n.set(r[0],r[1])}delete(t){return this.#t.delete(t)}setLocale(t){this.#e!==t&&(this.#e=t,this.emit("change",t))}get(t){return this.#t.get(t)}t(t,e,n){let r=this.get(n??this.#e),i=u(r,t,this.#r)??t.toString();return typeof i=="function"?i(e):f(i,e)}emit(t,e){let n=!1;for(let[r,i]of this.#n)t===i.eventName&&(setTimeout(()=>r(e),0),i.once&&this.#n.delete(r),n=!0);return n}on(t,e){return this.#n.set(e,{eventName:t,once:!1}),this}once(t,e){return this.#n.set(e,{eventName:t,once:!0}),this}off(t){return this.#n.delete(t),this}},v=c;export{c as I18n,v as default};
//# sourceMappingURL=i18n.js.map
