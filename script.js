const WSP_NUMBER = "5492604222363";

// ---------- COLORES POR AGENCIA ----------
// Solo vos sabés qué color es de quién: en la página NO se muestra el nombre.
const SELLERS = {
  nativa:       { name:"Ruta Cero",           color:"#155EEF" },
  NativaMotors: { name:"Nativa Motors",       color:"#16A34A" },
  JA:           { name:"JA Automotores",      color:"#14B8A6" },
  Rodando:      { name:"Rodando Automotores", color:"#EAB308" },
  Genesis:      { name:"Genesis Automotores", color:"#EC4899" },
  CP3:          { name:"CP3",                 color:"#F97316" },
  Videla:       { name:"Videla Automotores",  color:"#A855F7" },
  Rosseti:      { name:"Rosseti",             color:"#EF4444" },
  particular:   { name:"Particular",          color:"#111827" }
};
const sellerOf = car => SELLERS[car.s] || SELLERS.particular;

// ---------- CATEGORÍAS ----------
// En cada vehículo de CARS agregale  cat:"motos" | "agricolas" | "autoelevadores" | "lanchas"
// Si no tiene "cat", se toma como "autos".
// "0km" no es una categoría que se carga: aparece sola con todo lo que tenga km:0 (o hs:0).
// Para máquinas y lanchas podés usar  hs:1200  (horas de uso) en vez de km.
const CATEGORIES = [
  { id:"todos",          label:"Todos" },
  { id:"autos",          label:"Autos" },
  { id:"0km",            label:"0 km" },
  { id:"motos",          label:"Motos" },
  { id:"agricolas",      label:"Máquinas agrícolas" },
  { id:"autoelevadores", label:"Autoelevadores" },
  { id:"lanchas",        label:"Lanchas" }
];
const isZero = car => car.km === 0 || car.hs === 0;
const inCat = (car, cat) => cat === "todos" ? true : cat === "0km" ? isZero(car) : car.cat === cat;

// Íconos por categoría
const CAR_ICON = `<path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13"/><path d="M3 13h18v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="17" r="1.4" fill="currentColor" stroke="none"/><circle cx="16.5" cy="17" r="1.4" fill="currentColor" stroke="none"/>`;
const ICONS = {
  autos: CAR_ICON,
  motos: `<circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M5.5 16.5L9 9h4l3 4.5 2.5 3M13 9l1.5-2H17M9 9H7"/>`,
  agricolas: `<circle cx="7" cy="16" r="3.5"/><circle cx="18" cy="17.5" r="2"/><path d="M10.5 16H16M4 12V7h6l2 5h6v3.5M10 12V7"/>`,
  autoelevadores: `<path d="M4 18V8h6l2 6v4M4 12h8"/><circle cx="6" cy="19" r="1.5"/><circle cx="12" cy="19" r="1.5"/><path d="M17 4v15M17 17h4"/>`,
  lanchas: `<path d="M3 15h18l-2.5 4h-13z"/><path d="M12 3v12M12 4l6 8h-6M12 7l-4 5h4"/>`
};
const iconOf = car => ICONS[car.cat] || CAR_ICON;

const BRAND_COLORS = {
  "Volkswagen": ["#1D4ED8","#3B82F6"], "Ford": ["#0F4C9A","#2E7BE0"], "Chevrolet": ["#B45309","#F59E0B"],
  "Fiat": ["#B91C1C","#EF4444"], "Renault": ["#CA8A04","#FACC15"], "Peugeot": ["#0E7490","#22D3EE"],
  "Toyota": ["#C2410C","#F97316"], "Honda": ["#6D28D9","#A78BFA"], "Nissan": ["#1F2937","#4B5563"],
  "Citroën": ["#0F766E","#2DD4BF"], "Jeep": ["#166534","#4ADE80"],
  "Yamaha": ["#1D4ED8","#60A5FA"], "Zanella": ["#B91C1C","#F87171"], "John Deere": ["#166534","#4ADE80"],
  "Massey Ferguson": ["#B91C1C","#F87171"], "Hyster": ["#CA8A04","#FACC15"], "Quicksilver": ["#0E7490","#22D3EE"]
};

const PHOTOS_PER_CAR = 3;

function slugify(str){
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const PHOTO_EXTENSION = "webp";

// Cada categoría tiene su propia carpeta y su propia numeración (car.n = posición dentro de su categoría):
//   autos          -> image/photo1-1.webp            (igual que antes)
//   motos          -> image/motos/photo1-1.webp
//   agricolas      -> image/agricolas/photo1-1.webp
//   autoelevadores -> image/autoelevadores/photo1-1.webp
//   lanchas        -> image/lanchas/photo1-1.webp
// Opcional: si el vehículo tiene  ph:"xr150"  usa ese nombre en vez de "photoN" (ej: image/motos/xr150-1.webp)
function photoPath(car, index){
  const folder = car.cat === "autos" ? "image" : `image/${car.cat}`;
  const base = car.ph || `photo${car.n}`;
  return `${folder}/${base}-${index + 1}.${PHOTO_EXTENSION}`;
}

// Fotos de vehículos cargados desde el panel (car.photos = lista de URLs de Cloudinary)
const photoCount = car => car.photos ? Math.max(car.photos.length, 1) : PHOTOS_PER_CAR;
const cld = (url, w) => url.includes("res.cloudinary.com") ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${w}/`) : url;

function attachPhoto(imgEl, car, index, w = 1100){
  if (car.photos){
    if (!car.photos[index]) { imgEl.remove(); return; }
    imgEl.src = cld(car.photos[index], w);
  } else {
    imgEl.src = photoPath(car, index);
  }
  imgEl.onerror = () => { imgEl.remove(); };
}

const CARS = [
  // Los vehículos ahora se cargan desde el panel (admin.html)
].map((() => {
  const counters = {}; // cuenta cuántos vehículos van en cada categoría
  return (car, i) => {
    const cat = car.cat || "autos";
    counters[cat] = (counters[cat] || 0) + 1;
    return {...car, id:i, cat, n:counters[cat], s:car.s || "nativa", slug:slugify(car.b + "-" + car.m)};
  };
})());

// ---------- ORDEN ALEATORIO ----------
// Cada vez que se entra a la página se arma un orden nuevo, mezclando agencias y particulares
// (se va turnando entre vendedores para que no salgan todos los de una misma agencia juntos).
// Se calcula UNA sola vez al cargar, así las tarjetas no saltan mientras se usan los filtros.
function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function mixedOrder(list){
  const groups = {};
  list.forEach(c => (groups[c.s] = groups[c.s] || []).push(c));
  Object.values(groups).forEach(shuffle);
  const keys = shuffle(Object.keys(groups));
  const out = [];
  let left = true;
  while (left){
    left = false;
    keys.forEach(k => { if (groups[k].length){ out.push(groups[k].shift()); left = true; } });
  }
  return out;
}
const RANK = new Map();
mixedOrder(CARS).forEach((c, i) => RANK.set(c.id, i));

const fmtPrice = n => "u$s " + n.toLocaleString("es-AR");
const fmtKm = n => n.toLocaleString("es-AR") + " km";
// Muestra km o horas según corresponda
const fmtUse = car => car.hs !== undefined ? car.hs.toLocaleString("es-AR") + " hs" : fmtKm(car.km);

function thumbGradient(brand, variant){
  const [c1,c2] = BRAND_COLORS[brand] || ["#155EEF","#0EA855"];
  const angle = 135 + variant*35;
  return `linear-gradient(${angle}deg, ${c1}3d, ${c2}55)`;
}

function carCard(car){
  const el = document.createElement("div");
  el.className = "card";
  const specs = [car.y, fmtUse(car), car.t].filter(Boolean);
  el.innerHTML = `
    <div class="thumb" style="background:${thumbGradient(car.b,0)}">
      <span class="seller-dot" style="background:${sellerOf(car).color}" ></span>
      <span class="tag">${car.y}</span>
      <span class="pics"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5.5-5-4 4-2-2L3 18"/></svg>${photoCount(car)}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="${(BRAND_COLORS[car.b]||['#1D4ED8'])[0]}" stroke-width="1.4">${iconOf(car)}</svg>
    </div>
    <div class="card-body">
      <h3>${car.b} ${car.m}</h3>
      <div class="card-specs">${specs.map(s=>`<span>${s}</span>`).join("<span>·</span>")}</div>
      <div class="card-price">
        <b>${fmtPrice(car.p)}</b>
        <span class="see">Ver detalles →</span>
      </div>
    </div>
  `;
  const thumbImg = document.createElement("img");
  thumbImg.alt = `${car.b} ${car.m}`;
  thumbImg.loading = "lazy";
  el.querySelector(".thumb").appendChild(thumbImg);
  attachPhoto(thumbImg, car, 0, 600);
  el.addEventListener("click", ()=>openModal(car));
  return el;
}

const grid = document.getElementById("grid");
const emptyMsg = document.getElementById("emptyMsg");
const qInput = document.getElementById("q");
const fMarca = document.getElementById("fMarca");
const fPrecio = document.getElementById("fPrecio");
const fOrden = document.getElementById("fOrden");
const clearBtn = document.getElementById("clearBtn");
const catsEl = document.getElementById("cats");
let currentCat = "todos";

// Marcas según la categoría elegida
function buildBrands(){
  const pool = CARS.filter(c => inCat(c, currentCat));
  const brands = [...new Set(pool.map(c=>c.b))].sort();
  fMarca.innerHTML = '<option value="">Todas las marcas</option>';
  brands.forEach(b=>{
    const o = document.createElement("option"); o.value=b; o.textContent=b; fMarca.appendChild(o);
  });
}

// Botones de categorías con cantidad
function renderCats(){
  catsEl.innerHTML = "";
  CATEGORIES.forEach(cat=>{
    const n = CARS.filter(c => inCat(c, cat.id)).length;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cat-btn" + (cat.id === currentCat ? " active" : "");
    btn.innerHTML = `${cat.label} <span>${n}</span>`;
    btn.addEventListener("click", ()=>{
      currentCat = cat.id;
      fMarca.value = "";
      buildBrands();
      renderCats();
      applyFilters();
    });
    catsEl.appendChild(btn);
  });
}

function updateStats(){
  document.getElementById("statTotal").textContent = CARS.length;
  document.getElementById("statMarcas").textContent = new Set(CARS.map(c=>c.b)).size;
}
updateStats();

function applyFilters(){
  const q = qInput.value.trim().toLowerCase();
  const marca = fMarca.value;
  const rango = fPrecio.value;
  const orden = fOrden.value;
  const pool = CARS.filter(c => inCat(c, currentCat));

  let result = pool.filter(car=>{
    const text = (car.b + " " + car.m).toLowerCase();
    if (q && !text.includes(q)) return false;
    if (marca && car.b !== marca) return false;
    if (rango){
      const [min,max] = rango.split("-").map(Number);
      if (car.p < min || car.p > max) return false;
    }
    return true;
  });

  const use = c => c.hs !== undefined ? c.hs : c.km;
  if (!orden) result.sort((a,b)=>RANK.get(a.id)-RANK.get(b.id));
  else if (orden === "precio-asc") result.sort((a,b)=>a.p-b.p);
  else if (orden === "precio-desc") result.sort((a,b)=>b.p-a.p);
  else if (orden === "anio-desc") result.sort((a,b)=>b.y-a.y);
  else if (orden === "km-asc") result.sort((a,b)=>use(a)-use(b));

  grid.innerHTML = "";
  result.forEach(car=>grid.appendChild(carCard(car)));
  emptyMsg.classList.toggle("show", result.length===0);
  document.getElementById("countShown").textContent = result.length;
  document.getElementById("countTotal").textContent = pool.length;
}

[qInput].forEach(el=>el.addEventListener("input", applyFilters));
[fMarca,fPrecio,fOrden].forEach(el=>el.addEventListener("change", applyFilters));
clearBtn.addEventListener("click", ()=>{
  qInput.value=""; fMarca.value=""; fPrecio.value=""; fOrden.value="";
  applyFilters();
});

/* ---------- Modal ---------- */
const overlay = document.getElementById("overlay");
const modalGallery = document.getElementById("modalGallery");
const galDots = document.getElementById("galDots");
let galIndex = 0;
let currentCar = null;

function renderGallery(car){
  galIndex = 0;
  galDots.innerHTML = "";
  for(let i=0;i<photoCount(car);i++){
    const d = document.createElement("span"); if(i===0) d.className="active";
    galDots.appendChild(d);
  }
  paintGallery(car);
}
function paintGallery(car){
  modalGallery.style.background = thumbGradient(car.b, galIndex);

  const existingSvg = modalGallery.querySelector(".car-svg");
  if (existingSvg) existingSvg.remove();
  const existingImg = modalGallery.querySelector(".car-photo");
  if (existingImg) existingImg.remove();

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS,"svg");
  svg.setAttribute("viewBox","0 0 24 24"); svg.setAttribute("fill","none");
  svg.setAttribute("stroke",(BRAND_COLORS[car.b]||["#1D4ED8"])[0]); svg.setAttribute("stroke-width","1.3");
  svg.classList.add("car-svg");
  svg.innerHTML = iconOf(car);
  modalGallery.insertBefore(svg, modalGallery.querySelector(".navbtn.prev"));

  const img = document.createElement("img");
  img.className = "car-photo";
  img.alt = `${car.b} ${car.m}`;
  modalGallery.insertBefore(img, modalGallery.querySelector(".navbtn.prev"));
  attachPhoto(img, car, galIndex);

  [...galDots.children].forEach((d,i)=>d.classList.toggle("active", i===galIndex));
}
document.getElementById("galPrev").addEventListener("click",(e)=>{ e.stopPropagation(); galIndex=(galIndex+photoCount(currentCar)-1)%photoCount(currentCar); paintGallery(currentCar); });
document.getElementById("galNext").addEventListener("click",(e)=>{ e.stopPropagation(); galIndex=(galIndex+1)%photoCount(currentCar); paintGallery(currentCar); });

function openModal(car){
  currentCar = car;
  renderGallery(car);
  document.getElementById("mTitle").textContent = `${car.b} ${car.m} ${car.y}`;
  document.getElementById("mPrice").textContent = fmtPrice(car.p);
  const sel = sellerOf(car);
  document.getElementById("mDot").style.background = sel.color;
  const rows = [
    ["Año", car.y],
    [car.hs !== undefined ? "Horas de uso" : "Kilometraje", fmtUse(car)],
    ["Transmisión", car.t],
    ["Combustible", car.f],
    ["Color", car.c],
    ["Ubicación", "San Rafael, Mendoza"]
  ].filter(r => r[1]);
  document.getElementById("mSpecs").innerHTML = rows
    .map(r => `<div><div class="k">${r[0]}</div><div class="v">${r[1]}</div></div>`).join("");
  const msg = encodeURIComponent(`Hola! Te escribo por el ${car.b} ${car.m} ${car.y} que vi en la web de Automotores San Rafael.`);
  document.getElementById("mCta").href = `https://wa.me/${WSP_NUMBER}?text=${msg}`;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(){
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("modalClose").addEventListener("click", closeModal);
overlay.addEventListener("click", (e)=>{ if(e.target===overlay) closeModal(); });
document.addEventListener("keydown",(e)=>{ if(e.key==="Escape") closeModal(); });

/* ---------- WhatsApp links ---------- */
const wspGeneric = `https://wa.me/${WSP_NUMBER}?text=${encodeURIComponent("Hola! Quiero consultar por un vehículo en Automotores San Rafael.")}`;
["headWsp","footWsp","fabWsp"].forEach(id=>document.getElementById(id).href = wspGeneric);

buildBrands();
renderCats();
applyFilters();

/* ---------- Vehículos cargados desde el panel (Firebase) ---------- */
// Los llama cloud.js al terminar de leer la base de datos. Los marcados como vendidos no se muestran.
function addRemoteCars(list){
  list.filter(v => !v.sold).forEach(v=>{
    CARS.push({...v, cat:v.cat || "autos", s:v.s || "particular", id:CARS.length, slug:slugify(v.b + "-" + v.m)});
  });
  RANK.clear();
  mixedOrder(CARS).forEach((c, i) => RANK.set(c.id, i));
  updateStats();
  buildBrands();
  renderCats();
  applyFilters();
}
