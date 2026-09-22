/**
 * Browser-safe platform base URL.
 * On localhost, always use the current origin so a mismatched
 * NEXT_PUBLIC_PLATFORM_URL port (e.g. :3000 vs :3002) cannot break login.
 */
export function getPlatformUrl() {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return window.location.origin;
    }
  }
  return (
    process.env.NEXT_PUBLIC_PLATFORM_URL ||
    process.env.PLATFORM_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  );
}

export default getPlatformUrl;
