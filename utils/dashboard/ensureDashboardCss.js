const DASHBOARD_CSS = "/css/dashboard.css";
const MARK = "data-deswap-dashboard-css";

export function needsDashboardCss(url = "") {
  return /\/(user|admin)\/dashboard/.test(String(url));
}

function findDashboardCssLink() {
  if (typeof document === "undefined") return null;
  return (
    document.querySelector(`link[${MARK}]`) ||
    document.querySelector(`link[href="${DASHBOARD_CSS}"]`) ||
    document.querySelector('link[href*="/css/dashboard.css"]')
  );
}

export function preloadDashboardCss() {
  if (typeof document === "undefined") return;
  if (
    document.querySelector(`link[${MARK}-preload]`) ||
    findDashboardCssLink()
  ) {
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

  const existing = findDashboardCssLink();
  if (existing) {
    if (existing.sheet) return Promise.resolve();
    return new Promise((resolve) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
    });
  }

  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = DASHBOARD_CSS;
    link.setAttribute(MARK, "1");
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}
