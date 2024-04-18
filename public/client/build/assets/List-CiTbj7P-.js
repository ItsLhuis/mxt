function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/InvoiceList-COaSlNq8.js","assets/index-DNy6QDGs.js","assets/index-DiOH6u43.css","assets/DatePicker-MdWXEW69.js","assets/date-BgPJbC9K.js","assets/Grid-CL6tZxkm.js","assets/getStringColor-DpL2ucBp.js","assets/currency-DMbMY7YD.js","assets/phone-DsGwG79k.js","assets/Tabs-C-ZXadPY.js","assets/MoreVert-CF3NCxjy.js","assets/InvoiceStatus-Bo527OyG.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{r as t,_ as i,a as e,j as a,P as o,m as r,B as n,H as c}from"./index-DNy6QDGs.js";import{C as m}from"./Container-D_8oVAGC.js";import{A as d}from"./Add-ftblxsnX.js";const l=t.lazy(()=>i(()=>import("./InvoiceList-COaSlNq8.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]))),x=t.lazy(()=>i(()=>import("./InvoiceStatus-Bo527OyG.js"),__vite__mapDeps([11,1,2,7]))),j=()=>{const s=e();return a.jsx(t.Suspense,{fallback:a.jsx(o,{}),children:a.jsx(r.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.2},children:a.jsx(n,{component:"main",className:"page-main",children:a.jsxs(m,{maxWidth:!1,children:[a.jsx(c,{title:"Lista de Faturas",breadcrumbs:[{name:"Faturação"},{name:"Lista"}],button:{startIcon:a.jsx(d,{fontSize:"large"}),title:"Criar Fatura",onClick:()=>s("/invoice/add")}}),a.jsx(x,{}),a.jsx(l,{})]})})})})};export{j as default};
