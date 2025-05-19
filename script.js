// ---------- Constantes ----------
const DEFAULT_SPEED = 130; // km/h (référence)

// Coefficients quadratiques (a + b·v + c·v²)
const COEFF = {
  gasoline: { a: 1.0, b: 0.02,  c: 0.0003 },   // L/100 km
  diesel  : { a: 0.8, b: 0.018, c: 0.00025 },  // L/100 km
  electric: { a: 4.0, b: 0.005, c: 0.0002 }    // kWh/100 km
};

// Facteurs d'émission (g CO₂ par unité)
const EMISSION = {
  gasolineL: 2310,  // g CO₂ / litre
  dieselL  : 2660,  // g CO₂ / litre
  kWh      : 35     // g CO₂ / kWh (mix France)
};

// ---------- Sélecteurs ----------
const distBtns       = document.querySelectorAll('.distance-button');
const speedSlider    = document.getElementById('speed-slider');
const chosenSpeedLbl = document.getElementById('chosen-speed');

// Référence
const dTime   = document.getElementById('default-time');
const dCO2    = document.getElementById('default-co2');
const dElec   = document.getElementById('default-elec');
const dDiesel = document.getElementById('default-diesel');
const dGas    = document.getElementById('default-gas');
// Perso
const cTime   = document.getElementById('custom-time');
const cCO2    = document.getElementById('custom-co2');
const cElec   = document.getElementById('custom-elec');
const cDiesel = document.getElementById('custom-diesel');
const cGas    = document.getElementById('custom-gas');

let distanceKm = 50;

// ---------- Helpers ----------
const pad = n => String(n).padStart(2,'0');
const hToHMM = h => {
  const mTot = Math.round(h*60);
  return `${pad(Math.floor(mTot/60))}h${pad(mTot%60)}`;
};
const fmt = (v,d=1,u='') => `${v.toFixed(d)}${u}`;

// ---------- Formules ----------
function poly({a,b,c}, v){ return a + b*v + c*v*v; }

function compute(dist, v){
  // Consommations spécifiques
  const gasL100   = poly(COEFF.gasoline, v);
  const dieselL100= poly(COEFF.diesel,   v);
  const elecKWh100= poly(COEFF.electric, v);

  // Pour la distance
  const gasL   = gasL100   * dist / 100;
  const dieselL= dieselL100* dist / 100;
  const elecKWh= elecKWh100* dist / 100;

  // Émissions pour l'électrique (seule valeur affichée)
  const co2Elec = elecKWh * EMISSION.kWh;

  return {
    tHours : dist / v,
    gasL, dieselL, elecKWh,
    co2Elec
  };
}

// ---------- Affichage ----------
function update(){
  const v = +speedSlider.value;
  chosenSpeedLbl.textContent = `${v}\u00A0km/h`;

  const ref = compute(distanceKm, DEFAULT_SPEED);
  dTime.textContent   = hToHMM(ref.tHours);
  dCO2.textContent    = fmt(ref.co2Elec/1000,2,' kg');
  dElec.textContent   = fmt(ref.elecKWh,1,' kWh');
  dDiesel.textContent = fmt(ref.dieselL,1,' L');
  dGas.textContent    = fmt(ref.gasL,1,' L');

  const cur = compute(distanceKm, v);
  cTime.textContent   = hToHMM(cur.tHours);
  cCO2.textContent    = fmt(cur.co2Elec/1000,2,' kg');
  cElec.textContent   = fmt(cur.elecKWh,1,' kWh');
  cDiesel.textContent = fmt(cur.dieselL,1,' L');
  cGas.textContent    = fmt(cur.gasL,1,' L');
}

// ---------- Événements ----------
.distBtns = Array.from(distBtns);

rate
