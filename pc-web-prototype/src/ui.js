export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function mount(root, node) {
  root.innerHTML = "";
  root.appendChild(node);
}

export function on(elm, event, selector, handler) {
  elm.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (!target || !elm.contains(target)) return;
    handler(e, target);
  });
}

