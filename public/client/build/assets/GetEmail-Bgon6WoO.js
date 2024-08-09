import{av as T,j as o,f as B,S as e,H as M,aC as P,aZ as i,b6 as s,B as L,aO as z,h as r,bb as F,G as f,a7 as C,b7 as $}from"./index-QasZhORg.js";import{u as G}from"./useEmail-BTt9LJhb.js";import{g as O}from"./getValidChipColor-D8WVyITM.js";import"./email-D9YzLJv8.js";const A=()=>{var l,d,p,c,x,g,m,h,b,u,j,v,k,w,y;const{emailId:S}=T(),{findEmailById:E}=G(),{data:n,isLoading:I,isError:D}=E(S),a=!I&&!D,_=[{label:"De",value:(l=n==null?void 0:n[0])==null?void 0:l.from},{label:"Para",link:`/client/${(p=(d=n==null?void 0:n[0])==null?void 0:d.client)==null?void 0:p.id}`,value:`${(x=(c=n==null?void 0:n[0])==null?void 0:c.client)==null?void 0:x.name} </br> ${(g=n==null?void 0:n[0])==null?void 0:g.to}`,description:(m=n==null?void 0:n[0].client)==null?void 0:m.description,isHtml:!0},{label:"Assunto",value:(h=n==null?void 0:n[0])==null?void 0:h.subject}];return o.jsx(B,{elevation:1,children:o.jsxs(e,{sx:{marginTop:3},children:[o.jsx(M,{title:"Detalhes",description:"Dados do e-mail",icon:o.jsx(P,{})}),o.jsx(e,{sx:{paddingBottom:3},children:o.jsxs(e,{sx:{paddingInline:3,paddingTop:2},children:[o.jsx(i,{isLoading:!a,LoadingComponent:o.jsxs(e,{sx:{flexDirection:"row",alignItems:"center",gap:1},children:[o.jsx(s,{variant:"rounded",width:80,height:32}),o.jsx(s,{variant:"text",width:70})]}),LoadedComponent:o.jsxs(e,{sx:{flexDirection:"row",alignItems:"center",gap:1},children:[o.jsx(L,{children:o.jsx(z,{label:(u=(b=n==null?void 0:n[0])==null?void 0:b.status)==null?void 0:u.name,color:O((v=(j=n==null?void 0:n[0])==null?void 0:j.status)==null?void 0:v.color)})}),o.jsx(r,{variant:"p",component:"p",children:((k=n==null?void 0:n[0])==null?void 0:k.sent_at_datetime)&&o.jsx(o.Fragment,{children:F((w=n==null?void 0:n[0])==null?void 0:w.sent_at_datetime)})})]})}),o.jsx(f,{container:!0,spacing:2,children:_.map((t,H)=>o.jsx(f,{item:!0,xs:12,md:4,children:o.jsx(i,{isLoading:!a,LoadingComponent:o.jsx(s,{variant:"rounded",width:"100%",height:52}),LoadedComponent:o.jsxs(e,{children:[o.jsx(r,{variant:"p",component:"p",sx:{color:"var(--outline)",fontWeight:550},children:t.label}),t.value?o.jsxs(e,{sx:{flexDirection:"row",alignItems:"center",gap:1},children:[o.jsx(r,{variant:"p",component:"p",children:t.isHtml?t.link?o.jsx(C,{to:t.link,dangerouslySetInnerHTML:{__html:t.value}}):o.jsx("span",{dangerouslySetInnerHTML:{__html:t.value}}):t.link?o.jsx(C,{to:t.link,children:t.value}):o.jsx("span",{children:t.value})}),t.description&&o.jsx($,{fontSize:"small",title:t.description})]}):o.jsx(r,{variant:"p",component:"p",sx:{color:"var(--outline)"},children:"Sem valor"})]})})},H))}),o.jsx(L,{sx:{paddingTop:3},children:o.jsx(i,{isLoading:!a,LoadingComponent:o.jsx(s,{variant:"rounded",width:"100%",height:535}),LoadedComponent:o.jsxs(e,{children:[o.jsx(r,{variant:"p",component:"p",sx:{color:"var(--outline)",fontWeight:550,marginBottom:.5},children:"Mensagem"}),o.jsx("iframe",{title:"Mensagem do e-mail",srcDoc:`<html>
                              <head>
                                <style>
                                  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");

                                  * {
                                    box-sizing: border-box;
                                    font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", sans-serif !important;
                                  }

                                  body {
                                    margin: 0;
                                    padding: 0;
                                    overflow: auto;
                                    background-color: rgb(245, 243, 255);
                                  }

                                  ::-webkit-scrollbar-thumb {
                                    background-color: rgb(143, 141, 158);
                                    border: 6px solid transparent;
                                    border-radius: 8px;
                                    background-clip: padding-box;
                                  }

                                  ::-webkit-scrollbar {
                                    cursor: pointer !important;
                                    width: 16px;
                                    height: 16px;
                                  }

                                  ::-webkit-scrollbar-corner {
                                    background-color: transparent;
                                  }

                                  ::-moz-selection {
                                    -webkit-text-fill-color: rgb(228, 225, 230) !important;
                                    color: rgb(228, 225, 230) !important;
                                    background: rgb(88, 101, 242);
                                  }

                                  ::selection {
                                    -webkit-text-fill-color: rgb(228, 225, 230) !important;
                                    color: rgb(228, 225, 230) !important;
                                    background: rgb(88, 101, 242);
                                  }
                                </style>
                              </head>
                              <body>
                                ${((y=n==null?void 0:n[0])==null?void 0:y.html)||"<p style='margin: 16px; font-size: 13px'>Não foi possível exibir a mensagem.</p>"}
                              </body>
                             </html>`,style:{width:"100%",height:"500px",backgroundColor:"rgb(245, 243, 255)",border:"2px solid var(--elevation-level5)",borderRadius:"8px",overflow:"hidden"}})]})})})]})})]})})};export{A as default};
