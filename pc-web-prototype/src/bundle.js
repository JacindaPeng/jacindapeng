// SANFU PC Web Prototype bundle (no ES modules; works on file://)
(() => {
  const styleTags = [
    { key: "甜酷", hot: true },
    { key: "潮流", hot: true },
    { key: "街头", hot: false },
    { key: "Y2K", hot: false },
    { key: "通勤辣", hot: true },
    { key: "学院潮", hot: false },
    { key: "音乐节", hot: false },
    { key: "Clean Fit", hot: false },
  ];

  const scenes = ["通勤", "约会", "周末出街", "音乐节", "出游", "开学"];

  const products = [
    {
      id: "p-1001",
      name: "甜酷短款皮衣（亮面黑）",
      price: 199,
      tags: ["甜酷", "潮流", "街头"],
      colors: ["亮面黑", "奶油白"],
      sizes: ["S", "M", "L"],
      stock: { online: true, store: true },
    },
    {
      id: "p-1002",
      name: "高腰A字牛仔短裙（复古蓝）",
      price: 129,
      tags: ["Y2K", "甜酷"],
      colors: ["复古蓝", "深灰"],
      sizes: ["S", "M", "L"],
      stock: { online: true, store: true },
    },
    {
      id: "p-1003",
      name: "荧光细节运动背心（黑粉）",
      price: 79,
      tags: ["潮流", "音乐节"],
      colors: ["黑粉", "黑绿"],
      sizes: ["S", "M", "L"],
      stock: { online: true, store: false },
    },
    {
      id: "p-1004",
      name: "通勤辣修身西装外套（炭灰）",
      price: 239,
      tags: ["通勤辣", "Clean Fit"],
      colors: ["炭灰", "米白"],
      sizes: ["S", "M", "L", "XL"],
      stock: { online: true, store: true },
    },
    {
      id: "p-1005",
      name: "厚底老爹鞋（奶白）",
      price: 169,
      tags: ["潮流", "学院潮"],
      colors: ["奶白", "黑白"],
      sizes: ["35", "36", "37", "38", "39"],
      stock: { online: true, store: true },
    },
    {
      id: "p-1006",
      name: "金属感链条包（银）",
      price: 89,
      tags: ["甜酷", "潮流"],
      colors: ["银", "黑"],
      sizes: ["均码"],
      stock: { online: true, store: true },
    },
  ];

  const outfits = [
    {
      id: "o-2001",
      title: "甜酷但不装，通勤也能辣。",
      scene: "通勤",
      budget: 450,
      tags: ["甜酷", "通勤辣", "潮流"],
      items: ["p-1004", "p-1002", "p-1006"],
      story: [
        "想要上班不费脑，又想保留一点“辣”的锋利感。",
        "用修身西装做骨架，短裙拉高比例，银链条包把甜酷点亮。",
        "不需要夸张配色，靠材质对比就很出片。",
      ],
    },
    {
      id: "o-2002",
      title: "周末出街：黑白酷感 + 荧光一点点。",
      scene: "周末出街",
      budget: 420,
      tags: ["潮流", "街头", "音乐节"],
      items: ["p-1001", "p-1003", "p-1005"],
      story: [
        "黑白是最稳的潮流底盘，荧光细节负责“记忆点”。",
        "短款皮衣把上半身收紧，厚底鞋拉长腿，走路带风。",
        "拍照时只要一个侧身，就会很像杂志封面。",
      ],
    },
    {
      id: "o-2003",
      title: "开学第一周：甜酷学院感，干净又有态度。",
      scene: "开学",
      budget: 390,
      tags: ["学院潮", "甜酷", "Clean Fit"],
      items: ["p-1002", "p-1005", "p-1006"],
      story: [
        "学院感不用乖，关键是“干净”和“比例”。",
        "牛仔短裙配厚底鞋显腿长，链条包加一点金属感就够酷。",
        "适合早八，也适合放学去逛街。",
      ],
    },
  ];

  const stores = [
    {
      id: "s-3001",
      name: "三福｜上海南京东路店",
      city: "上海",
      distanceKm: 1.2,
      open: true,
      highlights: ["本店限定搭配", "打卡得券", "上新快闪"],
      hasTryOn: true,
      hasStock: true,
    },
    {
      id: "s-3002",
      name: "三福｜上海五角场店",
      city: "上海",
      distanceKm: 3.8,
      open: true,
      highlights: ["店员私藏榜", "学生党专区"],
      hasTryOn: true,
      hasStock: true,
    },
    {
      id: "s-3003",
      name: "三福｜上海静安大悦城店",
      city: "上海",
      distanceKm: 5.4,
      open: false,
      highlights: ["到店解锁限定搭配"],
      hasTryOn: false,
      hasStock: true,
    },
  ];

  const KEY = "sanfu_proto_state_v1";
  function safeParse(json, fallback) {
    try {
      const v = JSON.parse(json);
      return v && typeof v === "object" ? v : fallback;
    } catch {
      return fallback;
    }
  }
  function loadState() {
    const raw = localStorage.getItem(KEY);
    const base = {
      liked: [],
      bag: [],
      compare: [],
      profile: { budget: 400, scene: "通勤", tags: ["甜酷", "潮流"] },
      location: { city: "上海" },
    };
    if (!raw) return base;
    const parsed = safeParse(raw, base);
    return { ...base, ...parsed };
  }
  function saveState(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  function toggleInList(list, id) {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }
  function addUnique(list, id, max = Infinity) {
    const next = list.includes(id) ? list : [...list, id];
    if (next.length <= max) return next;
    return next.slice(next.length - max);
  }

  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function mount(root, node) {
    root.innerHTML = "";
    root.appendChild(node);
  }
  function on(elm, event, selector, handler) {
    elm.addEventListener(event, (e) => {
      const target = e.target.closest(selector);
      if (!target || !elm.contains(target)) return;
      handler(e, target);
    });
  }

  const app = document.querySelector("#app");
  let state = loadState();

  function toast(msg) {
    let t = document.querySelector("#toast");
    if (!t) {
      t = el(`<div id="toast" class="toast hidden"></div>`);
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => t.classList.add("hidden"), 1700);
  }

  function icon(name) {
    const map = {
      bag: "🛍️",
      heart: "♡",
      compare: "⇄",
      store: "⌁",
      user: "⟡",
      search: "⌕",
      close: "✕",
    };
    return map[name] ?? "•";
  }

  function qs(routeKey) {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, query] = h.split("?");
    if (routeKey && path !== routeKey) return null;
    const params = new URLSearchParams(query || "");
    return { path, params };
  }
  function navTo(path, params = {}) {
    const p = new URLSearchParams(params);
    location.hash = `#/${path}${p.toString() ? `?${p.toString()}` : ""}`;
  }

  function getProduct(id) {
    return products.find((p) => p.id === id);
  }
  function money(n) {
    return `¥${Number(n).toFixed(0)}`;
  }

  function renderTopbar(active) {
    const nav = [
      ["home", "首页"],
      ["outfits", "搭配"],
      ["category", "分类"],
      ["ranking", "榜单"],
      ["stores", "门店"],
    ]
      .map(
        ([key, label]) =>
          `<a href="#/${key}" data-active="${key === active}">${label}</a>`
      )
      .join("");

    const node = el(`
      <div class="topbar">
        <div class="wrap inner">
          <a class="brand" href="#/home">
            <img src="./assets/logo.png" alt="SANFU" />
            <div>
              <div>三福 SANFU</div>
              <div class="muted" style="font-size:12px;margin-top:2px;">生活新「搭」案 · PC原型</div>
            </div>
          </a>
          <nav class="nav">${nav}</nav>
          <div class="search" role="search">
            <span class="muted">${icon("search")}</span>
            <input id="q" placeholder="搜风格 / 场景 / 单品 / 门店（如：甜酷 / 通勤 / 链条包 / 南京东路）" />
          </div>
          <button class="btn ghost" id="user">${icon("user")}</button>
          <button class="btn ghost" id="liked">${icon("heart")} <span class="muted" style="font-size:12px;">收藏</span></button>
          <button class="btn primary pink" id="bag">${icon("bag")} 购物袋</button>
        </div>
      </div>
    `);

    node.querySelector("#q").value = state._q || "";
    node.querySelector("#q").addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      state._q = e.target.value.trim();
      saveState(state);
      navTo("outfits", { q: state._q });
    });
    node.querySelector("#user").addEventListener("click", () => {
      toast("这里可接登录/会员体系（原型暂用本地状态）");
    });
    node.querySelector("#liked").addEventListener("click", () => {
      toast(`已收藏 ${state.liked.length} 件`);
    });
    node.querySelector("#bag").addEventListener("click", () => {
      toast(`购物袋 ${state.bag.length} 件（原型：不做结算页）`);
    });
    return node;
  }

  function renderToolbar() {
    const node = el(`
      <div class="toolbar" aria-label="快捷工具">
        <button class="tool" id="tool-compare" title="对比">
          ${icon("compare")}
          ${state.compare.length ? `<span class="badge">${state.compare.length}</span>` : ""}
        </button>
        <button class="tool" id="tool-like" title="收藏">${icon("heart")}${
          state.liked.length ? `<span class="badge">${state.liked.length}</span>` : ""
        }</button>
        <button class="tool" id="tool-bag" title="购物袋">${icon("bag")}${
          state.bag.length ? `<span class="badge">${state.bag.length}</span>` : ""
        }</button>
        <button class="tool" id="tool-store" title="附近门店">${icon("store")}</button>
      </div>
    `);
    node.querySelector("#tool-compare").addEventListener("click", () => {
      if (!state.compare.length) return toast("先在列表里点“+对比”选 1–4 件");
      toggleCompareDrawer(true);
    });
    node.querySelector("#tool-like").addEventListener("click", () =>
      toast(`收藏 ${state.liked.length} 件`)
    );
    node.querySelector("#tool-bag").addEventListener("click", () =>
      toast(`购物袋 ${state.bag.length} 件`)
    );
    node.querySelector("#tool-store").addEventListener("click", () => navTo("stores"));
    return node;
  }

  function renderCompareDrawer() {
    const node = el(`
      <div id="compareDrawer" class="drawer hidden" role="dialog" aria-label="对比抽屉">
        <div class="row between">
          <div>
            <div style="font-weight:900;">对比抽屉</div>
            <div class="muted" style="font-size:12px;margin-top:2px;">最多 4 件：价格/风格/尺码/到店有货</div>
          </div>
          <div class="row">
            <button class="btn" id="goCompare">查看对比</button>
            <button class="btn" id="clearCompare">清空</button>
            <button class="btn" id="closeCompare">${icon("close")}</button>
          </div>
        </div>
        <div class="items" style="margin-top:10px;"></div>
      </div>
    `);
    node.querySelector("#closeCompare").addEventListener("click", () => toggleCompareDrawer(false));
    node.querySelector("#clearCompare").addEventListener("click", () => {
      state.compare = [];
      saveState(state);
      toast("已清空对比");
      rerender();
    });
    node.querySelector("#goCompare").addEventListener("click", () => {
      navTo("compare");
    });
    return node;
  }

  function toggleCompareDrawer(open) {
    const d = document.querySelector("#compareDrawer");
    if (!d) return;
    d.classList.toggle("hidden", !open);
  }

  function updateCompareDrawer() {
    const d = document.querySelector("#compareDrawer");
    if (!d) return;
    const items = d.querySelector(".items");
    items.innerHTML = "";
    state.compare.forEach((id) => {
      const p = getProduct(id);
      if (!p) return;
      const card = el(`
        <div class="miniCard">
          <div class="miniThumb" aria-hidden="true"></div>
          <div>
            <div style="font-weight:800;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(
              p.name
            )}</div>
            <div class="muted" style="font-size:12px;margin-top:2px;">${money(
              p.price
            )} · ${p.stock.store ? "门店可试穿" : "仅线上"}</div>
          </div>
          <button class="btn" data-remove="${p.id}">移除</button>
        </div>
      `);
      card.querySelector("[data-remove]").addEventListener("click", () => {
        state.compare = state.compare.filter((x) => x !== p.id);
        saveState(state);
        rerender();
        toast("已移除");
      });
      items.appendChild(card);
    });
  }

  function pageShell(active, contentNode) {
    const root = document.createElement("div");
    root.appendChild(renderTopbar(active));
    root.appendChild(renderToolbar());
    root.appendChild(renderCompareDrawer());
    root.appendChild(contentNode);
    setTimeout(updateCompareDrawer, 0);
    return root;
  }

  function OutfitPost(o) {
    const node = el(`
      <article class="post" data-id="${escapeHtml(o.id)}">
        <div class="img" aria-hidden="true"></div>
        <div class="body">
          <h3>${escapeHtml(o.title)}</h3>
          <div class="meta">
            <span class="chip hot">${escapeHtml(o.scene)}</span>
            ${o.tags.slice(0, 3).map((t) => `<span class="chip">#${escapeHtml(t)}</span>`).join("")}
            <span class="chip">预算 ≤ ${money(o.budget)}</span>
          </div>
          <div class="muted" style="font-size:12px;margin-top:10px;">${escapeHtml(o.story[0])}</div>
          <div class="cta">
            <button class="btn primary pink" data-open>看详情</button>
            <button class="btn" data-bundle>一键成套</button>
          </div>
        </div>
      </article>
    `);
    node.querySelector("[data-open]").addEventListener("click", () => navTo("outfit", { id: o.id }));
    node.querySelector("[data-bundle]").addEventListener("click", () => {
      o.items.forEach((id) => (state.bag = addUnique(state.bag, id)));
      saveState(state);
      toast("已加入购物袋（可在右上角查看）");
      rerender();
    });
    return node;
  }

  function HomePage() {
    const quick = [
      { label: "搭配测一测", action: () => navTo("outfits") },
      { label: "性价比榜", action: () => navTo("ranking", { tab: "value" }) },
      { label: "门店打卡", action: () => navTo("stores") },
      { label: "本周挑战", action: () => toast("挑战：收藏/成套/到店任一动作累计 3 次解锁券（原型演示）") },
    ];
    const hero = el(`
      <div class="wrap">
        <div class="hero">
          <div class="content">
            <div>
              <div class="row" style="flex-wrap:wrap;gap:10px;margin-bottom:12px;">
                <span class="chip hot">#甜酷</span>
                <span class="chip hot">#潮流</span>
                <span class="chip">#本周上新</span>
                <span class="chip">#到店解锁限定搭配</span>
              </div>
              <h1>生活新「搭」案：<br/>不费脑，也要很出片</h1>
              <p>内容优先的穿搭社区体验：先给灵感与情绪，再让“一键成套 / 到店试穿”变得顺手。</p>
              <div class="row" style="flex-wrap:wrap;">
                ${quick.map((q, i) => `<button class="btn ${i===1?"":"ghost"}" data-q="${i}">${escapeHtml(q.label)}</button>`).join("")}
                <button class="btn primary pink" id="goOutfits">直接逛搭配</button>
              </div>
            </div>
            <div class="card pad">
              <div class="row between">
                <div>
                  <div class="card-title">今日穿搭卡</div>
                  <div class="muted" style="font-size:12px;margin-top:4px;">3–5 件成套可勾选，一键加入购物袋</div>
                </div>
                <span class="chip hot">推荐</span>
              </div>
              <div class="subtle" style="padding:12px;margin-top:12px;">
                <div style="font-weight:900;">${escapeHtml(outfits[0].title)}</div>
                <div class="muted" style="font-size:12px;margin-top:6px;">场景：${escapeHtml(outfits[0].scene)} · 预算：≤ ${money(outfits[0].budget)}</div>
                <div class="row" style="flex-wrap:wrap;margin-top:10px;gap:8px;">
                  ${outfits[0].items.map((id) => getProduct(id)).filter(Boolean).map((p) => `<span class="chip">${escapeHtml(p.name.split("（")[0])}</span>`).join("")}
                </div>
                <div class="row" style="margin-top:12px;">
                  <button class="btn primary pink" id="openOutfit">看这套</button>
                  <button class="btn" id="bundleAdd">一键成套加入</button>
                </div>
              </div>
              <div class="sep" style="height:1px;background:var(--line);margin:14px 0;"></div>
              <div class="row between">
                <div>
                  <div style="font-weight:900;">附近门店正在发生</div>
                  <div class="muted" style="font-size:12px;margin-top:4px;">打卡得券 · 本店限定搭配 · 试穿服务</div>
                </div>
                <button class="btn" id="goStores">去门店</button>
              </div>
              <div class="cards2" style="margin-top:12px;">
                ${stores.slice(0,2).map(s => `
                  <div class="card pad" style="box-shadow:none;">
                    <div style="font-weight:900;">${escapeHtml(s.name)}</div>
                    <div class="muted" style="font-size:12px;margin-top:6px;">${s.open ? "营业中" : "已打烊"} · 距离 ${s.distanceKm}km</div>
                    <div class="row" style="flex-wrap:wrap;margin-top:10px;gap:8px;">
                      ${s.highlights.slice(0,2).map(h => `<span class="chip hot">${escapeHtml(h)}</span>`).join("")}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="row between">
            <h2>今日灵感</h2>
            <div class="muted" style="font-size:12px;">像杂志一样逛，像电商一样顺手</div>
          </div>
          <div class="cards3">
            ${[
              ["通勤辣｜不费脑抄作业", "通勤"],
              ["周末出街｜黑白酷感+一点荧光", "周末出街"],
              ["开学｜甜酷学院感，干净有态度", "开学"],
            ].map(([t, s]) => `
              <div class="card pad" data-scene="${escapeHtml(s)}">
                <div class="row between">
                  <div style="font-weight:900;">${escapeHtml(t)}</div>
                  <span class="chip hot">进入</span>
                </div>
                <div class="muted" style="font-size:12px;margin-top:10px;">点击进入对应场景的搭配流</div>
              </div>`).join("")}
          </div>
        </div>

        <div class="section">
          <div class="row between">
            <h2>社区内容流</h2>
            <div class="row" style="flex-wrap:wrap;">
              ${styleTags.slice(0, 6).map((t) => `<span class="pill ${t.key==="潮流"?"lime":""}" data-tag="${escapeHtml(t.key)}" data-active="${state.profile.tags.includes(t.key)}"><span class="dot"></span>${escapeHtml(t.key)}</span>`).join("")}
            </div>
          </div>
          <div class="feed" id="homeFeed"></div>
        </div>
      </div>
    `);

    hero.querySelector("#goOutfits").addEventListener("click", () => navTo("outfits"));
    hero.querySelector("#openOutfit").addEventListener("click", () => navTo("outfit", { id: outfits[0].id }));
    hero.querySelector("#bundleAdd").addEventListener("click", () => {
      outfits[0].items.forEach((id) => (state.bag = addUnique(state.bag, id)));
      saveState(state);
      toast("已将这套加入购物袋");
      rerender();
    });
    hero.querySelector("#goStores").addEventListener("click", () => navTo("stores"));
    on(hero, "click", "[data-q]", (e, target) => quick[Number(target.dataset.q)].action());
    on(hero, "click", "[data-scene]", (e, target) => navTo("outfits", { scene: target.dataset.scene }));
    on(hero, "click", ".pill[data-tag]", (e, target) => {
      const tag = target.dataset.tag;
      state.profile.tags = toggleInList(state.profile.tags, tag);
      saveState(state);
      rerender();
    });

    const feed = hero.querySelector("#homeFeed");
    const matched = outfits.filter((o) => o.tags.some((t) => state.profile.tags.includes(t)));
    matched.forEach((o) => feed.appendChild(OutfitPost(o)));
    return pageShell("home", hero);
  }

  function OutfitPost(o) {
    const node = el(`
      <article class="post" data-id="${escapeHtml(o.id)}">
        <div class="img" aria-hidden="true"></div>
        <div class="body">
          <h3>${escapeHtml(o.title)}</h3>
          <div class="meta">
            <span class="chip hot">${escapeHtml(o.scene)}</span>
            ${o.tags
              .slice(0, 3)
              .map((t) => `<span class="chip">#${escapeHtml(t)}</span>`)
              .join("")}
            <span class="chip">预算 ≤ ${money(o.budget)}</span>
          </div>
          <div class="muted" style="font-size:12px;margin-top:10px;">${escapeHtml(
            o.story[0]
          )}</div>
          <div class="cta">
            <button class="btn primary pink" data-open>看详情</button>
            <button class="btn" data-bundle>一键成套</button>
          </div>
        </div>
      </article>
    `);
    node
      .querySelector("[data-open]")
      .addEventListener("click", () => navTo("outfit", { id: o.id }));
    node.querySelector("[data-bundle]").addEventListener("click", () => {
      o.items.forEach((id) => (state.bag = addUnique(state.bag, id)));
      saveState(state);
      toast("已加入购物袋（可在右上角查看）");
      rerender();
    });
    return node;
  }

  function OutfitsPage() {
    const parsed = qs("outfits") || { params: new URLSearchParams() };
    const params = parsed.params;
    const q = (params.get("q") || "").trim();
    const scene = params.get("scene") || state.profile.scene;

    const node = el(`
      <div class="wrap">
        <div class="section">
          <div class="row between">
            <h2>搭配 · 内容流</h2>
            <div class="muted" style="font-size:12px;">内容优先：先灵感，再成套</div>
          </div>
          <div class="layout">
            <aside class="panel">
              <div class="group">
                <h3>场景</h3>
                <div class="row" style="flex-wrap:wrap;">
                  ${scenes
                    .map(
                      (s) =>
                        `<span class="pill" data-scene="${escapeHtml(
                          s
                        )}" data-active="${s === scene}"><span class="dot"></span>${escapeHtml(
                          s
                        )}</span>`
                    )
                    .join("")}
                </div>
              </div>
              <div class="group">
                <h3>风格标签</h3>
                <div class="row" style="flex-wrap:wrap;">
                  ${styleTags
                    .map(
                      (t) =>
                        `<span class="pill ${
                          t.key === "潮流" ? "lime" : ""
                        }" data-tag="${escapeHtml(
                          t.key
                        )}" data-active="${state.profile.tags.includes(
                          t.key
                        )}"><span class="dot"></span>${escapeHtml(t.key)}</span>`
                    )
                    .join("")}
                </div>
                <div class="mini" style="margin-top:8px;">只在“可行动/可解锁/已选中”时用高对比点缀。</div>
              </div>
              <div class="group">
                <h3>预算（≤ ${money(state.profile.budget)}）</h3>
                <input id="budget" type="range" min="200" max="800" step="10" value="${
                  state.profile.budget
                }" style="width:100%;" />
                <div class="mini" style="margin-top:8px;">拖动后会即时筛选（原型演示）。</div>
              </div>
              <div class="group">
                <h3>本周挑战</h3>
                <div class="subtle" style="padding:12px;">
                  <div style="font-weight:900;">完成 3 次动作解锁券</div>
                  <div class="muted" style="font-size:12px;margin-top:6px;">收藏 / 成套加入 / 到店任一动作计 1 次</div>
                  <div class="row" style="margin-top:10px;">
                    <span class="chip hot">进度：${Math.min(
                      3,
                      Math.floor(
                        (state.liked.length + state.bag.length + state.compare.length) / 3
                      )
                    )}/3</span>
                    <button class="btn" id="challenge">查看规则</button>
                  </div>
                </div>
              </div>
            </aside>
            <main>
              ${
                q
                  ? `<div class="subtle" style="padding:12px 14px;margin-bottom:14px;"><b>搜索</b>：${escapeHtml(
                      q
                    )}（原型：匹配标题/标签）</div>`
                  : ""
              }
              <div class="feed" id="feed"></div>
            </main>
          </div>
        </div>
      </div>
    `);

    node.querySelector("#challenge").addEventListener("click", () =>
      toast("挑战：任一动作累计 3 次，解锁到店券/榜单专属价（原型文案）")
    );

    on(node, "click", ".pill[data-scene]", (e, t) => {
      state.profile.scene = t.dataset.scene;
      saveState(state);
      navTo("outfits", { scene: state.profile.scene, q: q || "" });
    });
    on(node, "click", ".pill[data-tag]", (e, t) => {
      state.profile.tags = toggleInList(state.profile.tags, t.dataset.tag);
      saveState(state);
      rerender();
    });
    node.querySelector("#budget").addEventListener("input", (e) => {
      state.profile.budget = Number(e.target.value);
      saveState(state);
      rerender();
    });

    const feed = node.querySelector("#feed");
    const filtered = outfits
      .filter((o) => o.budget <= state.profile.budget)
      .filter((o) => !scene || o.scene === scene)
      .filter(
        (o) =>
          !q || (o.title + " " + o.tags.join(" ")).toLowerCase().includes(q.toLowerCase())
      )
      .filter((o) => o.tags.some((t) => state.profile.tags.includes(t)));

    filtered.forEach((o) => feed.appendChild(OutfitPost(o)));
    if (!filtered.length) {
      feed.appendChild(
        el(`<div class="card pad"><div style="font-weight:900;">没有匹配的搭配</div><div class="muted" style="margin-top:8px;">试试调高预算或切换风格标签。</div></div>`)
      );
    }

    return pageShell("outfits", node);
  }

  function OutfitDetailPage(id) {
    const o = outfits.find((x) => x.id === id) || outfits[0];
    const items = o.items.map(getProduct).filter(Boolean);

    const node = el(`
      <div class="wrap">
        <div class="section">
          <div class="card" style="border-radius:26px;overflow:hidden;">
            <div class="post" style="border:0;border-radius:0;">
              <div class="img" style="height:320px;"></div>
              <div class="body">
                <div class="row between" style="align-items:flex-start;gap:16px;">
                  <div>
                    <h2 style="margin:0 0 8px 0;font-size:22px;">${escapeHtml(
                      o.title
                    )}</h2>
                    <div class="meta">
                      <span class="chip hot">${escapeHtml(o.scene)}</span>
                      ${o.tags.map((t) => `<span class="chip">#${escapeHtml(t)}</span>`).join("")}
                      <span class="chip">预算 ≤ ${money(o.budget)}</span>
                    </div>
                  </div>
                  <div class="row">
                    <button class="btn" id="likeOutfit">${icon("heart")} 收藏</button>
                    <button class="btn primary pink" id="bundle">一键成套加入</button>
                  </div>
                </div>
                <div class="grid" style="grid-template-columns: 8fr 4fr; gap:16px; margin-top:14px;">
                  <div class="card pad" style="box-shadow:none;">
                    <div class="card-title">搭配理由（3 句话）</div>
                    <div class="muted" style="margin-top:10px;line-height:1.8;">
                      ${o.story.map((s) => `<div>— ${escapeHtml(s)}</div>`).join("")}
                    </div>
                    <div class="section" style="margin:14px 0 0 0;">
                      <div class="row between">
                        <h2 style="margin:0;font-size:16px;">同风格更多</h2>
                        <button class="btn" id="more">去搭配流</button>
                      </div>
                      <div class="cards2" style="margin-top:10px;">
                        ${outfits
                          .filter((x) => x.id !== o.id)
                          .slice(0, 2)
                          .map(
                            (x) => `
                          <div class="card pad" style="box-shadow:none;" data-open="${escapeHtml(
                            x.id
                          )}">
                            <div style="font-weight:900;">${escapeHtml(x.title)}</div>
                            <div class="muted" style="font-size:12px;margin-top:8px;">${escapeHtml(
                              x.scene
                            )} · 预算 ≤ ${money(x.budget)}</div>
                          </div>
                        `
                          )
                          .join("")}
                      </div>
                    </div>
                  </div>
                  <aside class="panel" style="top:86px;">
                    <h3>成套清单（可勾选）</h3>
                    <div class="group" id="checklist"></div>
                    <div class="group">
                      <button class="btn primary pink" id="addSelected">加入购物袋</button>
                      <button class="btn" id="toStore" style="margin-left:10px;">附近门店可试穿</button>
                    </div>
                    <div class="mini">缺货自动换替代款（原型：用提示演示）。</div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    node.querySelector("#bundle").addEventListener("click", () => {
      items.forEach((p) => (state.bag = addUnique(state.bag, p.id)));
      saveState(state);
      toast("已将这套加入购物袋");
      rerender();
    });
    node.querySelector("#more").addEventListener("click", () => navTo("outfits", { scene: o.scene }));
    node.querySelector("#toStore").addEventListener("click", () => navTo("stores"));
    node.querySelector("#likeOutfit").addEventListener("click", () => {
      state.liked = addUnique(state.liked, o.id);
      saveState(state);
      toast("已收藏这套（原型：收藏列表未单独展示）");
      rerender();
    });
    on(node, "click", "[data-open]", (e, t) => navTo("outfit", { id: t.dataset.open }));

    const checklist = node.querySelector("#checklist");
    const selected = new Set(items.map((p) => p.id));
    items.forEach((p) => {
      const line = el(`
        <label class="subtle" style="display:flex;gap:10px;align-items:flex-start;padding:10px 12px;margin-bottom:10px;cursor:pointer;">
          <input type="checkbox" checked />
          <div style="flex:1;">
            <div style="font-weight:900;">${escapeHtml(p.name)}</div>
            <div class="muted" style="font-size:12px;margin-top:4px;">${money(
              p.price
            )} · ${p.stock.store ? "门店可试穿" : "仅线上"} · <a href="#/product?id=${encodeURIComponent(
              p.id
            )}" class="muted" style="text-decoration:underline;">看商品</a></div>
          </div>
        </label>
      `);
      line.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) selected.add(p.id);
        else selected.delete(p.id);
      });
      checklist.appendChild(line);
    });
    node.querySelector("#addSelected").addEventListener("click", () => {
      if (!selected.size) return toast("至少选 1 件");
      [...selected].forEach((id) => (state.bag = addUnique(state.bag, id)));
      saveState(state);
      toast("已加入购物袋");
      rerender();
    });

    return pageShell("outfits", node);
  }

  function ProductCard(p, { showStore } = {}) {
    const liked = state.liked.includes(p.id);
    const inCompare = state.compare.includes(p.id);
    const node = el(`
      <div class="card" style="overflow:hidden;">
        <div style="height:170px;background:linear-gradient(135deg,#111 0%, #fff 100%); position:relative;">
          <div style="position:absolute;left:12px;bottom:12px;display:flex;gap:8px;flex-wrap:wrap;">
            ${p.tags.slice(0, 2).map((t) => `<span class="chip hot">#${escapeHtml(t)}</span>`).join("")}
            ${p.stock.store ? `<span class="chip">门店可试穿</span>` : `<span class="chip">仅线上</span>`}
          </div>
        </div>
        <div style="padding:12px;">
          <div style="font-weight:900;min-height:40px;">${escapeHtml(p.name)}</div>
          <div class="row between" style="margin-top:8px;">
            <div style="font-weight:900;">${money(p.price)}</div>
            <div class="row">
              <button class="btn ghost" data-like title="收藏">${liked ? "♥" : "♡"}</button>
              <button class="btn ghost" data-compare title="对比">${inCompare ? "已对比" : "+对比"}</button>
            </div>
          </div>
          <div class="row" style="margin-top:10px;">
            <button class="btn" data-open>看详情</button>
            <button class="btn primary pink" data-add>加入购物袋</button>
          </div>
          ${
            showStore && p.stock.store
              ? `<div class="muted" style="font-size:12px;margin-top:10px;">附近可试穿：${escapeHtml(
                  (stores[0].name.split("｜")[1] || stores[0].name).trim()
                )}</div>`
              : ""
          }
        </div>
      </div>
    `);
    node.querySelector("[data-open]").addEventListener("click", () => navTo("product", { id: p.id }));
    node.querySelector("[data-add]").addEventListener("click", () => {
      state.bag = addUnique(state.bag, p.id);
      saveState(state);
      toast("已加入购物袋");
      rerender();
    });
    node.querySelector("[data-like]").addEventListener("click", () => {
      state.liked = toggleInList(state.liked, p.id);
      saveState(state);
      toast(state.liked.includes(p.id) ? "已收藏" : "已取消收藏");
      rerender();
    });
    node.querySelector("[data-compare]").addEventListener("click", () => {
      if (!state.compare.includes(p.id) && state.compare.length >= 4) return toast("对比最多 4 件");
      state.compare = toggleInList(state.compare, p.id);
      saveState(state);
      toast(state.compare.includes(p.id) ? "已加入对比" : "已移出对比");
      rerender();
      toggleCompareDrawer(true);
    });
    return node;
  }

  function CategoryPage() {
    const node = el(`
      <div class="wrap">
        <div class="section">
          <div class="row between">
            <h2>分类 · 先风格，再单品</h2>
            <div class="muted" style="font-size:12px;">列表页先给“编辑精选”，再给网格</div>
          </div>
          <div class="subtle" style="padding:12px 14px;">
            <div class="row between" style="flex-wrap:wrap;">
              <div class="row" style="flex-wrap:wrap;">
                ${styleTags
                  .map(
                    (t) =>
                      `<span class="pill ${
                        t.key === "潮流" ? "lime" : ""
                      }" data-tag="${escapeHtml(
                        t.key
                      )}" data-active="${state.profile.tags.includes(
                        t.key
                      )}"><span class="dot"></span>${escapeHtml(t.key)}</span>`
                  )
                  .join("")}
              </div>
              <div class="row">
                <button class="btn" id="openCompare">${icon("compare")} 对比抽屉</button>
                <button class="btn" id="onlyStore">只看门店可试穿</button>
              </div>
            </div>
          </div>

          <div class="layout" style="margin-top:14px;">
            <aside class="panel">
              <div class="group">
                <h3>筛选</h3>
                <div class="mini">原型：演示风格/门店有货/价格段</div>
              </div>
              <div class="group">
                <h3>价格</h3>
                <div class="row" style="flex-wrap:wrap;">
                  ${["0-99", "100-199", "200-299", "300+"]
                    .map((r) => `<span class="pill" data-price="${r}" data-active="false"><span class="dot"></span>${r}</span>`)
                    .join("")}
                </div>
              </div>
              <div class="group">
                <h3>门店有货</h3>
                <div class="subtle" style="padding:12px;">
                  <div style="font-weight:900;">一键切换：附近可试穿</div>
                  <div class="muted" style="font-size:12px;margin-top:6px;">开启后，商品卡会出现“可试穿门店”。</div>
                  <button class="btn" id="storeToggle" style="margin-top:10px;">开启</button>
                </div>
              </div>
            </aside>
            <main>
              <div class="cards3">
                ${[
                  ["编辑精选｜甜酷通勤 3 件套", "o-2001"],
                  ["编辑精选｜周末出街 一点荧光", "o-2002"],
                  ["编辑精选｜开学甜酷学院感", "o-2003"],
                ]
                  .map(
                    ([t, oid]) => `
                  <div class="card pad" data-open-outfit="${escapeHtml(oid)}">
                    <div style="font-weight:900;">${escapeHtml(t)}</div>
                    <div class="muted" style="font-size:12px;margin-top:8px;">点进搭配详情 → 右侧清单一键成套</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              <div class="section" style="margin-top:16px;">
                <div class="row between">
                  <h2 style="margin:0;font-size:16px;">单品网格</h2>
                  <div class="muted" style="font-size:12px;">hover：收藏/对比/加入清单</div>
                </div>
                <div class="grid" id="plp" style="grid-template-columns: repeat(4, 1fr); margin-top:12px;"></div>
              </div>
            </main>
          </div>
        </div>
      </div>
    `);

    let onlyStore = false;
    let priceRange = null;

    node.querySelector("#openCompare").addEventListener("click", () => {
      if (!state.compare.length) toast("先选 1–4 件加入对比");
      toggleCompareDrawer(true);
    });
    node.querySelector("#onlyStore").addEventListener("click", () => {
      onlyStore = !onlyStore;
      toast(onlyStore ? "已开启：只看门店可试穿" : "已关闭：显示全部");
      renderGrid();
    });
    node.querySelector("#storeToggle").addEventListener("click", () => {
      onlyStore = !onlyStore;
      node.querySelector("#storeToggle").textContent = onlyStore ? "关闭" : "开启";
      toast(onlyStore ? "已开启：附近可试穿" : "已关闭");
      renderGrid();
    });
    on(node, "click", ".pill[data-tag]", (e, t) => {
      state.profile.tags = toggleInList(state.profile.tags, t.dataset.tag);
      saveState(state);
      renderGrid();
    });
    on(node, "click", ".pill[data-price]", (e, t) => {
      const active = t.getAttribute("data-active") === "true";
      node.querySelectorAll(".pill[data-price]").forEach((x) => x.setAttribute("data-active", "false"));
      if (!active) {
        t.setAttribute("data-active", "true");
        priceRange = t.dataset.price;
      } else priceRange = null;
      renderGrid();
    });
    on(node, "click", "[data-open-outfit]", (e, t) => navTo("outfit", { id: t.dataset.openOutfit }));

    function renderGrid() {
      const plp = node.querySelector("#plp");
      plp.innerHTML = "";
      let list = products.filter((p) => p.tags.some((t) => state.profile.tags.includes(t)));
      if (onlyStore) list = list.filter((p) => p.stock.store);
      if (priceRange) {
        const [a, b] = priceRange.split("-");
        if (priceRange.endsWith("+")) {
          const min = Number(priceRange.replace("+", ""));
          list = list.filter((p) => p.price >= min);
        } else {
          list = list.filter((p) => p.price >= Number(a) && p.price <= Number(b));
        }
      }
      list.forEach((p) => plp.appendChild(ProductCard(p, { showStore: onlyStore })));
      if (!list.length)
        plp.appendChild(
          el(
            `<div class="card pad" style="grid-column: 1/-1;"><b>没有匹配的单品</b><div class="muted" style="margin-top:8px;">试试切换风格或关闭门店筛选。</div></div>`
          )
        );
    }
    renderGrid();

    return pageShell("category", node);
  }

  function ProductPage(id) {
    const p = getProduct(id) || products[0];
    const thumbCount = 5;
    let activeThumb = 0;
    let color = p.colors[0];
    let size = p.sizes[0];

    const node = el(`
      <div class="wrap">
        <div class="section">
          <div class="row" style="gap:10px;">
            <a class="muted" href="#/category">分类</a>
            <span class="muted">/</span>
            <span class="muted">${escapeHtml(p.tags[0] || "单品")}</span>
            <span class="muted">/</span>
            <b>${escapeHtml(p.name.split("（")[0])}</b>
          </div>

          <div class="twoCol" style="margin-top:12px;">
            <div class="gallery">
              <div class="thumbs" id="thumbs">
                ${Array.from({ length: thumbCount })
                  .map((_, i) => `<div class="thumb" data-i="${i}" data-active="${i === 0}"></div>`)
                  .join("")}
              </div>
              <div class="stage">
                <div class="tag">
                  ${p.tags.map((t) => `<span class="chip hot">#${escapeHtml(t)}</span>`).join("")}
                  <span class="chip">${p.stock.store ? "门店可试穿" : "仅线上"}</span>
                </div>
              </div>
            </div>

            <div class="kv">
              <h2>${escapeHtml(p.name)}</h2>
              <div class="price">
                <div class="now">${money(p.price)}</div>
                <span class="tag">本周甜酷精选</span>
              </div>
              <div class="muted" style="font-size:12px;">提示：PDP 内容化（先“怎么搭/怎么穿”再细节参数）。</div>
              <div class="sep"></div>

              <div style="font-weight:900;margin-bottom:8px;">颜色</div>
              <div class="opt" id="colors"></div>
              <div style="font-weight:900;margin:12px 0 8px 0;">尺码</div>
              <div class="opt" id="sizes"></div>

              <div class="subtle" style="padding:12px;margin-top:12px;">
                <div style="font-weight:900;">尺码助手（轻提示）</div>
                <div class="muted" style="font-size:12px;margin-top:6px;">输入身高体重 → 推荐尺码（原型：用提示替代）。</div>
                <button class="btn" id="sizeHelp" style="margin-top:10px;">快速推荐</button>
              </div>

              <div class="row" style="margin-top:14px;">
                <button class="btn primary pink" id="addBag">${icon("bag")} 加入购物袋</button>
                <button class="btn" id="addList">加入穿搭清单</button>
                <button class="btn ghost" id="like">${icon("heart")}</button>
              </div>
              <div class="sep"></div>
              <div class="row between">
                <div>
                  <div style="font-weight:900;">到店试穿 / 门店有货</div>
                  <div class="muted" style="font-size:12px;margin-top:4px;">附近门店可试穿 · 扫码打卡解锁券</div>
                </div>
                <button class="btn" id="goStores">去门店</button>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="row between">
              <h2>这件怎么搭（3 套）</h2>
              <div class="muted" style="font-size:12px;">点进去右侧清单一键成套</div>
            </div>
            <div class="cards3" id="howToWear"></div>
          </div>

          <div class="section">
            <div class="row between">
              <h2>真实穿搭 / 晒单</h2>
              <div class="muted" style="font-size:12px;">按身高/体型筛选（原型：占位）</div>
            </div>
            <div class="cards3">
              ${["165/50｜甜酷上班", "158/45｜周末出街", "170/55｜开学学院潮"]
                .map(
                  (t) =>
                    `<div class="card pad"><b>${escapeHtml(
                      t
                    )}</b><div class="muted" style="margin-top:10px;">“这件真的很显比例。”（原型文案）</div></div>`
                )
                .join("")}
            </div>
          </div>

          <div class="section">
            <div class="row between">
              <h2>商品细节</h2>
              <div class="muted" style="font-size:12px;">材质/洗护/尺码表放后面，避免首屏电商味太重</div>
            </div>
            <div class="cards2">
              <div class="card pad">
                <b>材质与洗护</b>
                <div class="muted" style="margin-top:10px;line-height:1.8;">— 质感：偏挺括<br/>— 建议：轻柔洗 / 低温熨烫</div>
              </div>
              <div class="card pad">
                <b>尺码表</b>
                <div class="muted" style="margin-top:10px;line-height:1.8;">— S / M / L（原型占位）<br/>— 建议按平时尺码选</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    const colorsEl = node.querySelector("#colors");
    const sizesEl = node.querySelector("#sizes");
    p.colors.forEach((c) => {
      const b = el(
        `<span class="pill" data-c="${escapeHtml(c)}" data-active="${c === color}"><span class="dot"></span>${escapeHtml(
          c
        )}</span>`
      );
      b.addEventListener("click", () => {
        color = c;
        [...colorsEl.children].forEach((x) => x.setAttribute("data-active", x.dataset.c === c));
      });
      colorsEl.appendChild(b);
    });
    p.sizes.forEach((s) => {
      const b = el(
        `<span class="pill" data-s="${escapeHtml(s)}" data-active="${s === size}"><span class="dot"></span>${escapeHtml(
          s
        )}</span>`
      );
      b.addEventListener("click", () => {
        size = s;
        [...sizesEl.children].forEach((x) => x.setAttribute("data-active", x.dataset.s === s));
      });
      sizesEl.appendChild(b);
    });

    on(node, "click", ".thumb", (e, t) => {
      activeThumb = Number(t.dataset.i);
      node.querySelectorAll(".thumb").forEach((x) => x.setAttribute("data-active", x.dataset.i == activeThumb));
      toast(`已切换图片 ${activeThumb + 1}/${thumbCount}`);
    });

    node.querySelector("#sizeHelp").addEventListener("click", () =>
      toast(`推荐尺码：${size}（原型演示，可接入算法/尺码模型）`)
    );
    node.querySelector("#addBag").addEventListener("click", () => {
      state.bag = addUnique(state.bag, p.id);
      saveState(state);
      toast(`已加入购物袋（${color}/${size}）`);
      rerender();
    });
    node.querySelector("#addList").addEventListener("click", () =>
      toast("已加入穿搭清单（原型：可在搭配编辑器里查看）")
    );
    node.querySelector("#like").addEventListener("click", () => {
      state.liked = toggleInList(state.liked, p.id);
      saveState(state);
      toast(state.liked.includes(p.id) ? "已收藏" : "已取消收藏");
      rerender();
    });
    node.querySelector("#goStores").addEventListener("click", () => navTo("stores"));

    const how = node.querySelector("#howToWear");
    outfits
      .filter((o) => o.items.includes(p.id) || o.tags.some((t) => p.tags.includes(t)))
      .slice(0, 3)
      .forEach((o) => {
        const c = el(`
          <div class="card pad" data-open="${escapeHtml(o.id)}">
            <div style="font-weight:900;">${escapeHtml(o.title)}</div>
            <div class="muted" style="font-size:12px;margin-top:8px;">${escapeHtml(
              o.scene
            )} · 预算 ≤ ${money(o.budget)}</div>
            <div class="row" style="flex-wrap:wrap;margin-top:10px;gap:8px;">
              ${o.tags.slice(0, 3).map((t) => `<span class="chip hot">#${escapeHtml(t)}</span>`).join("")}
            </div>
            <div class="row" style="margin-top:12px;">
              <button class="btn primary pink">看这套</button>
              <button class="btn" data-bundle>一键成套</button>
            </div>
          </div>
        `);
        c.querySelector("[data-bundle]").addEventListener("click", (e) => {
          e.stopPropagation();
          o.items.forEach((id) => (state.bag = addUnique(state.bag, id)));
          saveState(state);
          toast("已将这套加入购物袋");
          rerender();
        });
        c.addEventListener("click", () => navTo("outfit", { id: o.id }));
        how.appendChild(c);
      });

    return pageShell("category", node);
  }

  function RankingPage() {
    const parsed = qs("ranking") || { params: new URLSearchParams() };
    const params = parsed.params;
    const tab = params.get("tab") || "hot";
    const tabs = [
      ["hot", "热销榜"],
      ["new", "新品榜"],
      ["value", "性价比榜"],
      ["staff", "店员私藏"],
      ["city", "城市同款"],
    ];

    const explain = {
      hot: ["销量趋势稳定", "同风格复购高", "门店试穿反馈好"],
      new: ["上新热度高", "搭配出现频次高", "断码速度快"],
      value: ["同价位替代更少", "材质/版型性价比高", "退货原因更少（原型）"],
      staff: ["店员搭配率高", "上身显比例", "更容易拍出片"],
      city: ["本城到店热度高", "打卡解锁搭配多", "同款出现频次高"],
    }[tab];

    const node = el(`
      <div class="wrap">
        <div class="section">
          <div class="row between">
            <h2>好物榜单</h2>
            <div class="muted" style="font-size:12px;">榜单要“可信”：用短解释替代硬广</div>
          </div>
          <div class="row" style="flex-wrap:wrap;">
            ${tabs
              .map(
                ([k, label]) =>
                  `<a class="pill" href="#/ranking?tab=${encodeURIComponent(
                    k
                  )}" data-active="${k === tab}"><span class="dot"></span>${escapeHtml(label)}</a>`
              )
              .join("")}
          </div>

          <div class="subtle" style="padding:12px 14px;margin-top:14px;">
            <div class="row between">
              <div>
                <b>为什么上榜</b>
                <div class="muted" style="font-size:12px;margin-top:4px;">${escapeHtml(
                  explain.join(" · ")
                )}</div>
              </div>
              <button class="btn primary pink" id="bundle">生成榜单穿搭包</button>
            </div>
          </div>

          <div class="grid" style="grid-template-columns: 1fr 1fr; margin-top:14px;" id="rankList"></div>
        </div>
      </div>
    `);

    const list = node.querySelector("#rankList");
    const ranked = [...products]
      .filter((p) => (tab === "value" ? p.price <= 199 : true))
      .sort((a, b) => (tab === "new" ? b.id.localeCompare(a.id) : b.price - a.price))
      .slice(0, 6);

    ranked.forEach((p) => {
      const card = el(`
        <div class="card pad">
          <div class="row between">
            <div style="font-weight:900;">${escapeHtml(p.name)}</div>
            <span class="chip hot">${money(p.price)}</span>
          </div>
          <div class="row" style="flex-wrap:wrap;margin-top:10px;">
            ${p.tags.map((t) => `<span class="chip">#${escapeHtml(t)}</span>`).join("")}
            <span class="chip">${p.stock.store ? "门店可试穿" : "仅线上"}</span>
          </div>
          <div class="row" style="margin-top:12px;">
            <button class="btn" data-open>看详情</button>
            <button class="btn" data-alt>同价替代</button>
            <button class="btn primary pink" data-add>加入购物袋</button>
          </div>
          <div class="muted" style="font-size:12px;margin-top:10px;">上榜理由：${escapeHtml(
            explain[0]
          )}</div>
        </div>
      `);
      card.querySelector("[data-open]").addEventListener("click", () => navTo("product", { id: p.id }));
      card.querySelector("[data-alt]").addEventListener("click", () => {
        const alt = products.find((x) => x.id !== p.id && Math.abs(x.price - p.price) <= 50);
        toast(alt ? `同价替代：${alt.name}` : "暂无合适替代");
      });
      card.querySelector("[data-add]").addEventListener("click", () => {
        state.bag = addUnique(state.bag, p.id);
        saveState(state);
        toast("已加入购物袋");
        rerender();
      });
      list.appendChild(card);
    });

    node.querySelector("#bundle").addEventListener("click", () => {
      const pick = ranked.slice(0, 4).map((p) => p.id);
      pick.forEach((id) => (state.bag = addUnique(state.bag, id)));
      saveState(state);
      toast("已生成并加入“榜单穿搭包”");
      rerender();
    });

    return pageShell("ranking", node);
  }

  function StoresPage() {
    const node = el(`
      <div class="wrap">
        <div class="section">
          <div class="row between">
            <h2>门店 · 地图 + 列表</h2>
            <div class="row">
              <span class="chip hot">定位：${escapeHtml(state.location.city)}</span>
              <button class="btn" id="loc">切换城市</button>
            </div>
          </div>

          <div class="grid" style="grid-template-columns: 7fr 5fr; gap:16px; margin-top:14px;">
            <div class="mapMock">
              <div class="mapLabel">
                <span class="chip hot">到店扫码打卡</span>
                <span class="muted" style="font-size:12px;">PC 展示权益与二维码指引</span>
              </div>
              <div class="pin" style="left:22%; top:36%;"></div>
              <div class="pin lime" style="left:62%; top:48%;"></div>
              <div class="pin" style="left:44%; top:68%;"></div>
            </div>
            <div>
              <div class="card pad">
                <div class="row between">
                  <div>
                    <div style="font-weight:900;">到店打卡流程（极简）</div>
                    <div class="muted" style="font-size:12px;margin-top:6px;">到店 → 打开门店页 → 手机扫码 → 解锁券/限定搭配</div>
                  </div>
                  <button class="btn primary pink" id="scan">显示二维码</button>
                </div>
                <div id="qr" class="subtle" style="padding:12px;margin-top:12px;display:none;">
                  <div style="font-weight:900;">扫码打卡（原型二维码）</div>
                  <div class="muted" style="font-size:12px;margin-top:6px;">真实项目可替换为门店二维码/小程序码</div>
                  <div class="subtle" style="margin-top:10px;padding:16px;text-align:center;font-weight:900;">QR CODE</div>
                  <div class="row" style="margin-top:10px;">
                    <span class="chip hot">奖励：到店券</span>
                    <span class="chip">解锁本店限定搭配</span>
                  </div>
                </div>
              </div>
              <div class="section" style="margin-top:14px;">
                <div class="row between">
                  <h2 style="margin:0;font-size:16px;">附近门店</h2>
                  <button class="btn" id="sort">按距离排序</button>
                </div>
                <div id="storeList" style="margin-top:12px;display:flex;flex-direction:column;gap:12px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    node.querySelector("#loc").addEventListener("click", () => {
      state.location.city = state.location.city === "上海" ? "杭州" : "上海";
      saveState(state);
      rerender();
    });
    node.querySelector("#scan").addEventListener("click", () => {
      const qr = node.querySelector("#qr");
      qr.style.display = qr.style.display === "none" ? "block" : "none";
    });

    let asc = true;
    node.querySelector("#sort").addEventListener("click", () => {
      asc = !asc;
      renderList();
    });

    const list = node.querySelector("#storeList");
    function renderList() {
      list.innerHTML = "";
      const sorted = [...stores].sort((a, b) => (asc ? a.distanceKm - b.distanceKm : b.distanceKm - a.distanceKm));
      sorted.forEach((s) => {
        const card = el(`
          <div class="card pad">
            <div class="row between">
              <div>
                <div style="font-weight:900;">${escapeHtml(s.name)}</div>
                <div class="muted" style="font-size:12px;margin-top:6px;">${s.open ? "营业中" : "已打烊"} · 距离 ${s.distanceKm}km · ${s.hasTryOn ? "可试穿" : "不支持试穿"}</div>
              </div>
              <button class="btn primary pink" data-checkin>打卡任务</button>
            </div>
            <div class="row" style="flex-wrap:wrap;margin-top:10px;">
              ${s.highlights.map((h) => `<span class="chip hot">${escapeHtml(h)}</span>`).join("")}
            </div>
            <div class="row" style="margin-top:12px;">
              <button class="btn" data-route>路线</button>
              <button class="btn" data-outfit>本店限定搭配</button>
              <button class="btn" data-stock>查库存</button>
            </div>
          </div>
        `);
        card.querySelector("[data-checkin]").addEventListener("click", () => toast("到店扫码打卡：解锁券 + 店员私藏榜（原型）"));
        card.querySelector("[data-route]").addEventListener("click", () => toast("可跳转高德/百度导航（原型）"));
        card.querySelector("[data-outfit]").addEventListener("click", () => navTo("outfit", { id: outfits[1].id }));
        card.querySelector("[data-stock]").addEventListener("click", () => toast("库存：按尺码/颜色查询（原型：用提示替代）"));
        list.appendChild(card);
      });
    }
    renderList();

    return pageShell("stores", node);
  }

  function ComparePage() {
    const picked = state.compare.map(getProduct).filter(Boolean);
    const node = el(`
      <div class="wrap">
        <div class="section">
          <div class="row between">
            <h2>对比</h2>
            <button class="btn" id="back">返回分类</button>
          </div>
          <div class="subtle" style="padding:12px 14px;">
            <b>对比维度</b>
            <span class="muted" style="margin-left:10px;">价格 / 标签 / 尺码 / 门店可试穿</span>
          </div>
          <div class="grid" style="grid-template-columns: repeat(${Math.max(
            1,
            picked.length
          )}, 1fr); gap:14px; margin-top:14px;" id="cols"></div>
        </div>
      </div>
    `);
    node.querySelector("#back").addEventListener("click", () => navTo("category"));
    const cols = node.querySelector("#cols");
    if (!picked.length) {
      cols.style.gridTemplateColumns = "1fr";
      cols.appendChild(
        el(`<div class="card pad"><b>还没有选择对比单品</b><div class="muted" style="margin-top:8px;">去分类页点“+对比”。</div></div>`)
      );
      return pageShell("category", node);
    }
    picked.forEach((p) => {
      cols.appendChild(
        el(`
          <div class="card pad">
            <div style="height:160px;border-radius:18px;background:linear-gradient(135deg,#111 0%, #fff 100%);"></div>
            <div style="font-weight:900;margin-top:12px;">${escapeHtml(p.name)}</div>
            <div class="row" style="flex-wrap:wrap;margin-top:10px;">
              <span class="chip hot">${money(p.price)}</span>
              ${p.tags.map((t) => `<span class="chip">#${escapeHtml(t)}</span>`).join("")}
              <span class="chip">${p.stock.store ? "门店可试穿" : "仅线上"}</span>
            </div>
            <div class="muted" style="font-size:12px;margin-top:10px;">尺码：${escapeHtml(p.sizes.join(" / "))}</div>
            <div class="row" style="margin-top:12px;">
              <button class="btn" data-open>看详情</button>
              <button class="btn" data-remove>移除</button>
            </div>
          </div>
        `)
      );
      const c = cols.lastElementChild;
      c.querySelector("[data-open]").addEventListener("click", () => navTo("product", { id: p.id }));
      c.querySelector("[data-remove]").addEventListener("click", () => {
        state.compare = state.compare.filter((x) => x !== p.id);
        saveState(state);
        rerender();
      });
    });
    return pageShell("category", node);
  }

  function NotFoundPage() {
    const node = el(`
      <div class="wrap">
        <div class="section">
          <div class="card pad">
            <b>页面不存在</b>
            <div class="muted" style="margin-top:8px;">返回 <a href="#/home" style="text-decoration:underline;">首页</a></div>
          </div>
        </div>
      </div>
    `);
    return pageShell("home", node);
  }

  function router() {
    const parsed = qs() || { path: "home", params: new URLSearchParams() };
    const path = parsed.path || "home";
    const params = parsed.params;

    if (path === "home") return HomePage();
    if (path === "outfits") return OutfitsPage();
    if (path === "outfit") return OutfitDetailPage(params.get("id"));
    if (path === "category") return CategoryPage();
    if (path === "product") return ProductPage(params.get("id"));
    if (path === "ranking") return RankingPage();
    if (path === "stores") return StoresPage();
    if (path === "compare") return ComparePage();
    return NotFoundPage();
  }

  function rerender() {
    state = loadState();
    mount(app, router());
    updateCompareDrawer();
  }

  window.addEventListener("hashchange", rerender);
  if (!location.hash) location.hash = "#/home";
  rerender();
})();
