// HBN H5 "See Time Lab"
// Notes: Use Unicode escapes for Chinese strings to avoid encoding issues on some Windows setups.

const SCREENS = ["preload", "cover", "identity", "goal", "lab", "exp1", "exp2", "emotion", "generating", "report"];

const GOALS = {
  brightening: { label: "\u63d0\u4eae\u53bb\u9ec4", track: "whitening" },
  acneMarks: { label: "\u6de1\u5316\u75d8\u5370", track: "whitening" },
  darkCircles: { label: "\u6de1\u5316\u9ed1\u773c\u5708", track: "eye" },
  wrinkles: { label: "\u7d27\u81f4\u6de1\u7eb9", track: "eye" },
};

const TRACKS = {
  whitening: {
    label: "\u539f\u767d\u6c34\u4e73/\u7cbe\u534e\u8def\u5f84",
    productsLine: "\u4ea7\u54c1\u793a\u610f\uff1a\u539f\u767d\u7cbe\u8439\u6c34 / \u539f\u767d\u7cbe\u8439\u4e73",
    assets: ["./assets/HBN\u539f\u767d\u6c34.png", "./assets/HBN\u539f\u767d\u4e73.png"],
  },
  eye: {
    label: "\u5496\u5561\u56e0\u773c\u971c\u8def\u5f84",
    productsLine: "\u4ea7\u54c1\u793a\u610f\uff1a\u5496\u5561\u56e0\u7d27\u81f4\u4fee\u62a4\u773c\u971c",
    assets: ["./assets/HBN\u773c\u971c.png"],
  },
};

const QUOTES = [
  "\u4f60\u7684\u6539\u53d8\uff0c\u88ab\u770b\u89c1\u4e86\u3002",
  "\u6162\u6162\u6765\uff0c\u4f46\u6bcf\u4e00\u6b65\u90fd\u7b97\u6570\u3002",
  "\u771f\u5b9e\u4e0d\u6015\u6162\uff0c\u529f\u6548\u4e0d\u6015\u770b\u3002",
];

const state = {
  screen: "preload",
  nick: "",
  researcherId: "",
  goalKey: "",
  track: "",
  exp1Done: false,
  exp2Done: false,
  soundOn: true,
  results: { exp1: null, exp2: null },
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function randomId() {
  const n = Math.floor(Math.random() * 900 + 100);
  return `\u7814\u7a76\u5458-${n}`;
}

function setStepText(text) {
  $("#stepText").textContent = text;
}
function setProgressLine(p01) {
  const p = `${Math.round(clamp(p01, 0, 1) * 100)}%`;
  $("#progressLineFill").style.setProperty("--p", p);
}

function showScreen(name) {
  state.screen = name;
  $$(".screen").forEach((s) => s.classList.toggle("screen--active", s.dataset.screen === name));

  const i = SCREENS.indexOf(name);
  setProgressLine(i <= 0 ? 0 : i / (SCREENS.length - 1));

  const hints = {
    preload: "\u51c6\u5907\u4e2d\u2026",
    cover: "\u6162\u4e00\u70b9\uff0c\u8fdc\u4e00\u70b9",
    identity: "\u8bbe\u5b9a\u4f60\u7684\u7814\u7a76\u5458\u8eab\u4efd",
    goal: "\u9009\u62e9\u4f60\u60f3\u770b\u89c1\u7684\u6539\u53d8",
    lab: "\u8fdb\u5165\u5b9e\u9a8c\u53f0",
    exp1: state.track === "eye" ? "\u62d6\u52a8\u65f6\u95f4\u8f74\uff0c\u770b\u89c1\u95ee\u9898" : "\u957f\u63093\u79d2\uff0c\u4fdd\u6301\u7a33\u5b9a\u53cd\u5e94",
    exp2: state.track === "whitening" ? "\u6ed1\u5230\u53ef\u89c6\u9608\u503c\uff0c\u786e\u8ba4\u8bfb\u6570" : "\u62d6\u62fd\u6295\u653e\u6210\u5206",
    emotion: "\u770b\u4e0d\u89c1\u7684\u90a3\u4e9b\u5e74",
    generating: "\u751f\u6210\u62a5\u544a\u4e2d\u2026",
    report: "\u53ef\u4fdd\u5b58/\u5206\u4eab\u4f60\u7684\u62a5\u544a",
  };
  setStepText(hints[name] ?? "\u8fdb\u884c\u4e2d\u2026");

  if (name === "lab") configureLabUI();
  if (name === "exp1") configureExp1UI();
  if (name === "exp2") configureExp2UI();
}

function openModal({ title, bodyHtml }) {
  const dialog = $("#modal");
  $("#modalTitle").textContent = title;
  $("#modalBody").innerHTML = bodyHtml;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else alert(`${title}\n\n${$("#modalBody").textContent}`);
}

function beep(freq = 520, dur = 0.06, type = "sine", gain = 0.04) {
  if (!state.soundOn) return;
  try {
    const ctx = beep._ctx ?? (beep._ctx = new (window.AudioContext || window.webkitAudioContext)());
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch {
    // ignore
  }
}

function haptic(ms = 16) {
  if (!("vibrate" in navigator)) return;
  try {
    navigator.vibrate(ms);
  } catch {
    // ignore
  }
}

function ensureNick() {
  if (state.researcherId) return;
  const raw = state.nick.trim();
  state.researcherId = raw ? `${raw}` : randomId();
}

function setGoal(key) {
  state.goalKey = key;
  state.track = GOALS[key]?.track ?? "";
  $$(".choice").forEach((btn) => {
    const active = btn.dataset.goal === key;
    btn.setAttribute("aria-checked", active ? "true" : "false");
  });
  $("#btnGoalConfirm").disabled = !key;
}

function exp1ResultWhitening() {
  return {
    title: "\u5b9e\u9a8c1\u7ed3\u679c\uff1a\u9ed1\u8272\u7d20\u6291\u5236\uff08\u6c34\u4e73\u7cbe\u534e\u8def\u5f84\uff09",
    primary: "\u9ed1\u8272\u7d20\u5408\u6210\u6291\u5236 50.69%",
    secondary: "\u7ea6\u4e3a\u5149\u7518\u8349\u5b9a\u7684 2.39 \u500d",
    note: "\u6b64\u5904\u8bf7\u7528\u4f60\u4eec\u7b56\u7565\u5355/\u5b98\u65b9\u53e3\u5f84\u6570\u636e\u66ff\u6362\u3002",
    actives: ["\u03b1-\u718a\u679c\u82f7"],
  };
}

function exp1ResultEyeBaseline(hours) {
  const h = Number.isFinite(hours) ? hours : 12;
  return {
    title: "\u5b9e\u9a8c1\u7ed3\u679c\uff1a\u901a\u5bb5\u540e\u773c\u5468\u53d8\u5316\uff08\u773c\u971c\u8def\u5f84\u00b7\u6a21\u62df\uff09",
    primary: `${h}h \u60c5\u5883\uff1a\u6697\u6c89\u66f4\u660e\u663e\uff0c\u7ec6\u7eb9\u66f4\u6e05\u6670\uff08\u53ef\u89c6\u6a21\u62df\uff09`,
    secondary: "\u5148\u770b\u89c1\u95ee\u9898\uff0c\u518d\u7528\u8bc1\u636e\u53bb\u6539\u53d8",
    note: "\u6b64\u5c4f\u4e3a\u60c5\u5883\u6a21\u62df\uff1b\u5177\u4f53\u529f\u6548\u4ee5\u4eba\u4f53\u5b9e\u6d4b\u6570\u636e\u53e3\u5f84\u4e3a\u51c6\u3002",
    actives: ["\u2014"],
  };
}

function exp2ResultEye() {
  const goal = state.goalKey;
  if (goal === "darkCircles") {
    return {
      title: "\u5b9e\u9a8c2\u7ed3\u679c\uff1a\u773c\u5468\u7115\u4eae\uff08\u773c\u971c\u8def\u5f84\uff09",
      primary: "\u773c\u5468\u7115\u4eae +36.43%",
      secondary: "\u6697\u6c89\u53ef\u89c1\u6539\u5584\uff08\u6309\u53e3\u5f84\u8865\u5145\u7ef4\u5ea6\uff09",
      note: "\u6b64\u5904\u8bf7\u7528\u4f60\u4eec\u7b56\u7565\u5355/\u5b98\u65b9\u53e3\u5f84\u6570\u636e\u66ff\u6362\u3002",
      actives: ["\u5496\u5561\u56e0", "\u7ef4\u751f\u7d20K2"],
    };
  }
  if (goal === "wrinkles") {
    return {
      title: "\u5b9e\u9a8c2\u7ed3\u679c\uff1a\u773c\u5468\u6de1\u7eb9\uff08\u773c\u971c\u8def\u5f84\uff09",
      primary: "\u773c\u5468\u76b1\u7eb9\u6570\u91cf -45.90%",
      secondary: "\u7ec6\u7eb9\u4e0e\u7d27\u81f4\u8868\u73b0\u53ef\u89c1\u6539\u5584",
      note: "\u6b64\u5904\u8bf7\u7528\u4f60\u4eec\u7b56\u7565\u5355/\u5b98\u65b9\u53e3\u5f84\u6570\u636e\u66ff\u6362\u3002",
      actives: ["\u5496\u5561\u56e0", "\u7ef4\u751f\u7d20K2"],
    };
  }
  return {
    title: "\u5b9e\u9a8c2\u7ed3\u679c\uff1a\u773c\u5468\u6539\u5584\uff08\u773c\u971c\u8def\u5f84\uff09",
    primary: "\u7115\u4eae +36.43% / \u76b1\u7eb9 -45.90%",
    secondary: "\u4ee5\u4f60\u7684\u76ee\u6807\u5448\u73b0\u91cd\u70b9\u7ed3\u8bba",
    note: "\u6b64\u5904\u8bf7\u7528\u4f60\u4eec\u7b56\u7565\u5355/\u5b98\u65b9\u53e3\u5f84\u6570\u636e\u66ff\u6362\u3002",
    actives: ["\u5496\u5561\u56e0", "\u7ef4\u751f\u7d20K2"],
  };
}

function exp2ResultWhitening(readingPct) {
  const pct = Math.round(clamp(readingPct ?? 80, 0, 100));
  const isAcne = state.goalKey === "acneMarks";
  return {
    title: isAcne
      ? "\u5b9e\u9a8c2\u7ed3\u679c\uff1a\u75d8\u5370\u89c2\u611f\u8bfb\u6570\uff08\u6c34\u4e73\u7cbe\u534e\u8def\u5f84\uff09"
      : "\u5b9e\u9a8c2\u7ed3\u679c\uff1a\u63d0\u4eae\u8bfb\u6570\uff08\u6c34\u4e73\u7cbe\u534e\u8def\u5f84\uff09",
    primary: isAcne
      ? `\u53ef\u89c6\u8bfb\u6570 ${pct}%\uff1a\u75d8\u5370\u89c2\u611f\u66f4\u5747\u5300\u3001\u66f4\u5e72\u51c0`
      : `\u53ef\u89c6\u8bfb\u6570 ${pct}%\uff1a\u80a4\u8272\u66f4\u900f\u4eae\u3001\u66f4\u5747\u5300`,
    secondary: "\u6162\u4e00\u70b9\uff0c\u628a\u53d8\u5316\u4ece\u201c\u611f\u89c9\u201d\u53d8\u6210\u201c\u8bc1\u636e\u201d",
    note: "\u6b64\u5904\u8bf7\u7528\u4f60\u4eec\u7b56\u7565\u5355/\u5b98\u65b9\u53e3\u5f84\u6570\u636e\u66ff\u6362\u3002",
    actives: ["\u03b1-\u718a\u679c\u82f7\uff08\u53e3\u5f84\u53ef\u66ff\u6362\uff09"],
  };
}

function updateReportCard() {
  ensureNick();
  $("#reportId").textContent = state.researcherId;
  $("#reportPath").textContent = TRACKS[state.track]?.label ?? "\u2014";
  $("#reportGoal").textContent = GOALS[state.goalKey]?.label ?? "\u2014";

  const actives = new Set();
  if (state.results.exp1?.actives) state.results.exp1.actives.forEach((a) => (a && a !== "\u2014" ? actives.add(a) : null));
  if (state.results.exp2?.actives) state.results.exp2.actives.forEach((a) => (a && a !== "\u2014" ? actives.add(a) : null));
  $("#reportActives").textContent = actives.size ? Array.from(actives).join(" / ") : "\u2014";

  const dataLines = [];
  if (state.results.exp1?.primary) dataLines.push(`\u2022 ${state.results.exp1.primary}`);
  if (state.results.exp2?.primary) dataLines.push(`\u2022 ${state.results.exp2.primary}`);
  $("#reportData").textContent = dataLines.length ? dataLines.join("\n") : "\u2014";

  $("#reportQuote").textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  $("#reportProductsLine").textContent = TRACKS[state.track]?.productsLine ?? "\u2014";
  const showFor = (el, track) => {
    if (!el) return;
    el.style.display = track === state.track ? "" : "none";
  };
  showFor($("#prodWater"), "whitening");
  showFor($("#prodMilk"), "whitening");
  showFor($("#prodEye"), "eye");
}

async function preloadAssets() {
  const bar = $("#preloadBar");
  const urls = ["./assets/HBN\u539f\u767d\u6c34.png", "./assets/HBN\u539f\u767d\u4e73.png", "./assets/HBN\u773c\u971c.png"];
  let done = 0;
  bar.style.setProperty("--p", "8%");

  await Promise.all(
    urls.map(
      (u) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            done += 1;
            bar.style.setProperty("--p", `${Math.round((done / urls.length) * 92 + 8)}%`);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = u;
        })
    )
  );
  await sleep(250);
}

function bindGlobalActions() {
  $("#stage").addEventListener("click", async (e) => {
    const t = e.target.closest("[data-action]");
    if (!t) return;
    const action = t.dataset.action;
    beep(620, 0.05, "triangle", 0.035);

    if (action === "start") showScreen("identity");
    if (action === "skipNick") {
      state.nick = "";
      state.researcherId = "";
      showScreen("goal");
    }
    if (action === "confirmNick") {
      state.nick = $("#nickInput").value || "";
      state.researcherId = "";
      showScreen("goal");
    }
    if (action === "confirmGoal") {
      if (!state.goalKey) return;
      showScreen("lab");
    }
    if (action === "goExp1") showScreen("exp1");
    if (action === "exp1Skip") await completeExp1(true);
    if (action === "exp2Skip") await completeExp2(true);
    if (action === "nightConfirm") await completeExp1(false);
    if (action === "compareConfirm") await handleCompareConfirm();
    if (action === "goReport") await goGenerating();
    if (action === "restart") restart();
    if (action === "savePoster") await savePoster();
    if (action === "share") await shareLink();
  });

  $$(".choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      setGoal(btn.dataset.goal);
      haptic(12);
      beep(740, 0.04, "sine", 0.03);
    });
  });

  $("#btnSound").addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    $("#btnSound .icon").textContent = state.soundOn ? "🔈" : "🔇";
    if (state.soundOn) beep(880, 0.06, "sine", 0.03);
  });
}

function bindExp1Hold() {
  const molecule = $("#molecule");
  const bar = $("#holdBar");
  const cell = $("#cell");
  if (!molecule || !bar || !cell) return;

  let holding = false;
  let startTs = 0;
  let raf = 0;
  const HOLD_MS = 3000;

  function reset() {
    holding = false;
    startTs = 0;
    cell.classList.remove("cell--light");
    bar.style.setProperty("--p", "0%");
    cancelAnimationFrame(raf);
  }

  function tick(now) {
    if (!holding) return;
    const t = clamp((now - startTs) / HOLD_MS, 0, 1);
    bar.style.setProperty("--p", `${Math.round(t * 100)}%`);
    if (t > 0.32) cell.classList.add("cell--light");
    if (t >= 1) {
      holding = false;
      cancelAnimationFrame(raf);
      completeExp1(false).catch(() => {});
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  const onDown = (e) => {
    if (state.exp1Done) return;
    if (state.track !== "whitening") return;
    holding = true;
    startTs = performance.now();
    bar.style.setProperty("--p", "0%");
    molecule.setPointerCapture?.(e.pointerId);
    haptic(18);
    beep(520, 0.06, "sine", 0.03);
    raf = requestAnimationFrame(tick);
  };

  const onUp = () => {
    if (state.exp1Done) return;
    if (state.track !== "whitening") return;
    if (!holding) return;
    reset();
    openModal({ title: "\u53cd\u5e94\u4e2d\u65ad", bodyHtml: `<p>\u8bf7\u4fdd\u6301\u7a33\u5b9a\u53cd\u5e94\uff1a\u957f\u6309 3 \u79d2\uff0c\u624d\u80fd\u770b\u89c1\u53d8\u5316\u3002</p>` });
  };

  molecule.addEventListener("pointerdown", onDown);
  molecule.addEventListener("pointerup", onUp);
  molecule.addEventListener("pointercancel", onUp);
  molecule.addEventListener("pointerleave", onUp);
}

async function completeExp1(isDemo) {
  if (state.exp1Done) return;
  state.exp1Done = true;
  haptic(24);
  beep(880, 0.08, "triangle", 0.035);

  if (state.track === "whitening") {
    $("#holdBar")?.style.setProperty("--p", "100%");
    $("#cell")?.classList.add("cell--light");
    state.results.exp1 = exp1ResultWhitening();
  } else {
    const hours = Number($("#nightSlider")?.value || 12);
    state.results.exp1 = exp1ResultEyeBaseline(hours);
  }

  openModal({
    title: state.results.exp1.title,
    bodyHtml: `
      <div class="kpi">
        <p><strong>${state.results.exp1.primary}</strong></p>
        <p>${state.results.exp1.secondary}</p>
        <p class="fine">${state.results.exp1.note}</p>
        <p style="margin-top:10px; color: rgba(245,245,247,.85)">${
          state.track === "whitening"
            ? "\u6162\u4e00\u70b9\uff0c\u624d\u80fd\u628a\u6bcf\u4e00\u6b21\u53d8\u5316\u90fd\u770b\u6e05\u3002"
            : "\u5148\u770b\u89c1\u95ee\u9898\uff0c\u518d\u7528\u8bc1\u636e\u53bb\u6539\u53d8\u3002"
        }</p>
      </div>
    `,
  });

  $("#modal").addEventListener(
    "close",
    async () => {
      await sleep(120);
      showScreen("exp2");
    },
    { once: true }
  );

  if (isDemo) await sleep(0);
}

function bindExp2Drag() {
  const zone = $("#eyeZone");
  const ghost = $("#dragGhost");
  const dark = $("#underEyeDark");
  const wrinkle = $("#underEyeWrinkle");
  if (!zone || !ghost || !dark || !wrinkle) return;

  let dragging = null;

  function setGhost(on, x, y, text) {
    ghost.textContent = text ?? "";
    ghost.classList.toggle("drag-ghost--on", on);
    if (!on) {
      ghost.style.transform = "translate(-9999px, -9999px)";
      return;
    }
    ghost.style.transform = `translate(${x + 10}px, ${y + 10}px)`;
  }

  function pointInZone(x, y) {
    const r = zone.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  async function applyImprovement() {
    zone.classList.add("eye-zone--armed");
    await sleep(120);
    dark.classList.add("under-eye--improved");
    wrinkle.classList.add("under-eye--improved");
    beep(860, 0.08, "triangle", 0.032);
    haptic(20);
    await sleep(900);
    await completeExp2(false);
  }

  function startDrag(el, e) {
    if (state.exp2Done) return;
    if (state.track !== "eye") return;
    const label = el.textContent.trim();
    dragging = { label, pointerId: e.pointerId };
    el.setPointerCapture?.(e.pointerId);
    setGhost(true, e.clientX, e.clientY, label);
    zone.classList.toggle("eye-zone--armed", pointInZone(e.clientX, e.clientY));
    beep(600, 0.05, "sine", 0.028);
  }

  function moveDrag(e) {
    if (!dragging || dragging.pointerId !== e.pointerId) return;
    setGhost(true, e.clientX, e.clientY, dragging.label);
    zone.classList.toggle("eye-zone--armed", pointInZone(e.clientX, e.clientY));
  }

  async function endDrag(e) {
    if (!dragging || dragging.pointerId !== e.pointerId) return;
    const ok = pointInZone(e.clientX, e.clientY);
    setGhost(false);
    zone.classList.remove("eye-zone--armed");
    dragging = null;
    if (ok) await applyImprovement();
    else {
      beep(220, 0.06, "sawtooth", 0.02);
      haptic(10);
    }
  }

  $$(".chip").forEach((chip) => {
    chip.addEventListener("pointerdown", (e) => startDrag(chip, e));
    chip.addEventListener("pointermove", moveDrag);
    chip.addEventListener("pointerup", endDrag);
    chip.addEventListener("pointercancel", endDrag);
    chip.addEventListener("keydown", async (e) => {
      if (state.exp2Done) return;
      if (state.track !== "eye") return;
      if (e.key !== "Enter" && e.key !== " ") return;
      zone.classList.add("eye-zone--armed");
      await sleep(160);
      zone.classList.remove("eye-zone--armed");
      await applyImprovement();
    });
  });
}

async function completeExp2(isDemo) {
  if (state.exp2Done) return;
  state.exp2Done = true;

  if (state.track === "eye") state.results.exp2 = exp2ResultEye();
  else state.results.exp2 = state.results.exp2 ?? exp2ResultWhitening(80);

  openModal({
    title: state.results.exp2.title,
    bodyHtml: `
      <div class="kpi">
        <p><strong>${state.results.exp2.primary}</strong></p>
        <p>${state.results.exp2.secondary}</p>
        <p class="fine">${state.results.exp2.note}</p>
        <p style="margin-top:10px; color: rgba(245,245,247,.85)">\u770b\u89c1\u7684\u90a3\u4e00\u523b\uff0c\u624d\u662f\u4f60\u771f\u6b63\u62e5\u6709\u7684\u6539\u53d8\u3002</p>
      </div>
    `,
  });

  $("#modal").addEventListener(
    "close",
    async () => {
      await sleep(120);
      showScreen("emotion");
    },
    { once: true }
  );

  if (isDemo) await sleep(0);
}

function configureExp1UI() {
  const t = state.track || GOALS[state.goalKey]?.track || "whitening";
  state.track = t;
  const title = $("#exp1Title");
  const hint = $("#exp1Hint");

  $("#exp1Whitening")?.classList.toggle("variant--active", t === "whitening");
  $("#exp1Eye")?.classList.toggle("variant--active", t === "eye");

  if (t === "whitening") {
    title.textContent = "\u5b9e\u9a8c 1\uff1a\u9ed1\u8272\u7d20\u6291\u5236\u9a8c\u8bc1\uff08\u6c34\u4e73\u7cbe\u534e\u8def\u5f84\uff09";
    hint.textContent = "\u8bf7\u957f\u6309\u300c\u03b1-\u718a\u679c\u82f7\u5206\u5b50\u300d\uff0c\u4fdd\u6301\u7a33\u5b9a\u53cd\u5e94\uff083 \u79d2\uff09\u3002";
  } else {
    title.textContent = "\u5b9e\u9a8c 1\uff1a\u901a\u5bb5\u773c\u5468\u53d8\u5316\uff08\u773c\u971c\u8def\u5f84\u00b7\u65f6\u95f4\u8f74\u6a21\u62df\uff09";
    hint.textContent = "\u62d6\u52a8\u65f6\u95f4\u8f74\uff0c\u5148\u300c\u770b\u89c1\u300d\u95ee\u9898\uff1b\u518d\u8fdb\u5165\u4e0b\u4e00\u6b65\u9a8c\u8bc1\u3002";
    initNightSlider();
  }
}

function configureExp2UI() {
  const t = state.track || GOALS[state.goalKey]?.track || "whitening";
  state.track = t;
  const title = $("#exp2Title");
  const hint = $("#exp2Hint");

  $("#exp2Whitening")?.classList.toggle("variant--active", t === "whitening");
  $("#exp2Eye")?.classList.toggle("variant--active", t === "eye");

  if (t === "whitening") {
    title.textContent = "\u5b9e\u9a8c 2\uff1a\u53ef\u89c6\u8bfb\u6570\u9a8c\u8bc1\uff08\u6c34\u4e73\u7cbe\u534e\u8def\u5f84\u00b7\u5bf9\u6bd4\u6ed1\u6746\uff09";
    hint.textContent = "\u628a\u5bf9\u6bd4\u6ed1\u6746\u63a8\u5230\u300c\u53ef\u89c6\u9608\u503c\u300d\uff0880% \u4ee5\u4e0a\uff09\uff0c\u518d\u786e\u8ba4\u8bfb\u6570\u3002";
    initCompareSlider();
  } else {
    title.textContent = "\u5b9e\u9a8c 2\uff1a\u773c\u5468\u4fee\u62a4\u9a8c\u8bc1\uff08\u773c\u971c\u8def\u5f84\u00b7\u62d6\u62fd\u6295\u653e\uff09";
    hint.textContent = "\u628a\u6210\u5206\u62d6\u5230\u773c\u5468\u533a\u57df\uff0c\u542f\u52a8\u4fee\u62a4\u53cd\u5e94\u3002";
  }
}

function initNightSlider() {
  const slider = $("#nightSlider");
  if (!slider || slider.dataset.bound === "1") return;
  slider.dataset.bound = "1";
  const eye = $("#nightEye");
  const label = $("#nightLabel");

  const apply = () => {
    const h = Number(slider.value || 0);
    label.textContent = `\u65f6\u95f4\uff1a${h}h`;
    const dark = clamp(0.55 + h * 0.03, 0.55, 0.88);
    const wrinkle = clamp(0.22 + h * 0.02, 0.22, 0.56);
    eye?.style.setProperty("--dark", String(dark));
    eye?.style.setProperty("--wrinkle", String(wrinkle));
  };
  slider.addEventListener("input", () => {
    apply();
    beep(380, 0.015, "sine", 0.012);
  });
  apply();
}

function initCompareSlider() {
  const slider = $("#compareSlider");
  if (!slider || slider.dataset.bound === "1") return;
  slider.dataset.bound = "1";
  const patch = $("#comparePatch");
  const label = $("#compareLabel");

  const apply = () => {
    const v = Number(slider.value || 0);
    const p = clamp(v / 100, 0, 1);
    patch?.style.setProperty("--p", String(p));
    patch?.style.setProperty("--after", String(0.1 + p * 0.85));
    if (label) label.textContent = `\u5bf9\u6bd4\uff1a${Math.round(v)}%`;
  };
  slider.addEventListener("input", () => {
    apply();
    beep(420, 0.012, "sine", 0.012);
  });
  apply();
}

async function handleCompareConfirm() {
  if (state.exp2Done) return;
  if (state.track !== "whitening") return;
  const v = Number($("#compareSlider")?.value || 0);
  if (v < 80) {
    haptic(12);
    beep(220, 0.06, "sawtooth", 0.02);
    openModal({
      title: "\u8bfb\u6570\u4e0d\u8db3",
      bodyHtml: `<p>\u518d\u6162\u4e00\u70b9\uff1a\u628a\u5bf9\u6bd4\u63a8\u5230 <strong>80%</strong> \u4ee5\u4e0a\uff0c\u624d\u80fd\u770b\u89c1\u53ef\u89c6\u9608\u503c\u3002</p>`,
    });
    return;
  }
  state.results.exp2 = exp2ResultWhitening(v);
  await completeExp2(false);
}

async function goGenerating() {
  showScreen("generating");
  const bar = $("#genBar");
  bar.style.setProperty("--p", "0%");
  updateReportCard();

  for (let i = 0; i <= 10; i++) {
    bar.style.setProperty("--p", `${i * 10}%`);
    await sleep(90 + Math.random() * 50);
  }
  await sleep(220);
  showScreen("report");
  haptic(18);
  beep(920, 0.08, "triangle", 0.035);
}

function restart() {
  state.goalKey = "";
  state.track = "";
  state.exp1Done = false;
  state.exp2Done = false;
  state.results.exp1 = null;
  state.results.exp2 = null;
  state.researcherId = "";
  $("#nickInput").value = "";
  setGoal("");

  $("#cell")?.classList.remove("cell--light");
  $("#holdBar")?.style.setProperty("--p", "0%");
  $("#underEyeDark")?.classList.remove("under-eye--improved");
  $("#underEyeWrinkle")?.classList.remove("under-eye--improved");

  showScreen("goal");
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

async function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 99) {
  const raw = String(text || "");
  const lines = [];
  for (const para of raw.split("\n")) {
    const chars = Array.from(para);
    let line = "";
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }
  lines.slice(0, maxLines).forEach((ln, i) => ctx.fillText(ln, x, y + i * lineHeight));
}

async function buildPosterBlob() {
  updateReportCard();
  const canvas = $("#posterCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#06070c");
  g.addColorStop(0.55, "#0b0b12");
  g.addColorStop(1, "#06060a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const g2 = ctx.createRadialGradient(W * 0.2, H * 0.18, 0, W * 0.2, H * 0.18, W * 0.8);
  g2.addColorStop(0, "rgba(207,174,98,0.22)");
  g2.addColorStop(1, "rgba(207,174,98,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  const cardX = 90;
  const cardY = 220;
  const cardW = W - 180;
  const cardH = 1020;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 44);
  ctx.fill();
  ctx.restore();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(207,174,98,0.35)";
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 44);
  ctx.stroke();

  const pad = 60;
  const x = cardX + pad;
  let y = cardY + 90;

  ctx.fillStyle = "rgba(207,174,98,0.92)";
  ctx.font = "900 56px system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText("\u529f\u6548\u770b\u89c1\u62a5\u544a", x, y);

  y += 70;
  ctx.fillStyle = "rgba(245,245,247,0.75)";
  ctx.font = "700 34px system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText(state.researcherId, x, y);

  y += 70;
  ctx.fillStyle = "rgba(245,245,247,0.72)";
  ctx.font = "700 30px system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText(`\u8def\u5f84\uff1a${TRACKS[state.track]?.label ?? "\u2014"}`, x, y);

  y += 84;
  const rows = [
    ["\u6211\u60f3\u770b\u89c1", GOALS[state.goalKey]?.label ?? "\u2014"],
    ["\u4eca\u65e5\u9a8c\u8bc1\u6210\u5206", $("#reportActives")?.textContent || "\u2014"],
    ["\u53ef\u89c1\u6570\u636e", $("#reportData")?.textContent || "\u2014"],
  ];

  for (const [k, v] of rows) {
    ctx.fillStyle = "rgba(245,245,247,0.70)";
    ctx.font = "700 30px system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
    ctx.fillText(k, x, y);
    ctx.fillStyle = "rgba(245,245,247,0.92)";
    ctx.font = "900 36px system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
    wrapText(ctx, v, x, y + 56, cardW - pad * 2, 46, 3);
    y += 190;
  }

  const quote = $("#reportQuote")?.textContent || QUOTES[0];
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  drawRoundedRect(ctx, x, cardY + cardH - 240, cardW - pad * 2, 140, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.stroke();

  ctx.fillStyle = "rgba(245,245,247,0.92)";
  ctx.font = "900 44px system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  wrapText(ctx, quote, x + 26, cardY + cardH - 165, cardW - pad * 2 - 52, 56, 2);

  try {
    const assetUrls = TRACKS[state.track]?.assets ?? [];
    const imgs = await Promise.all(assetUrls.map((u) => loadImg(u)));
    const baseY = cardY + cardH + 110;
    const startX = state.track === "eye" ? 390 : 150;
    const gap = 46;
    let px = startX;
    for (const img of imgs) {
      const w = 150;
      const h = (img.height / img.width) * w;
      ctx.globalAlpha = 0.96;
      ctx.drawImage(img, px, baseY - h, w, h);
      px += w + gap;
    }
    ctx.globalAlpha = 1;
  } catch {
    // ignore
  }

  ctx.fillStyle = "rgba(245,245,247,0.70)";
  ctx.font = "800 32px system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText("\u771f\u5b9e\u7684\u6539\u53d8\uff0c\u4ece\u6765\u4e0d\u6015\u88ab\u770b\u89c1\u3002", 90, H - 120);
  ctx.fillStyle = "rgba(245,245,247,0.50)";
  ctx.font = "600 24px system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText("\u6162\u4e00\u70b9\uff0c\u8fdc\u4e00\u70b9\uff5cHBN \u65f6\u95f4\u5b9e\u9a8c\u5ba4", 90, H - 78);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.92));
  if (!blob) throw new Error("poster toBlob null");
  return blob;
}

async function savePoster() {
  const blob = await buildPosterBlob();
  const fileName = `HBN_\u770b\u89c1\u62a5\u544a_${(state.researcherId || "\u7814\u7a76\u5458").replace(/[\\/:*?\"<>|]/g, "")}.png`;

  const file = new File([blob], fileName, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ title: "\u6211\u7684\u529f\u6548\u770b\u89c1\u62a5\u544a", text: "\u6162\u4e00\u70b9\uff0c\u8fdc\u4e00\u70b9\uff5c\u6765\u505a\u4e00\u6b21\u529f\u6548\u9a8c\u8bc1", files: [file] });
      return;
    } catch {
      // fall through
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      ta.remove();
      return false;
    }
  }
}

async function shareLink() {
  const shareData = {
    title: "\u6211\u5728HBN\u65f6\u95f4\u5b9e\u9a8c\u5ba4\uff0c\u770b\u89c1\u4e86\u771f\u5b9e\u7684\u6539\u53d8",
    text: "\u6162\u4e00\u70b9\uff0c\u8fdc\u4e00\u70b9\uff5c\u6765\u505a\u4e00\u6b21\u529f\u6548\u9a8c\u8bc1\uff0c\u751f\u6210\u4f60\u7684\u770b\u89c1\u62a5\u544a",
    url: location.href,
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch {
      // ignore
    }
  }
  await copyToClipboard(location.href);
  openModal({
    title: "\u5df2\u590d\u5236\u94fe\u63a5",
    bodyHtml: `<p>\u5df2\u590d\u5236\u5f53\u524d\u9875\u9762\u94fe\u63a5\uff0c\u53ef\u7c98\u8d34\u5230\u5fae\u4fe1/\u670b\u53cb\u5708/\u7fa4\u804a\u5206\u4eab\u3002</p>`,
  });
}

function initNightSlider() {
  const slider = $("#nightSlider");
  if (!slider || slider.dataset.bound === "1") return;
  slider.dataset.bound = "1";
  const eye = $("#nightEye");
  const label = $("#nightLabel");

  const apply = () => {
    const h = Number(slider.value || 0);
    if (label) label.textContent = `\u65f6\u95f4\uff1a${h}h`;
    const dark = clamp(0.55 + h * 0.03, 0.55, 0.88);
    const wrinkle = clamp(0.22 + h * 0.02, 0.22, 0.56);
    eye?.style.setProperty("--dark", String(dark));
    eye?.style.setProperty("--wrinkle", String(wrinkle));
  };
  slider.addEventListener("input", () => {
    apply();
    beep(380, 0.015, "sine", 0.012);
  });
  apply();
}

function initCompareSlider() {
  const slider = $("#compareSlider");
  if (!slider || slider.dataset.bound === "1") return;
  slider.dataset.bound = "1";
  const patch = $("#comparePatch");
  const label = $("#compareLabel");

  const apply = () => {
    const v = Number(slider.value || 0);
    const p = clamp(v / 100, 0, 1);
    patch?.style.setProperty("--p", String(p));
    patch?.style.setProperty("--after", String(0.1 + p * 0.85));
    if (label) label.textContent = `\u5bf9\u6bd4\uff1a${Math.round(v)}%`;
  };
  slider.addEventListener("input", () => {
    apply();
    beep(420, 0.012, "sine", 0.012);
  });
  apply();
}

function configureExp1UI() {
  const t = state.track || GOALS[state.goalKey]?.track || "whitening";
  state.track = t;
  const title = $("#exp1Title");
  const hint = $("#exp1Hint");

  $("#exp1Whitening")?.classList.toggle("variant--active", t === "whitening");
  $("#exp1Eye")?.classList.toggle("variant--active", t === "eye");

  if (title && hint) {
    if (t === "whitening") {
      title.textContent = "\u5b9e\u9a8c 1\uff1a\u9ed1\u8272\u7d20\u6291\u5236\u9a8c\u8bc1\uff08\u6c34\u4e73\u7cbe\u534e\u8def\u5f84\uff09";
      hint.textContent = "\u8bf7\u957f\u6309\u300c\u03b1-\u718a\u679c\u82f7\u5206\u5b50\u300d\uff0c\u4fdd\u6301\u7a33\u5b9a\u53cd\u5e94\uff083 \u79d2\uff09\u3002";
    } else {
      title.textContent = "\u5b9e\u9a8c 1\uff1a\u901a\u5bb5\u773c\u5468\u53d8\u5316\uff08\u773c\u971c\u8def\u5f84\u00b7\u65f6\u95f4\u8f74\u6a21\u62df\uff09";
      hint.textContent = "\u62d6\u52a8\u65f6\u95f4\u8f74\uff0c\u5148\u300c\u770b\u89c1\u300d\u95ee\u9898\uff1b\u518d\u8fdb\u5165\u4e0b\u4e00\u6b65\u9a8c\u8bc1\u3002";
      initNightSlider();
    }
  }
}

function configureExp2UI() {
  const t = state.track || GOALS[state.goalKey]?.track || "whitening";
  state.track = t;
  const title = $("#exp2Title");
  const hint = $("#exp2Hint");

  $("#exp2Whitening")?.classList.toggle("variant--active", t === "whitening");
  $("#exp2Eye")?.classList.toggle("variant--active", t === "eye");

  if (title && hint) {
    if (t === "whitening") {
      title.textContent = "\u5b9e\u9a8c 2\uff1a\u53ef\u89c6\u8bfb\u6570\u9a8c\u8bc1\uff08\u6c34\u4e73\u7cbe\u534e\u8def\u5f84\u00b7\u5bf9\u6bd4\u6ed1\u6746\uff09";
      hint.textContent = "\u628a\u5bf9\u6bd4\u6ed1\u6746\u63a8\u5230\u300c\u53ef\u89c6\u9608\u503c\u300d\uff0880% \u4ee5\u4e0a\uff09\uff0c\u518d\u786e\u8ba4\u8bfb\u6570\u3002";
      initCompareSlider();
    } else {
      title.textContent = "\u5b9e\u9a8c 2\uff1a\u773c\u5468\u4fee\u62a4\u9a8c\u8bc1\uff08\u773c\u971c\u8def\u5f84\u00b7\u62d6\u62fd\u6295\u653e\uff09";
      hint.textContent = "\u628a\u6210\u5206\u62d6\u5230\u773c\u5468\u533a\u57df\uff0c\u542f\u52a8\u4fee\u62a4\u53cd\u5e94\u3002";
    }
  }
}

function configureLabUI() {
  const t = state.track || GOALS[state.goalKey]?.track || "whitening";
  state.track = t;

  const exp1Title = $("#labExp1Title");
  const exp1Meta = $("#labExp1Meta");
  const exp2Title = $("#labExp2Title");
  const exp2Meta = $("#labExp2Meta");
  if (!exp1Title || !exp1Meta || !exp2Title || !exp2Meta) return;

  if (t === "whitening") {
    exp1Title.textContent = "\u9ed1\u8272\u7d20\u6291\u5236\u9a8c\u8bc1";
    exp1Meta.textContent = "\u957f\u63093\u79d2\u7a33\u5b9a\u53cd\u5e94 \u00b7 \u770b\u89c1\u53d8\u6de1";
    exp2Title.textContent = "\u53ef\u89c6\u8bfb\u6570\u9a8c\u8bc1";
    exp2Meta.textContent = "\u5bf9\u6bd4\u6ed1\u6746\u5230\u9608\u503c \u00b7 \u770b\u89c1\u63d0\u4eae/\u75d8\u5370\u89c2\u611f\u6539\u5584";
  } else {
    exp1Title.textContent = "\u901a\u5bb5\u773c\u5468\u53d8\u5316\u6a21\u62df";
    exp1Meta.textContent = "\u62d6\u52a8\u65f6\u95f4\u8f74 \u00b7 \u5148\u770b\u89c1\u95ee\u9898";
    exp2Title.textContent = "\u773c\u5468\u4fee\u62a4\u9a8c\u8bc1";
    exp2Meta.textContent = "\u62d6\u62fd\u6295\u653e\u6210\u5206 \u00b7 \u770b\u89c1\u7115\u4eae/\u6de1\u7eb9";
  }
}

async function init() {
  bindGlobalActions();
  bindExp1Hold();
  bindExp2Drag();
  await preloadAssets();
  showScreen("cover");
  beep(660, 0.05, "sine", 0.02);
}

window.addEventListener("DOMContentLoaded", () => {
  init().catch((err) => {
    console.error(err);
    showScreen("cover");
  });
});
