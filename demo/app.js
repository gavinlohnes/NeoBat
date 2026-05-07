// ===============================
//   BEYOND‑OS · CORE STATE
// ===============================

const mockState = {
  threatIndex: "ELEVATED",
  systemStatus: "SYSTEM ACTIVE",
  rhythmPhase: "BUILD",

  metrics: {
    operational: 78,
    loadStrain: 42,
    fluidOps: 55,
    fieldConditions: 28.1
  },

  missionHierarchy: [
    "Complete PUSH session",
    "Hit protein target",
    "Stay within calorie window"
  ],

  commandFlags: ["NIGHT SHIFT ACTIVE", "LOW SLEEP PRIORITY"],

  protocols: [
    "Progression: top reps → +5 lb",
    "Fasting: 16:8 window",
    "No ego lifting"
  ],

  fasting: {
    status: "NO MEAL LOGGED",
    note: "// JUST ATE"
  },

  energy: {
    level: 3,
    label: "😴 // SLEEPY NOW"
  },

  sleep: {
    target: 7,
    lastNight: 6.2
  },

  dailyMetrics: {
    weight: 210,
    calories: { current: 1200, target: 1900 },
    protein: { current: 110, target: 165 },
    steps: { current: 5200, target: 10000 }
  },

  session: {
    type: "PUSH",
    focus: "Chest / Shoulders / Triceps",
    movement: "Bench Press · 4 x 8–10",
    setsLogged: 0
  },

  meals: {
    mealA: { name: "Beef & Rice", servings: 5 },
    mealB: { name: "Chicken & Potatoes", servings: 5 },
    prepStatus: "Prep not started."
  },

  grocery: {
    items: [
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

  systems: {
    neuralLink: "SYNCED",
    missionMode: "NIGHT SHIFT"
  },

  env: {
    stress: 32,
    noise: 24,
    temp: "71°F",
    humidity: "46%"
  }
};

// ===============================
//   TIMESTAMP FORMATTER
// ===============================

function formatTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return `${date}, ${time}`;
}

// ===============================
//   RENDER: HUD SCREEN
// ===============================

function renderHUD() {
  document.getElementById("threatValue").textContent = mockState.threatIndex;
  document.getElementById("systemStatus").textContent = mockState.systemStatus;
  document.getElementById("timestamp").textContent = formatTimestamp();

  document.getElementById("metricOperational").textContent =
    mockState.metrics.operational + "%";
  document.getElementById("metricLoadStrain").textContent =
    mockState.metrics.loadStrain + "%";
  document.getElementById("metricFluidOps").textContent =
    mockState.metrics.fluidOps + "%";
  document.getElementById("metricFieldConditions").textContent =
    mockState.metrics.fieldConditions.toFixed(1) + "%";

  document.getElementById("rhythmPhase").textContent = mockState.rhythmPhase;

  const missionList = document.getElementById("missionList");
  missionList.innerHTML = "";
  mockState.missionHierarchy.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    missionList.appendChild(li);
  });

  const flagList = document.getElementById("flagList");
  flagList.innerHTML = "";
  mockState.commandFlags.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    flagList.appendChild(li);
  });

  const protocolList = document.getElementById("protocolList");
  protocolList.innerHTML = "";
  mockState.protocols.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    protocolList.appendChild(li);
  });
}

// ===============================
//   RENDER: DAILY SCREEN
// ===============================

function renderDaily() {
  document.getElementById("fastingStatus").textContent =
    mockState.fasting.status;
  document.getElementById("fastingNote").textContent =
    mockState.fasting.note;

  const energyScale = document.getElementById("energyScale");
  energyScale.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.className = "energy-button";
    btn.textContent = i;

    if (i === mockState.energy.level) btn.classList.add("active");

    btn.addEventListener("click", () => {
      mockState.energy.level = i;

      document
        .querySelectorAll(".energy-button")
        .forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      mockState.energy.label =
        i <= 3
          ? "😴 // SLEEPY"
          : i <= 7
          ? "⚡ // OPERATIONAL"
          : "🔥 // WIRED";

      document.getElementById("energyStatus").textContent =
        mockState.energy.label;
    });

    energyScale.appendChild(btn);
  }

  document.getElementById("energyStatus").textContent =
    mockState.energy.label;

  document.getElementById("sleepTarget").textContent =
    mockState.sleep.target + " hrs";
  document.getElementById("sleepLast").textContent =
    mockState.sleep.lastNight + " hrs";

  document.getElementById("metricWeight").textContent =
    mockState.dailyMetrics.weight + " lbs";

  document.getElementById("metricCalories").textContent =
    `${mockState.dailyMetrics.calories.current} / ${mockState.dailyMetrics.calories.target}`;

  document.getElementById("metricProtein").textContent =
    `${mockState.dailyMetrics.protein.current} / ${mockState.dailyMetrics.protein.target} g`;

  document.getElementById("metricSteps").textContent =
    `${mockState.dailyMetrics.steps.current} / ${mockState.dailyMetrics.steps.target}`;
}

// ===============================
//   RENDER: ACTION SCREEN
// ===============================

function renderAction() {
  document.getElementById("sessionType").textContent =
    mockState.session.type;
  document.getElementById("sessionFocus").textContent =
    mockState.session.focus;
  document.getElementById("sessionMovement").textContent =
    mockState.session.movement;
  document.getElementById("setsLogged").textContent =
    mockState.session.setsLogged;

  document.getElementById("mealAName").textContent =
    mockState.meals.mealA.name;
  document.getElementById("mealAServings").textContent =
    mockState.meals.mealA.servings;

  document.getElementById("mealBName").textContent =
    mockState.meals.mealB.name;
  document.getElementById("mealBServings").textContent =
    mockState.meals.mealB.servings;

  document.getElementById("prepStatus").textContent =
    mockState.meals.prepStatus;

  document.getElementById("groceryItemsCount").textContent =
    mockState.grocery.items.length;

  document.getElementById("groceryCost").textContent =
    "$" + mockState.grocery.estCost;

  const groceryList = document.getElementById("groceryList");
  groceryList.innerHTML = "";

  mockState.grocery.items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    groceryList.appendChild(li);
  });
}

// ===============================
//   RENDER: SYSTEMS + ENV
// ===============================

function renderSystems() {
  document.getElementById("neuralLinkStatus").textContent =
    mockState.systems.neuralLink;
  document.getElementById("missionMode").textContent =
    mockState.systems.missionMode;
}

function renderEnv() {
  document.getElementById("envStress").textContent = mockState.env.stress;
  document.getElementById("envNoise").textContent = mockState.env.noise;
  document.getElementById("envTemp").textContent = mockState.env.temp;
  document.getElementById("envHumidity").textContent =
    mockState.env.humidity;
}
// ===============================
//   TAB NAVIGATION
// ===============================

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-button");
  const screens = document.querySelectorAll(".screen");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.getAttribute("data-target");

      screens.forEach((screen) => {
        screen.classList.toggle("active", screen.id === target);
      });
    });
  });
}

// ===============================
//   COLLAPSIBLE PANELS
// ===============================

function setupCollapsibles() {
  document.querySelectorAll("[data-collapsible]").forEach((panel) => {
    const toggle = panel.querySelector(".collapse-toggle");
    const body = panel.querySelector(".panel-body");

    if (!toggle || !body) return;

    panel.classList.add("collapsed");
    body.style.maxHeight = "0";

    toggle.addEventListener("click", () => {
      const isCollapsed = panel.classList.contains("collapsed");

      if (isCollapsed) {
        panel.classList.remove("collapsed");
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        panel.classList.add("collapsed");
        body.style.maxHeight = "0";
      }
    });
  });
}

// ===============================
//   ACTION BUTTONS
// ===============================

function setupActions() {
  const logSetButton = document.getElementById("logSetButton");
  logSetButton.addEventListener("click", () => {
    mockState.session.setsLogged += 1;
    document.getElementById("setsLogged").textContent =
      mockState.session.setsLogged;
  });

  const startPrepButton = document.getElementById("startPrepButton");
  const completePrepButton = document.getElementById("completePrepButton");

  startPrepButton.addEventListener("click", () => {
    mockState.meals.prepStatus = "Prep in progress...";
    document.getElementById("prepStatus").textContent =
      mockState.meals.prepStatus;
  });

  completePrepButton.addEventListener("click", () => {
    mockState.meals.prepStatus = "Prep complete. Meals ready.";
    document.getElementById("prepStatus").textContent =
      mockState.meals.prepStatus;
  });
}

// ===============================
//   INIT
// ===============================

function init() {
  renderHUD();
  renderDaily();
  renderAction();
  renderSystems();
  renderEnv();

  setupTabs();
  setupCollapsibles();
  setupActions();

  setInterval(() => {
    document.getElementById("timestamp").textContent = formatTimestamp();
  }, 1000);
}

document.addEventListener("DOMContentLoaded", init);
