// ---------- Constantes ----------
const DEFAULT_SPEED = 130; // km/h
const COEFF = {           // a + b·v + c·v²
  gasoline:{a:1.0,b:0.02 ,c:0.0003},
  diesel  :{a:0.8,b:0.018,c:0.00025},
  electric:{a:4.0,b:0.005,c:0.0002}
};
const EMISSION = {
  gasolineL:2310,  // g CO₂/L
  dieselL  :2660,  // g CO₂/L
  kWh      :35     // g CO₂/kWh (mix FR)
};

// ---------- Sélecteurs ----------
const distBtns=document.querySelectorAll('.distance-button');
const speedSlider=document.getElementById('speed-slider');
const chosenSpeed=document.getElementById('chosen-speed');

const dTime=document.getElementById('default-time');
const dCO2=document.getElementById('default-co2');
const dElec=document.getElementById('default-elec');
const dDiesel=document.getElementById('default-diesel');
const dGas=document.getElementById('default-gas');

const cTime=document.getElementById('custom-time');
const cCO2=document.getElementById('custom-co2');
const cElec=document.getElementById('custom-elec');
const cDiesel=document.getElementById('custom-diesel');
const cGas=document.getElementById('custom-gas');

let distanceKm=50;

// ---------- Helpers ----------
const pad=n=>String(n).padStart(2,'0');
const hToHMM=h=>{const m=Math.round(h*60);return `${pad(Math.floor(m/60))}h${pad(m%60)}`};
const fmt=(v,d=1,u='')=>`${v.toFixed(d)}${u}`;
const poly=(c,v)=>c.a+c.b*v+c.c*v*v;

// ---------- Calcul ----------
function compute(dist,v){
  const gasL100=poly(COEFF.gasoline,v);
  const dieselL100=poly(COEFF.diesel,v);
  const elecKWh100=poly(COEFF.electric,v);

  const gasL=gasL100*dist/100;
  const dieselL=dieselL100*dist/100;
  const elecKWh=elecKWh100*dist/100;

  return{
    tHours:dist/v,
    gasL,dieselL,elecKWh,
    co2Elec:elecKWh*EMISSION.kWh
  };
}

// ---------- Affichage ----------
function update(){
  const v=+speedSlider.value;
  chosenSpeed.textContent=`${v}\u00A0km/h`;

  const ref=compute(distanceKm,DEFAULT_SPEED);
  dTime.textContent=hToHMM(ref.tHours);
  dCO2.textContent=fmt(ref.co2Elec/1000,2,' kg');
  dElec.textContent=fmt(ref.elecKWh,1,' kWh');
  dDiesel.textContent=fmt(ref.dieselL,1,' L');
  dGas.textContent=fmt(ref.gasL,1,' L');

  const cur=compute(distanceKm,v);
  cTime.textContent=hToHMM(cur.tHours);
  cCO2.textContent=fmt(cur.co2Elec/1000,2,' kg');
  cElec.textContent=fmt(cur.elecKWh,1,' kWh');
  cDiesel.textContent=fmt(cur.dieselL,1,' L');
  cGas.textContent=fmt(cur.gasL,1,' L');
}

// ---------- Événements ----------
distBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    distBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    distanceKm=+btn.dataset.distance;
    update();
  });
});
speedSlider.addEventListener('input',update);

// ---------- Init ----------
update();
