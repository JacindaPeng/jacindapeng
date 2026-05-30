const screens = Array.from(document.querySelectorAll(".screen"));
const dots = document.getElementById("pageDots");
const toast = document.getElementById("toast");

const state = {
  screen: 0,
  role: "",
  mood: "",
  flavor: "",
  joy: 0,
  combo: 0,
  timeLeft: 10,
};

const roleMap = {
  kid: {
    tag: "童心未下线",
    title: "糖纸收藏型快乐星人",
    preview: "检测到：小卖部快乐DNA正在发光",
    desc: "你总能在普通日子里发现小卖部级别的惊喜，一口AD就能召回满格童心。",
  },
  teen: {
    tag: "操场追风",
    title: "下课铃回血玩家",
    preview: "检测到：操场风速超标，快乐即将起飞",
    desc: "你的快乐像操场上的风，来得很快也很亮，酸酸甜甜就是你的启动音。",
  },
  student: {
    tag: "DDL冲刺",
    title: "酸甜重启研究员",
    preview: "检测到：大脑需要一口酸甜重启",
    desc: "你擅长在压力里给自己按暂停键，喝一口AD，把大脑切回可爱频道。",
  },
  grown: {
    tag: "生活玩家",
    title: "成熟但可爱的大人",
    preview: "检测到：大人模式里藏着一颗童心",
    desc: "你把童心藏得很好，但它一直都在；AD钙奶负责把它轻轻叫出来。",
  },
};

const moodMap = {
  recharge: { tag: "回血", word: "今天也要满格复活", radar: "回血信号已锁定：建议补充一口经典酸甜" },
  spark: { tag: "闪亮", word: "把可爱开到最大声", radar: "闪亮信号已锁定：可爱值正在飙升" },
  soft: { tag: "温柔", word: "被酸甜轻轻抱一下", radar: "温柔信号已锁定：需要一层蜜桃滤镜" },
  brave: { tag: "勇敢", word: "给自己一个出发按钮", radar: "勇敢信号已锁定：准备发射快乐火箭" },
};

const flavorMap = {
  original: {
    tag: "原味AD",
    name: "原味AD钙奶",
    image: "./assets/ad-original.webp",
    color: "#ed1c24",
    line: "经典酸甜，一秒回到无忧童年。",
  },
  strawberry: {
    tag: "草莓AD",
    name: "草莓味AD钙奶",
    image: "./assets/ad-strawberry.webp",
    color: "#ff5b8d",
    line: "草莓可爱暴击，给今日份心情加糖。",
  },
  peach: {
    tag: "蜜桃AD",
    name: "蜜桃味AD钙奶",
    image: "./assets/ad-peach.webp",
    color: "#ff9b70",
    line: "蜜桃温柔滤镜，适合慢慢回血。",
  },
  lactobacillus: {
    tag: "乳酸菌AD",
    name: "乳酸菌AD钙奶",
    image: "./assets/ad-lactobacillus.webp",
    color: "#2773de",
    line: "轻盈元气上线，把状态调到刚刚好。",
  },
  collagen: {
    tag: "胶原AD",
    name: "胶原蛋白AD钙奶",
    image: "./assets/ad-collagen.webp",
    color: "#d855c2",
    line: "闪亮buff补给，今天也要漂亮出场。",
  },
};

let gameTimer = 0;
let spawnTimer = 0;
let countdownTimer = 0;

function initDots() {
  dots.innerHTML = screens.map((_, index) => `<span class="${index === 0 ? "is-active" : ""}"></span>`).join("");
}

function initStickers() {
  const container = document.getElementById("stickerRain");
  const labels = ["AD", "30", "酸甜", "快乐", "钙", "童心"];
  container.innerHTML = labels
    .map((label, index) => {
      const left = 6 + index * 16;
      const delay = -index * 1.4;
      const speed = 9 + (index % 3) * 2;
      const x = index % 2 ? "-1.2rem" : "1.4rem";
      return `<span style="left:${left}%;--speed:${speed}s;animation-delay:${delay}s;--x:${x}">${label}</span>`;
    })
    .join("");
}

function showScreen(index) {
  state.screen = index;
  screens.forEach((screen, screenIndex) => {
    screen.classList.toggle("is-active", screenIndex === index);
  });
  Array.from(dots.children).forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
  if (index === 5) {
    renderResult();
    burstConfetti(document.getElementById("resultCard"), 24);
  }
}

function enableNext(screen) {
  const nextButton = screen.querySelector("[data-next]");
  if (!nextButton) return;
  nextButton.disabled = false;
  nextButton.classList.remove("is-disabled");
}

function selectChoice(group, value, button) {
  state[group] = value;
  const wrapper = button.closest("[data-choice-group]");
  wrapper.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
  button.classList.add("is-selected");
  enableNext(button.closest(".screen"));

  if (group === "role") updateRolePreview(value);
  if (group === "mood") updateMoodRadar(value);
  if (group === "flavor") updateFlavorSpotlight(value);
}

function updateRolePreview(value) {
  const role = roleMap[value];
  const preview = document.getElementById("rolePreview");
  preview.innerHTML = `<span>${role.tag}</span><strong>${role.preview}</strong>`;
  showToast("童心频率已捕捉");
}

function updateMoodRadar(value) {
  const mood = moodMap[value];
  document.getElementById("radarText").textContent = mood.radar;
  document.getElementById("radarFace").animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.14)" },
      { transform: "scale(1)" },
    ],
    { duration: 360, easing: "ease-out" },
  );
}

function updateFlavorSpotlight(value) {
  const flavor = flavorMap[value];
  document.documentElement.style.setProperty("--red", flavor.color);
  document.getElementById("spotlightImage").src = flavor.image;
  document.getElementById("spotlightTitle").textContent = flavor.name;
  document.getElementById("spotlightDesc").textContent = flavor.line;
  showToast(`${flavor.tag} 已加入快乐配方`);
}

function updateJoy(points, sourceElement) {
  state.joy = Math.min(30, state.joy + points);
  document.getElementById("joyScore").textContent = state.joy;
  document.getElementById("joyBar").style.width = `${(state.joy / 30) * 100}%`;
  if (points > 0) {
    state.combo += 1;
    document.getElementById("comboText").textContent = `COMBO x${state.combo}`;
    if (sourceElement) showPopScore(sourceElement, `+${points}`);
  }
  if (state.joy >= 30) {
    finishGame();
  }
}

function spawnBubble() {
  const area = document.getElementById("gameArea");
  const bubble = document.createElement("button");
  const labels = ["A", "D", "钙", "甜", "乐", "30"];
  const bonus = Math.random() > 0.72;
  bubble.type = "button";
  bubble.className = `joy-bubble${bonus ? " is-bonus" : ""}`;
  bubble.textContent = bonus ? "暴击" : labels[Math.floor(Math.random() * labels.length)];
  bubble.style.left = `${8 + Math.random() * 74}%`;
  bubble.style.top = `${10 + Math.random() * 68}%`;
  bubble.style.setProperty("--size", `${bonus ? 4.15 : 3 + Math.random() * 0.9}rem`);
  bubble.addEventListener("click", () => {
    const points = bonus ? 8 : 3 + Math.floor(Math.random() * 4);
    updateJoy(points, bubble);
    bubble.remove();
    if (bonus) burstConfetti(area, 10);
  });
  area.appendChild(bubble);
  setTimeout(() => bubble.remove(), bonus ? 1700 : 2300);
}

function startGame() {
  const startButton = document.getElementById("gameStart");
  state.joy = 0;
  state.combo = 0;
  state.timeLeft = 10;
  document.getElementById("joyScore").textContent = "0";
  document.getElementById("joyBar").style.width = "0%";
  document.getElementById("comboText").textContent = "COMBO x0";
  document.getElementById("timerText").textContent = "10s";
  startButton.style.display = "none";
  clearInterval(spawnTimer);
  clearInterval(countdownTimer);
  clearTimeout(gameTimer);

  for (let i = 0; i < 8; i += 1) {
    setTimeout(spawnBubble, i * 160);
  }
  spawnTimer = setInterval(spawnBubble, 480);
  countdownTimer = setInterval(() => {
    state.timeLeft = Math.max(0, state.timeLeft - 1);
    document.getElementById("timerText").textContent = `${state.timeLeft}s`;
  }, 1000);
  gameTimer = setTimeout(() => {
    if (state.joy < 30) {
      updateJoy(30 - state.joy);
      showToast("快乐值已自动补满，生成你的快乐卡！");
    }
  }, 10000);
}

function finishGame() {
  clearInterval(spawnTimer);
  clearInterval(countdownTimer);
  clearTimeout(gameTimer);
  document.querySelectorAll(".joy-bubble").forEach((bubble) => bubble.remove());
  showToast("快乐值满格！正在生成专属快乐卡");
  setTimeout(() => showScreen(5), 650);
}

function renderResult() {
  const role = roleMap[state.role] || roleMap.kid;
  const mood = moodMap[state.mood] || moodMap.recharge;
  const flavor = flavorMap[state.flavor] || flavorMap.original;
  document.documentElement.style.setProperty("--red", flavor.color);
  document.getElementById("resultBottle").src = flavor.image;
  document.getElementById("personaTitle").textContent = role.title;
  document.getElementById("personaDesc").textContent = `${role.desc}${flavor.line}`;
  document.getElementById("roleTag").textContent = role.tag;
  document.getElementById("moodTag").textContent = mood.tag;
  document.getElementById("flavorTag").textContent = flavor.tag;
  document.getElementById("shareLine").textContent = `我的今日AD搭子是「${flavor.name}」：${mood.word}。不管几岁，快乐万岁！`;
}

function shareResult() {
  const role = roleMap[state.role] || roleMap.kid;
  const flavor = flavorMap[state.flavor] || flavorMap.original;
  const text = `我测出了「${role.title}」，今日AD搭子是${flavor.name}。不管几岁，快乐万岁！`;
  if (navigator.share) {
    navigator.share({
      title: "娃哈哈AD钙奶快乐补给站",
      text,
      url: window.location.href,
    }).catch(() => {});
    return;
  }
  navigator.clipboard?.writeText(`${text} ${window.location.href}`);
  showToast("分享文案已复制，快发给朋友一起测！");
}

function restart() {
  state.role = "";
  state.mood = "";
  state.flavor = "";
  state.joy = 0;
  state.combo = 0;
  state.timeLeft = 10;
  document.documentElement.style.setProperty("--red", "#ed1c24");
  document.querySelectorAll(".is-selected").forEach((item) => item.classList.remove("is-selected"));
  document.querySelectorAll("[data-next]").forEach((button, index) => {
    if (index === 0) return;
    button.disabled = true;
    button.classList.add("is-disabled");
  });
  document.getElementById("rolePreview").innerHTML = "<span>点击身份卡</span><strong>解锁你的童心频率</strong>";
  document.getElementById("radarText").textContent = "等待接收你的心情信号";
  document.getElementById("spotlightImage").src = "./assets/ad-original.webp";
  document.getElementById("spotlightTitle").textContent = "先选一瓶AD钙奶";
  document.getElementById("spotlightDesc").textContent = "被选中的口味会点亮你的快乐卡。";
  document.getElementById("gameStart").style.display = "block";
  document.getElementById("joyScore").textContent = "0";
  document.getElementById("joyBar").style.width = "0%";
  document.getElementById("comboText").textContent = "COMBO x0";
  document.getElementById("timerText").textContent = "10s";
  showScreen(0);
}

function showPopScore(sourceElement, text) {
  const area = document.getElementById("gameArea");
  const score = document.createElement("span");
  const sourceRect = sourceElement.getBoundingClientRect();
  const areaRect = area.getBoundingClientRect();
  score.className = "pop-score";
  score.textContent = text;
  score.style.left = `${sourceRect.left - areaRect.left + sourceRect.width / 2}px`;
  score.style.top = `${sourceRect.top - areaRect.top}px`;
  area.appendChild(score);
  setTimeout(() => score.remove(), 760);
}

function burstConfetti(container, count) {
  const colors = ["#ed1c24", "#ffd64f", "#2266d8", "#ff79a8", "#ffb47e"];
  const rect = container.getBoundingClientRect();
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${rect.width / 2}px`;
    piece.style.top = `${rect.height / 2}px`;
    piece.style.setProperty("--dx", `${Math.random() * 180 - 90}px`);
    piece.style.setProperty("--dy", `${Math.random() * 160 - 90}px`);
    piece.style.setProperty("--confetti-color", colors[i % colors.length]);
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 900);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function bindDeviceMotion() {
  let lastBoost = 0;
  window.addEventListener("devicemotion", (event) => {
    if (state.screen !== 4) return;
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    const power = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
    const now = Date.now();
    if (power > 32 && now - lastBoost > 900) {
      lastBoost = now;
      updateJoy(5);
      showToast("摇到快乐+5");
    }
  });
}

document.addEventListener("click", (event) => {
  const nextButton = event.target.closest("[data-next]");
  if (nextButton && !nextButton.disabled) {
    showScreen(Math.min(state.screen + 1, screens.length - 1));
  }

  const choiceButton = event.target.closest("[data-choice-group] button");
  if (choiceButton) {
    const group = choiceButton.closest("[data-choice-group]").dataset.choiceGroup;
    selectChoice(group, choiceButton.dataset.value, choiceButton);
  }
});

document.getElementById("gameStart").addEventListener("click", startGame);
document.getElementById("shakeBoost").addEventListener("click", () => {
  if (state.screen === 4) updateJoy(5);
});
document.getElementById("shareBtn").addEventListener("click", shareResult);
document.getElementById("restartBtn").addEventListener("click", restart);

initDots();
initStickers();
bindDeviceMotion();
