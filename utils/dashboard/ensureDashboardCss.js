const DASHBOARD_CSS = "/css/dashboard.css";
const MARK = "data-deswap-dashboard-css";

export function needsDashboardCss(url = "") {
  return /\/(user|admin)\/dashboard/.test(String(url));
}

function findStylesheet() {
  if (typeof document === "undefined") return null;
  const links = document.querySelectorAll(
    `link[${MARK}], link[href="${DASHBOARD_CSS}"], link[href*="/css/dashboard.css"]`
  );
  for (let i = 0; i < links.length; i++) {
    if (links[i].rel === "stylesheet") return links[i];
  }
  return null;
}

export function preloadDashboardCss() {
  if (typeof document === "undefined") return;
  if (document.querySelector(`link[${MARK}-preload]`) || findStylesheet()) {
    return;
  }
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "style";
  link.href = DASHBOARD_CSS;
  link.setAttribute(`${MARK}-preload`, "1");
  document.head.appendChild(link);
}

export function ensureDashboardCss() {
  if (typeof document === "undefined") return Promise.resolve();

  const existing = findStylesheet();
  if (existing && existing.sheet) return Promise.resolve();

  const link =
    existing ||
    (() => {
      const el = document.createElement("link");
      el.rel = "stylesheet";
      el.href = DASHBOARD_CSS;
      el.setAttribute(MARK, "1");
      document.head.appendChild(el);
      return el;
    })();

  return new Promise((resolve) => {
    const done = () => resolve();
    const timer = setTimeout(done, 2500);
    link.addEventListener(
      "load",
      () => {
        clearTimeout(timer);
        done();
      },
      { once: true }
    );
    link.addEventListener(
      "error",
      () => {
        clearTimeout(timer);
        done();
      },
      { once: true }
    );
    if (link.sheet) {
      clearTimeout(timer);
      done();
    }
  });
}
