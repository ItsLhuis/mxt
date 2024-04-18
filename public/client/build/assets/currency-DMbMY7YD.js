const s=o=>{const e=parseFloat(o).toFixed(2).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g," ");return e.endsWith(",00")?e.slice(0,-3)+" €":e+" €"};export{s as f};
