const KEY = "sanfu_proto_state_v1";

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v && typeof v === "object" ? v : fallback;
  } catch {
    return fallback;
  }
}

export function loadState() {
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

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function toggleInList(list, id) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function addUnique(list, id, max = Infinity) {
  const next = list.includes(id) ? list : [...list, id];
  if (next.length <= max) return next;
  return next.slice(next.length - max);
}

