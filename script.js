// ---------- Constantes ----------
const DEFAULT_SPEED = 130; // km/h (référence)
const BASE_SPEED    = 100; // km/h – point de réf. pour la conso

// Conso moyennes à 100 km/h
const CONSUMPTION_BASE = {
  electricKWhPer100 : 15,   // kWh / 100 km
  dieselLPer100     : 5.5,  // L / 100 km
  gasolineLPer100   : 6.8   // L / 100 km
};

// Facteurs d’émission
const EMISSION_FACTORS = {
  co2PerKWh      : 50,   // g CO₂ / kWh
  co2PerDieselL  : 2680, // g CO₂ / L
  co2PerGasolineL: 2310  // g CO₂ / L
};

// ---------- Sélecteurs ----------
const distanceButtons   = document.querySelectorAll('.distance-button');
const speedSlider       = document.getElementById('speed-slider');
const chosenSpeedLabel  = document.getElementById('chosen-speed');

// Référence
const defaultTime       = document.getElementById('default-time');
const defaultCO2        = document.getElementById('default-co2');
const defaultElec       = document.getElementById('default-elec');
const defaultDiesel     = document.getElementById('default-diesel');
const defaultGas        = document.getElementById('default-gas');

// Personnalisé
const customTime        = document.getElementById('custom-time');
const customCO2         = document.getElementById('custom-co2');
const customElec        = document.getElementById('custom-elec');
const customDiesel      = document.getElementById('custom-diesel');
const customGas         = document.getElementById('custom-gas');

let selectedDistance = 50; // km par défaut

// ---------- Helpers ----------
const pad = n => String(n).padStart(2,'0');
const hoursToHMM = h => {
  const mTot = Math.round(h*60);
  return `${pad(Math.floor(mTot/60))}h${pad(mTot%60)}`;
};
const formatNumber = (v,d=1,u='') => `${v.toFixed(d)}${u}`;

// ---------- Modèle conso ----------
const consumptionFactor = v => (v/BASE_SPEED)**2;

function compute(distKm, speed){
  const f = consumptionFactor(speed);

  // Conso ajustée
  const elecKWh = distKm * CONSUMPTION_BASE.electricKWhPer100 * f / 100;
  const dieselL = distKm * CONSUMPTION_BASE.dieselLPer100     * f / 100;
  const gasL    = distKm * CONSUMPTION_BASE.gasolineLPer100   * f / 100;

  return {
    travelHours : distKm / speed,
    elecKWh,
    dieselL,
    gasL,
    co2Elec   : elecKWh * EMISSION_FACTORS.co2PerKWh,
    co2Diesel : dieselL * EMISSION_FACTORS.co2PerDieselL,
    co2Gas    : gasL    * EMISSION_FACTORS.co2PerGasolineL
  };
}

// ---------- Affichage ----------
function updateDisplay(){
  const v = +speedSlider.value;
  chosenSpeedLabel.textContent = `${v}\u00A0km/h`;

  // Référence
  const ref = compute(selectedDistance, DEFAULT_SPEED);
  defaultTime.textContent   = hoursToHMM(ref.travelHours);
  defaultCO2.textContent    = formatNumber(ref.co2Elec/1000,2,' kg');
  defaultElec.textContent   = formatNumber(ref.elecKWh,1,' kWh');
  defaultDiesel.textContent = formatNumber(ref.dieselL,1,' L');
  defaultGas.textContent    = formatNumber(ref.gasL,1,' L');

  // Perso
  const cur = compute(selectedDistance, v);
  customTime.textContent   = hoursToHMM(cur.travelHours);
  customCO2.textContent    = formatNumber(cur.co2Elec/1000,2,' kg');
  customElec.textContent   = formatNumber(cur.elecKWh,1,' kWh');
  customDiesel.textContent = formatNumber(cur.dieselL,1,' L');
  customGas.textContent    = formatNumber(cur.gasL,1,' L');
}

// ---------- Événements ----------
distanceButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    distanceButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedDistance = +btn.dataset.distance;
    updateDisplay();
  });
});
speedSlider.addEventListener('input',updateDisplay);

// ---------- Init ----------
updateDisplay();
