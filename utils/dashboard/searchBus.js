let listeners = new Set();
let lastQuery = "";

export function setDashboardSearch(query) {
  lastQuery = String(query || "");
  listeners.forEach((fn) => fn(lastQuery));
}

export function subscribeDashboardSearch(fn) {
  listeners.add(fn);
  fn(lastQuery);
  return () => listeners.delete(fn);
}
