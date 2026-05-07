// Simple beep using Web Audio API (no files needed)
function playBeep(freq = 900, duration = 80, volume = 0.08) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, duration);
  } catch (e) {
    // ignore if audio context fails
  }
}

// Mock state for demo
const state = {
  metrics: {
    operationalStatus: 78,
    loadStrain: 42,
    fluidOps: 55,
    fieldConditions: 30
  },
  daily: {
    bodyWeight: 210,
    calories: 1200,
    caloriesTarget: 1900,
    protein: 110,
    proteinTarget: 165,
    steps: 5200,
    stepsTarget: 10000,
    sleepHours: 6.2
  },
  context: {
    rhythmPhase: "BUILD",
    missionHierarchy: [
      "Complete PUSH session",
      "Hit protein target",
      "Stay within calorie window"
    ],
    commandFlags: [
      "NIGHT SHIFT ACTIVE",
      "LOW SLEEP PRIORITY"
    ],
    protocols: [
      "Progression: top reps → +5 lb",
      "Fasting: 16:8 window",
      "No ego lifting"
    ],
    lastMealAt: null,
    energyLevel: null,
    sleepyNow: false,
    missionMode: false
  },
  workout: {
    sessionType: "PUSH",
    sessionFocus: "Chest / Shoulders / Triceps",
    nextMovement: "Bench Press · 4 x 8–10",
    setsLogged: 0
  },
  prep: {
    mealAName: "Beef & Rice",
    mealBName: "Chicken & Potatoes",
    started: false,
    complete: false,
    groceryItems: [
      "2 lb ground beef",
      "2 lb chicken breast",
      "2 cups rice",
      "5 potatoes",
      "Olive oil",
      "Garlic",
      "Onion"
    ],
    estCost: 68
  },
  env: {
    stress: 32,
    volatility: 24,
    temp: 71,
    humidity: 46
  },
  ui: {
    threatIndex: "LOW",
    pulseLine: 0
  }
};

// Threat index + pulse line logic
function computeThreatIndex(state) {
  const { loadStrain, fluidOps, fieldConditions } = state.metrics;
  let score = 0;
  score += loadStrain * 0.4;
  score += (100 - fluidOps) * 0.3;
  score += fieldConditions * 0.3;

  if (score < 35) return "LOW";
  if (score < 70) return "ELEVATED";
  return "CRITICAL";
}

function computePulseLine(state) {
  const { loadStrain, fieldConditions } = state.metrics;
  let val = (loadStrain * 0.6 + fieldConditions * 0.4);
  if (val < 10) val = 10;
  if (val > 100) val = 100;
  return val;
}

function generateDiagnosticLine(state) {
  const os = state.metrics.operationalStatus;
  const ls = state.metrics.loadStrain;
  const fo = state.metrics.fluidOps;
  const env = state.metrics.fieldConditions;

  if (ls > 80) return "LOADSTRAIN CRITICAL. REDUCE PROTOCOL INTENSITY.";
  if (fo < 30) return "FLUIDOPS INSUFFICIENT. INTAKE RECOMMENDED.";
  if (os < 40) return "OPERATIONALSTATUS UNSTABLE. MONITOR CLOSELY.";
  if (env > 70) return "FIELDCONDITIONS VOLATILE. ADJUST MISSION PARAMETERS.";

  return "NO ANOMALIES DETECTED.";
}

// Render HUD
function renderHUD() {
  // Timestamp
  document.getElementById("timestamp").textContent =
    new Date().toLocaleString();

  // Threat + pulse
  state.ui.threatIndex = computeThreatIndex(state);
  state.ui.pulseLine = computePulseLine(state);

  const threatEl = document.getElementById("threatIndex");
  threatEl.textContent = `THREAT INDEX: ${state.ui.threatIndex}`;
  threatEl.classList.remove("threat-low", "threat-elevated", "threat-critical");

  if (state.ui.threatIndex === "LOW") {
    threatEl.style.borderColor = "#00ff88";
    threatEl.style.color = "#00ff88";
  } else if (state.ui.threatIndex === "ELEVATED") {
    threatEl.style.borderColor = "#ffcc00";
    threatEl.style.color = "#ffcc00";
  } else {
    threatEl.style.borderColor = "#ff0033";
    threatEl.style.color = "#ff0033";
  }

  document.getElementById("pulseLine").style.width =
    `${state.ui.pulseLine}%`;

  // Primary metrics
  document.getElementById("operationalStatus").textContent =
    `${state.metrics.operationalStatus}%`;
  document.getElementById("loadStrain").textContent =
    `${state.metrics.loadStrain}%`;
  document.getElementById("fluidOps").textContent =
    `${state.metrics.fluidOps}%`;
  document.getElementById("fieldConditions").textContent =
    `${state.metrics.fieldConditions}%`;

  // Secondary band
  document.getElementById("rhythmPhase").textContent =
    state.context.rhythmPhase;

  const mhEl = document.getElementById("missionHierarchy");
  mhEl.innerHTML = "";
  state.context.missionHierarchy.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    mhEl.appendChild(li);
  });

  const cfEl = document.getElementById("commandFlags");
  cfEl.innerHTML = "";
  state.context.commandFlags.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    cfEl.appendChild(li);
  });

  const protoEl = document.getElementById("protocols");
  protoEl.innerHTML = "";
  state.context.protocols.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    protoEl.appendChild(li);
  });

  // Daily metrics
  document.getElementById("bodyWeight").textContent =
    state.daily.bodyWeight;
  document.getElementById("calories").textContent =
    state.daily.calories;
  document.getElementById("caloriesTarget").textContent =
    state.daily.caloriesTarget;
  document.getElementById("protein").textContent =
    state.daily.protein;
  document.getElementById("proteinTarget").textContent =
    state.daily.proteinTarget;
  document.getElementById("steps").textContent =
    state.daily.steps;
  document.getElementById("stepsTarget").textContent =
    state.daily.stepsTarget;
  document.getElementById("sleepHours").textContent =
    state.daily.sleepHours.toFixed(1);

  // Fasting
  const fastingStatus = document.getElementById("fastingStatus");
  if (state.context.lastMealAt) {
    fastingStatus.textContent =
      "LAST MEAL: " + state.context.lastMealAt.toLocaleTimeString();
  } else {
    fastingStatus.textContent = "NO MEAL LOGGED";
  }

  // Energy scale
  const energyScale = document.getElementById("energyScale");
  energyScale.innerHTML = "";
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (state.context.energyLevel === i) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      state.context.energyLevel = i;
      playBeep(950, 60);
      renderHUD();
    });
    energyScale.appendChild(btn);
  }

  // Workout
  document.getElementById("sessionType").textContent =
    state.workout.sessionType;
  document.getElementById("sessionFocus").textContent =
    state.workout.sessionFocus;
  document.getElementById("nextMovement").textContent =
    state.workout.nextMovement;
  document.getElementById("sessionProgress").textContent =
    `${state.workout.setsLogged} sets logged`;

  // Prep
  document.getElementById("mealAName").textContent =
    state.prep.mealAName;
  document.getElementById("mealBName").textContent =
    state.prep.mealBName;

  const prepStatus = document.getElementById("prepStatus");
  if (!state.prep.started) {
    prepStatus.textContent = "Prep not started.";
  } else if (!state.prep.complete) {
    prepStatus.textContent = "Prep in progress...";
  } else {
    prepStatus.textContent = "Prep complete. Meals ready.";
  }

  // Grocery
  document.getElementById("groceryItemsCount").textContent =
    state.prep.groceryItems.length;
  document.getElementById("groceryCost").textContent =
    state.prep.estCost;

  const groceryList = document.getElementById("groceryList");
  groceryList.innerHTML = "";
  state.prep.groceryItems.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    groceryList.appendChild(li);
  });

  // Suit sync
  document.getElementById("neuralLink").textContent = "SYNCED";
  document.getElementById("motorAssist").textContent = "READY";
  document.getElementById("powerRouting").textContent = "OPTIMAL";
  document.getElementById("sensorArray").textContent = "CALIBRATED";
  document.getElementById("stealthField").textContent =
    state.context.missionMode ? "ENGAGED" : "IDLE";

  // Mission mode
  document.getElementById("missionModeStatus").textContent =
    `Mission mode: ${state.context.missionMode ? "ON" : "OFF"}`;

  // Field sensor matrix
  document.getElementById("envStress").textContent =
    state.env.stress;
  document.getElementById("envVolatility").textContent =
    state.env.volatility;
  document.getElementById("envTemp").textContent =
    state.env.temp;
  document.getElementById("envHumidity").textContent =
    state.env.humidity;

  // Diagnostic line
  document.getElementById("diagnosticLine").textContent =
    generateDiagnosticLine(state);
}

// Boot + wiring
window.addEventListener("load", () => {
  const boot = document.getElementById("boot-screen");
  const hud = document.getElementById("suit-hud");

  setTimeout(() => {
    boot.classList.add("hidden");
    hud.classList.remove("hidden");
    document.getElementById("systemStatus").textContent =
      "// SYSTEM ACTIVE";
    playBeep(700, 120, 0.12);
    renderHUD();
  }, 1500);

  // Buttons
  document.getElementById("btnJustAte").addEventListener("click", () => {
    state.context.lastMealAt = new Date();
    playBeep(820, 80);
    renderHUD();
  });

  document.getElementById("btnSleepy").addEventListener("click", () => {
    state.context.sleepyNow = true;
    state.metrics.operationalStatus = Math.max(
      0,
      state.metrics.operationalStatus - 10
    );
    state.metrics.loadStrain = Math.min(
      100,
      state.metrics.loadStrain + 8
    );
    playBeep(500, 120);
    renderHUD();
  });

  document.getElementById("btnCompleteSet").addEventListener("click", () => {
    state.workout.setsLogged += 1;
    state.metrics.loadStrain = Math.min(
      100,
      state.metrics.loadStrain + 4
    );
    state.metrics.operationalStatus = Math.max(
      0,
      state.metrics.operationalStatus - 1
    );
    playBeep(1000, 70);
    renderHUD();
  });

  document.getElementById("btnStartPrep").addEventListener("click", () => {
    state.prep.started = true;
    state.prep.complete = false;
    playBeep(780, 90);
    renderHUD();
  });

  document.getElementById("btnCompletePrep").addEventListener("click", () => {
    if (!state.prep.started) {
      state.prep.started = true;
    }
    state.prep.complete = true;
    playBeep(620, 140);
    renderHUD();
  });

  document.getElementById("btnViewGrocery").addEventListener("click", () => {
    // Just beep + re-render for now
    playBeep(880, 80);
    renderHUD();
  });

  document.getElementById("btnToggleMission").addEventListener("click", () => {
    state.context.missionMode = !state.context.missionMode;
    playBeep(state.context.missionMode ? 1050 : 650, 100);
    if (state.context.missionMode) {
      document.documentElement.classList.add("mission-active");
    } else {
      document.documentElement.classList.remove("mission-active");
    }
    renderHUD();
  });

  // Periodic small updates (pulse)
  setInterval(() => {
    // Tiny drift to make it feel alive
    state.metrics.fieldConditions = Math.max(
      0,
      Math.min(100, state.metrics.fieldConditions + (Math.random() * 4 - 2))
    );
    renderHUD();
  }, 8000);
});
