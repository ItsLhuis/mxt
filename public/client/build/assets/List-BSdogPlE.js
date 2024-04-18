function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/ClientList-BxiQQxeF.js","assets/index-DNy6QDGs.js","assets/index-DiOH6u43.css","assets/useQuery-Br4JvHq1.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{r as t,_ as i,a as s,j as a,P as n,m as o,B as r,H as l}from"./index-DNy6QDGs.js";import{C as d}from"./Container-D_8oVAGC.js";import{A as m}from"./Add-ftblxsnX.js";const c=t.lazy(()=>i(()=>import("./ClientList-BxiQQxeF.js"),__vite__mapDeps([0,1,2,3]))),u=()=>{const e=s();return a.jsx(t.Suspense,{fallback:a.jsx(n,{}),children:a.jsx(o.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.2},children:a.jsx(r,{component:"main",className:"page-main",children:a.jsxs(d,{maxWidth:!1,children:[a.jsx(l,{title:"Lista de Clientes",breadcrumbs:[{name:"Cliente"},{name:"Lista"}],button:{startIcon:a.jsx(m,{fontSize:"large"}),title:"Adicionar Cliente",onClick:()=>e("/client/add")}}),a.jsx(c,{})]})})})})};export{u as default};
