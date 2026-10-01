const WSP_NUMBER = "5492604222363";

// ---------- COLORES POR AGENCIA ----------
// Solo vos sabés qué color es de quién: en la página NO se muestra el nombre.
// "name" es solo una nota para vos. Cambiá el color (hex) cuando quieras,
// o agregá una línea nueva para una agencia nueva.
// En cada auto de CARS agregale  s:"id"  (ej: s:"agencia2").
// Si un auto no tiene "s", se toma como "nativa".
const SELLERS = {
  nativa:    { name:"Nativa Motors", color:"#155EEF" },
  CP3:  { name:"CP3",     color:"#F97316" },
  Videla:  { name:"Videla Automotores",     color:"#A855F7" },
  JOY:  { name:"JOY",     color:"#EF4444" },
  particular:{ name:"Particular",    color:"#111827" }
};
const sellerOf = car => SELLERS[car.s] || SELLERS.particular;

const CAR_ICON = `<path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13"/><path d="M3 13h18v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="17" r="1.4" fill="currentColor" stroke="none"/><circle cx="16.5" cy="17" r="1.4" fill="currentColor" stroke="none"/>`;

const BRAND_COLORS = {
  "Volkswagen": ["#1D4ED8","#3B82F6"], "Ford": ["#0F4C9A","#2E7BE0"], "Chevrolet": ["#B45309","#F59E0B"],
  "Fiat": ["#B91C1C","#EF4444"], "Renault": ["#CA8A04","#FACC15"], "Peugeot": ["#0E7490","#22D3EE"],
  "Toyota": ["#C2410C","#F97316"], "Honda": ["#6D28D9","#A78BFA"], "Nissan": ["#1F2937","#4B5563"],
  "Citroën": ["#0F766E","#2DD4BF"], "Jeep": ["#166534","#4ADE80"]
};

// Cuántas fotos por auto va a intentar buscar en la carpeta image/
const PHOTOS_PER_CAR = 3;

// Convierte "Volkswagen Gol" en "volkswagen-gol" para armar el nombre de archivo
function slugify(str){
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Definimos una única extensión estándar para todas las fotos del catálogo
const PHOTO_EXTENSION = "webp"; // O "jpg" si tus fotos son jpg

// Generamos la ruta directa sin depender de múltiples extensiones
function photoPath(car, index){
  // IMPORTANTE: Dejá los signos $ y las llaves {} intactas
  return `image/photo${car.id + 1}-${index + 1}.${PHOTO_EXTENSION}`;
}

// Intentamos cargar la foto una sola vez. Si falla, quitamos el <img>.
function attachPhoto(imgEl, car, index){
  imgEl.src = photoPath(car, index);
  imgEl.onerror = () => {
    imgEl.remove(); 
  };
}
const CARS = [
  {b:"Volkswagen",m:"Gol",y:2008,p:7500000,km:78000,t:"Manual",f:"Nafta",c:"Blanco"},
  {b:"Chevrolet",m:"JOY",y:2012,p:12000000,km:45000,t:"Manual",f:"Nafta",c:"Gris", s:"Videla"},
  {b:"Citroen",m:"Berlingo",y:2017,p:16000000,km:60000,t:"Automática",f:"Diésel",c:"Negro", s:"Videla"},
  {b:"Renault",m:"Oroch",y:2022,p:35000000,km:35000,t:"Automática",f:"Nafta",c:"Blanco", s:"Videla"},
  {b:"Toyota",m:"Etios",y:2019,p:23000000,km:65000,t:"Manual",f:"Nafta",c:"Rojo", s:"Videla"},
  {b:"Chevrolet",m:"Cruze",y:2021,p:21000000,km:90000,t:"Manual",f:"Nafta",c:"Gris", s:"Videla"},
  {b:"Toyota",m:"Corolla",y:2024,p:47000000,km:70000,t:"Automática",f:"Diésel",c:"Plata", s:"Videla"},
  {b:"Toyota",m:"Corolla Cross",y:2016,p:52000000,km:110000,t:"Manual",f:"Nafta",c:"Blanco", s:"Videla"},
  {b:"Toyota",m:"Hilux",y:2021,p:62000000,km:40000,t:"Manual",f:"Nafta",c:"Rojo", s:"Videla"},
  {b:"Volkswagen",m:"Amarok",y:2018,p:65000000,km:85000,t:"Automática",f:"Nafta",c:"Negro", s:"Videla"},
  {b:"Toyota",m:"Hilux SR",y:2019,p:49000000,km:95000,t:"Manual",f:"Diésel",c:"Blanco", s:"Videla"},
  {b:"Renault",m:"Kangoo",y:2023,p:22000000,km:15000,t:"Automática",f:"Nafta",c:"Gris", s:"Videla"},
  {b:"Chevrolet",m:"Cruze",y:2020,p:18000000,km:55000,t:"Manual",f:"Nafta",c:"Blanco", s:"Videla"},
  {b:"Hyundai",m:"Tucson",y:2017,p:36000000,km:60000,t:"Manual",f:"Nafta",c:"Rojo", s:"Videla"},
  {b:"Renault",m:"Oroch",y:2017,p:21000000,km:48000,t:"Automática",f:"Diésel",c:"Gris", s:"Videla"},
  {b:"Volkswagen",m:"Virtus",y:2020,p:20000000,km:20000,t:"Manual",f:"Nafta",c:"Blanco", s:"Videla"},
  {b:"Ford",m:"Focus",y:2018,p:16000000,km:88000,t:"Manual",f:"Nafta",c:"Gris", s:"Videla"},
  {b:"Ford",m:"Eco Sport",y:2020,p:18000000,km:52000,t:"Manual",f:"Nafta",c:"Negro", s:"Videla"},
  {b:"Renault",m:"Kangoo",y:2016,p:7600000,km:130000,t:"Manual",f:"Diésel",c:"Blanco"},
  {b:"Renault",m:"Logan",y:2017,p:89000000,km:100000,t:"Manual",f:"Nafta",c:"Plata"},
  {b:"Renault",m:"Captur",y:2022,p:19500000,km:25000,t:"Automática",f:"Nafta",c:"Blanco"},
  {b:"Peugeot",m:"208",y:2021,p:13600000,km:38000,t:"Manual",f:"Nafta",c:"Rojo"},
  {b:"Peugeot",m:"3008",y:2019,p:22000000,km:66000,t:"Automática",f:"Nafta",c:"Gris"},
  {b:"Peugeot",m:"Partner",y:2017,p:8700000,km:105000,t:"Manual",f:"Diésel",c:"Blanco"},
  {b:"Peugeot",m:"2008",y:2022,p:18900000,km:22000,t:"Automática",f:"Nafta",c:"Negro"},
  {b:"Peugeot",m:"408",y:2023,p:26500000,km:12000,t:"Automática",f:"Nafta",c:"Gris"},
  {b:"Toyota",m:"Corolla",y:2020,p:19800000,km:47000,t:"Automática",f:"Nafta",c:"Blanco"},
  {b:"Toyota",m:"Hilux",y:2021,p:38500000,km:55000,t:"Automática",f:"Diésel",c:"Plata"},
  {b:"Toyota",m:"Etios",y:2018,p:9700000,km:82000,t:"Manual",f:"Nafta",c:"Rojo"},
  {b:"Toyota",m:"SW4",y:2019,p:42000000,km:68000,t:"Automática",f:"Diésel",c:"Negro"},
  {b:"Honda",m:"Civic",y:2017,p:13900000,km:92000,t:"Automática",f:"Nafta",c:"Gris"},
  {b:"Honda",m:"HR-V",y:2021,p:21300000,km:34000,t:"Automática",f:"Nafta",c:"Blanco"},
  {b:"Honda",m:"Fit",y:2016,p:8100000,km:115000,t:"Manual",f:"Nafta",c:"Plata"},
  {b:"Nissan",m:"Versa",y:2020,p:12400000,km:44000,t:"Manual",f:"Nafta",c:"Blanco"},
  {b:"Nissan",m:"Kicks",y:2022,p:18600000,km:26000,t:"Automática",f:"Nafta",c:"Gris"},
  {b:"Nissan",m:"Frontier",y:2019,p:28900000,km:72000,t:"Automática",f:"Diésel",c:"Negro"},
  {b:"Citroën",m:"C3",y:2018,p:8800000,km:96000,t:"Manual",f:"Nafta",c:"Rojo"},
  {b:"Jeep",m:"Renegade",y:2021,p:20500000,km:41000,t:"Automática",f:"Nafta",c:"Blanco"},
  {b:"Toyota",m:"Yaris",y:2020,p:15000000,km:50000,t:"Manual",f:"Nafta",c:"Gris", s:"CP3"},
  {b:"Ford",m:"Fiesta",y:2018,p:9000000,km:80000,t:"Manual",f:"Nafta",c:"Blanco", s:"Videla"},
  {b:"Fiat",m:"Palio",y:2017,p:7500000,km:95000,t:"Manual",f:"Nafta",c:"Rojo", s:"JOY"},
  {b:"Renault",m:"Clio",y:2016,p:6800000,km:120000,t:"Manual",f:"Nafta",c:"Plata", s:"particular"}
].map((car,i)=>({...car, id:i, s:car.s || "nativa", slug:slugify(car.b + "-" + car.m)}));

const fmtPrice = n => "u$s " + n.toLocaleString("es-AR");
const fmtKm = n => n.toLocaleString("es-AR") + " km";

function thumbGradient(brand, variant){
  const [c1,c2] = BRAND_COLORS[brand] || ["#155EEF","#0EA855"];
  const angle = 135 + variant*35;
  return `linear-gradient(${angle}deg, ${c1}3d, ${c2}55)`;
}

function carCard(car){
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div class="thumb" style="background:${thumbGradient(car.b,0)}">
      <span class="seller-dot" style="background:${sellerOf(car).color}" ></span>
      <span class="tag">${car.y}</span>
      <span class="pics"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5.5-5-4 4-2-2L3 18"/></svg>${PHOTOS_PER_CAR}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="${(BRAND_COLORS[car.b]||['#1D4ED8'])[0]}" stroke-width="1.4">${CAR_ICON}</svg>
    </div>
    <div class="card-body">
      <h3>${car.b} ${car.m}</h3>
      <div class="card-specs">
        <span>${car.y}</span><span>·</span><span>${fmtKm(car.km)}</span><span>·</span><span>${car.t}</span>
      </div>
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
  attachPhoto(thumbImg, car, 0);
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

const brands = [...new Set(CARS.map(c=>c.b))].sort();
brands.forEach(b=>{
  const o = document.createElement("option"); o.value=b; o.textContent=b; fMarca.appendChild(o);
});
document.getElementById("statTotal").textContent = CARS.length;
document.getElementById("statMarcas").textContent = brands.length;
document.getElementById("countTotal").textContent = CARS.length;

function applyFilters(){
  const q = qInput.value.trim().toLowerCase();
  const marca = fMarca.value;
  const rango = fPrecio.value;
  const orden = fOrden.value;

  let result = CARS.filter(car=>{
    const text = (car.b + " " + car.m).toLowerCase();
    if (q && !text.includes(q)) return false;
    if (marca && car.b !== marca) return false;
    if (rango){
      const [min,max] = rango.split("-").map(Number);
      if (car.p < min || car.p > max) return false;
    }
    return true;
  });

  if (orden === "precio-asc") result.sort((a,b)=>a.p-b.p);
  else if (orden === "precio-desc") result.sort((a,b)=>b.p-a.p);
  else if (orden === "anio-desc") result.sort((a,b)=>b.y-a.y);
  else if (orden === "km-asc") result.sort((a,b)=>a.km-b.km);

  grid.innerHTML = "";
  result.forEach(car=>grid.appendChild(carCard(car)));
  emptyMsg.classList.toggle("show", result.length===0);
  document.getElementById("countShown").textContent = result.length;
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
  for(let i=0;i<PHOTOS_PER_CAR;i++){
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
  svg.innerHTML = CAR_ICON;
  modalGallery.insertBefore(svg, modalGallery.querySelector(".navbtn.prev"));

  const img = document.createElement("img");
  img.className = "car-photo";
  img.alt = `${car.b} ${car.m}`;
  modalGallery.insertBefore(img, modalGallery.querySelector(".navbtn.prev"));
  attachPhoto(img, car, galIndex);

  [...galDots.children].forEach((d,i)=>d.classList.toggle("active", i===galIndex));
}
document.getElementById("galPrev").addEventListener("click",(e)=>{ e.stopPropagation(); galIndex=(galIndex+PHOTOS_PER_CAR-1)%PHOTOS_PER_CAR; paintGallery(currentCar); });
document.getElementById("galNext").addEventListener("click",(e)=>{ e.stopPropagation(); galIndex=(galIndex+1)%PHOTOS_PER_CAR; paintGallery(currentCar); });

function openModal(car){
  currentCar = car;
  renderGallery(car);
  document.getElementById("mTitle").textContent = `${car.b} ${car.m} ${car.y}`;
  document.getElementById("mPrice").textContent = fmtPrice(car.p);
  const sel = sellerOf(car);
  document.getElementById("mDot").style.background = sel.color;
  document.getElementById("mSpecs").innerHTML = `
    <div><div class="k">Año</div><div class="v">${car.y}</div></div>
    <div><div class="k">Kilometraje</div><div class="v">${fmtKm(car.km)}</div></div>
    <div><div class="k">Transmisión</div><div class="v">${car.t}</div></div>
    <div><div class="k">Combustible</div><div class="v">${car.f}</div></div>
    <div><div class="k">Color</div><div class="v">${car.c}</div></div>
    <div><div class="k">Ubicación</div><div class="v">San Rafael, Mendoza</div></div>
  `;
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
const wspGeneric = `https://wa.me/${WSP_NUMBER}?text=${encodeURIComponent("Hola! Quiero consultar por un auto en Automotores San Rafael.")}`;
["headWsp","footWsp","fabWsp"].forEach(id=>document.getElementById(id).href = wspGeneric);

applyFilters();
