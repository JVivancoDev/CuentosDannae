(() => {
"use strict";
const CATS=[{id:"todos",n:"🌈 Todos"},{id:"fav",n:"❤️ Favoritos"},{id:"clasicos",n:"📚 Cuentos clásicos"},{id:"animales",n:"🐻 Animales"},{id:"fantasia",n:"🧚 Fantasía y magia"},{id:"aventuras",n:"🌳 Aventuras"},{id:"dormir",n:"🌙 Cuentos para dormir"},{id:"amistad",n:"❤️ Amistad y emociones"},{id:"exploracion",n:"🚀 Exploración y descubrimientos"}];
const $=id=>document.getElementById(id);
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let favs=store.get("cm_favs",[]),prefs=store.get("cm_prefs",{letra:1.25,noche:false}),cat="todos",q="",actual=null;
const cuentos=window.CUENTOS||[];
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const nombreCat=c=>(CATS.find(x=>x.id===c)||{n:""}).n;

function tarjeta(c){
 const el=document.createElement("article");el.className="tarjeta";
 const cu=document.createElement("div");cu.className="cubierta";cu.style.background=`linear-gradient(135deg,${c.colores[0]},${c.colores[1]})`;cu.textContent=c.emoji;
 if(favs.includes(c.id)){const h=document.createElement("span");h.className="corazon";h.textContent="❤️";cu.appendChild(h)}
 const cp=document.createElement("div");cp.className="cuerpo";
 const t=document.createElement("h3");t.textContent=c.titulo;
 const d=document.createElement("p");d.textContent=c.descripcion;
 const m=document.createElement("span");m.className="meta";m.textContent=`⏱ ${c.minutos} min · ${nombreCat(c.categorias[0])}`;
 const b=document.createElement("button");b.className="btn leer";b.textContent="📖 Leer cuento";b.onclick=()=>{location.hash="#/"+c.id};
 cp.append(t,d,m,b);el.append(cu,cp);return el;
}
function filtrar(){
 return cuentos.filter(c=>(cat==="todos"||(cat==="fav"?favs.includes(c.id):c.categorias.includes(cat)))&&norm(c.titulo).includes(norm(q)));
}
function pintar(){
 const lista=filtrar();$("cuadricula").replaceChildren(...lista.map(tarjeta));
 $("titulo-lista").textContent=cat==="todos"?"Todos los cuentos":nombreCat(cat);
 const v=$("vacio");v.hidden=lista.length>0;
 v.textContent=cat==="fav"&&!q?"Aún no tienes favoritos. Toca el 🤍 dentro de un cuento para guardarlo.":"No encontramos cuentos aquí todavía. ¡Pronto habrá más!";
 const des=cuentos.filter(c=>c.destacado);$("seccion-destacados").hidden=!des.length||cat!=="todos"||!!q;
 $("destacados").replaceChildren(...des.map(tarjeta));
 document.querySelectorAll(".chip").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.id===cat)));
}
function filtros(){
 $("filtros").replaceChildren(...CATS.map(c=>{const b=document.createElement("button");b.className="chip";b.dataset.id=c.id;b.textContent=c.n;b.onclick=()=>{cat=c.id;pintar()};return b}));
}
function aplicarPrefs(){
 document.body.classList.toggle("noche",!!prefs.noche);
 document.documentElement.style.setProperty("--letra",prefs.letra+"rem");
 $("noche").textContent=prefs.noche?"☀️":"🌙";
 store.set("cm_prefs",prefs);
}
function pintarFav(){const f=actual&&favs.includes(actual.id);$("fav").textContent=f?"❤️":"🤍";$("fav").setAttribute("aria-pressed",String(!!f))}
function progreso(){
 const h=document.documentElement,max=h.scrollHeight-h.clientHeight;
 $("barra").style.width=(max>0?Math.min(100,h.scrollTop/max*100):100)+"%";
}
function abrir(c){
 actual=c;$("biblioteca").hidden=true;$("lector").hidden=false;
 const p=$("portada");p.style.background=`linear-gradient(135deg,${c.colores[0]},${c.colores[1]})`;p.textContent=c.emoji;
 $("lector-titulo").textContent=c.titulo;
 $("lector-texto").replaceChildren(...c.texto.map(t=>{const e=document.createElement("p");e.textContent=t;return e}));
 pintarFav();window.scrollTo(0,0);progreso();
}
function ruta(){
 const id=location.hash.replace("#/","");const c=cuentos.find(x=>x.id===id);
 if(c)abrir(c);else{actual=null;$("lector").hidden=true;$("biblioteca").hidden=false;pintar()}
}
$("volver").onclick=()=>{location.hash=""};
$("mas").onclick=()=>{prefs.letra=Math.min(2,+(prefs.letra+.15).toFixed(2));aplicarPrefs();progreso()};
$("menos").onclick=()=>{prefs.letra=Math.max(1,+(prefs.letra-.15).toFixed(2));aplicarPrefs();progreso()};
$("noche").onclick=()=>{prefs.noche=!prefs.noche;aplicarPrefs()};
$("fav").onclick=()=>{if(!actual)return;favs=favs.includes(actual.id)?favs.filter(x=>x!==actual.id):[...favs,actual.id];store.set("cm_favs",favs);pintarFav()};
$("buscador").oninput=e=>{q=e.target.value.trim();pintar()};
window.addEventListener("scroll",progreso,{passive:true});
window.addEventListener("hashchange",ruta);
filtros();aplicarPrefs();ruta();
})();
