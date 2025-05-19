// ---------- Constantes ----------
const DEFAULT_SPEED = 130; // km/h

const CONSUMPTION = {
  electricKWhPer100: 18,      // kWh / 100 km (berline)
  dieselLPer100: 6,           // L / 100 km
  gasolineLPer100: 7.5,       // L / 100 km
  co2PerKWh: 50,              // g CO2 / kWh (mix France 2023 approx.)
  co2PerDieselL: 2680,        // g CO2 / litre
  co2PerGasolineL: 2310       // g CO2 / litre
};

// ---------- Sélecteurs ----------
const distanceButtons = document.querySelectorAll('.distance-button');
const speedSlider      = document.getElementById('speed-slider');
const chosenSpeedLabel = document.getElementById('chosen-speed');

// Référence elements
const defaultTime   = document.getElementById('default-time');
const defaultCO2    = document.getElementById('default-co2');
const defaultElec   = document.getElementById('default-elec');
const defaultDiesel = document.getElementById('default-diesel');
const defaultGas    = document.getElementById('default-gas');

// Custom elements
const customTime   = document.getElementById('custom-time');
const customCO2    = document.getElementById('custom-co2');
const customElec   = document.getElementById('custom-elec');
const customDiesel = document.getElementById('custom-diesel');
const customGas    = document.getElementById('custom-gas');

let selectedDistance = 50; // km par défaut

// ---------- Helpers ----------
const pad = (n) => String(n).padStart(2, '0');
function hoursToHMM(hours) {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${pad(h)}h${pad(m)}`;
}

function formatNumber(value, decimals = 1, unit = '') {
  return `${value.toFixed(decimals)}${unit}`;
}

// ---------- Calculs ----------
function compute(distanceKm, speedKmh) {
  const travelHours = distanceKm / speedKmh;

  // Énergie / Emissions
  const elecKWh = distanceKm * CONSUMPTION.electricKWhPer100 / 100;
  const dieselL = distanceKm * CONSUMPTION.dieselLPer100 / 100;
  const gasL    = distanceKm * CONSUMPTION.gasolineLPer100 / 100;

  const co2Elec   = elecKWh * CONSUMPTION.co2PerKWh;
  const co2Diesel = dieselL  * CONSUMPTION.co2PerDieselL;
  const co2Gas    = gasL     * CONSUMPTION.co2PerGasolineL;

  return {
    travelHours,
    co2: co2Elec, // on affiche la plus basse (élec) par défaut
    elecKWh,
    dieselL,
    gasL,
    co2Elec,
    co2Diesel,
    co2Gas
  };
}

// ---------- Affichage ----------
function updateDisplay() {
  const customSpeed = parseInt(speedSlider.value, 10);
  chosenSpeedLabel.textContent = `${customSpeed}\u00A0km/h`;

  // Référence 130 km/h
  const ref = compute(selectedDistance, DEFAULT_SPEED);
  defaultTime.textContent   = hoursToHMM(ref.travelHours);
  defaultCO2.textContent    = formatNumber(ref.co2Elec/1000, 2, ' kg');
  defaultElec.textContent   = formatNumber(ref.elecKWh,   1, ' kWh');
  defaultDiesel.textContent = formatNumber(ref.dieselL,   1, ' L');
  defaultGas.textContent    = formatNumber(ref.gasL,      1, ' L');

  // Scénario perso
  const cur = compute(selectedDistance, customSpeed);
  customTime.textContent   = hoursToHMM(cur.travelHours);
  customCO2.textContent    = formatNumber(cur.co2Elec/1000, 2, ' kg');
  customElec.textContent   = formatNumber(cur.elecKWh,   1, ' kWh');
  customDiesel.textContent = formatNumber(cur.dieselL,   1, ' L');
  customGas.textContent    = formatNumber(cur.gasL,      1, ' L');
}

// ---------- Événements ----------
distanceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    distanceButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDistance = parseInt(btn.dataset.distance, 10);
    updateDisplay();
  });
});

speedSlider.addEventListener('input', updateDisplay);

// ---------- Animation orbitale ----------
const orbitDot = document.getElementById('orbit-dot');
let angle = 0;
function animateOrbit() {
  angle = (angle + 0.5) % 360;
  const rad = angle * Math.PI / 180;
  const cx = 150, cy = 75, rx = 120, ry = 30;
  const x  = cx + rx * Math.cos(rad);
  const y  = cy + ry * Math.sin(rad);
  orbitDot.setAttribute('cx', x);
  orbitDot.setAttribute('cy', y);
  requestAnimationFrame(animateOrbit);
}

// ---------- Init ----------
updateDisplay();
animateOrbit();
