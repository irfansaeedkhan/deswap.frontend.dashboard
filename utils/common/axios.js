import axios from "axios";
import axiosRetry from "axios-retry";
import {
  responseBodyVerification,
  decodeResponseBody,
  decodeResponseBodyUnprotected,
  responseBodyVerificationUnprotected,
  responseBodyVerificationAdmin,
  decodeResponseBodyAdmin,
} from "../../utils/common/jwtToken";

const demoAxios =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  process.env.DEMO_MODE === "true";

axiosRetry(axios, {
  retries: demoAxios ? 0 : 2,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => {
    return error.response && error.response.status === 401;
  },
});

axios.defaults.timeout = 12000;

function isDemoMode() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") return true;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1";
  }
  return process.env.DEMO_MODE === "true";
}

/** Fix stale NEXT_PUBLIC_PLATFORM_URL port (e.g. :3000 while app is on :3002). */
function alignLocalOrigin(url) {
  if (typeof window === "undefined" || !url) return url;
  const host = window.location.hostname;
  if (host !== "localhost" && host !== "127.0.0.1") return url;
  // Convert absolute localhost URLs to same-origin relative paths
  const stripped = String(url).replace(
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i,
    ""
  );
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

/** Rewrite real API calls to demo mock handler (no Mongo). */
axios.interceptors.request.use((config) => {
  try {
    if (config.url) {
      config.url = String(config.url).replace(/^undefined/, "");
      config.url = alignLocalOrigin(config.url);
    }
    if (!isDemoMode()) return config;
    const raw = config.url || "";
    if (
      raw.includes("/api/demo/") ||
      raw.includes("/api/mock/") ||
      raw.includes("/_next/")
    ) {
      return config;
    }
    const marker = "/api/";
    const idx = raw.indexOf(marker);
    if (idx === -1) return config;
    const origin = raw.slice(0, idx) || "";
    const rest = raw.slice(idx + marker.length);
    const base =
      origin ||
      (typeof window !== "undefined" ? window.location.origin : "");
    config.url = `${base}/api/demo/handle/${rest}`;
    // Demo payloads are plain JSON — avoid encrypted-body expectations
    if (config.headers) {
      delete config.headers["security-set"];
      config.headers["x-deswap-demo"] = "1";
    }
  } catch (e) {
    // keep original request
  }
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    try {
      // Demo plain JSON — pass through
      if (response?.data?.demo === true) {
        return response;
      }
      if (
        response.status == 200 &&
        response.headers.hasOwnProperty("response-security") &&
        response.headers["response-security"] != undefined &&
        response.headers["response-security"] == "true"
      ) {
        if (response.data.type == "noauth") {
          let jwtverified = true;
          await responseBodyVerificationUnprotected(response.data.data).catch(
            () => {
              jwtverified = false;
            }
          );

          if (jwtverified) {
            let responsedata = await decodeResponseBodyUnprotected(
              response.data.data
            );
            response.data = {
              ...response.data,
              ...responsedata.payload,
              exp: null,
              iat: null,
              iss: null,
              sub: null,
            };
          }
        } else if (response.data.type == "userauth") {
          let jwtverified = true;
          await responseBodyVerification(response.data.data).catch(() => {
            jwtverified = false;
          });

          if (jwtverified) {
            let responsedata = await decodeResponseBody(response.data.data);
            response.data = {
              ...response.data,
              ...responsedata.payload,
              exp: null,
              iat: null,
              iss: null,
              sub: null,
            };
          }
        } else if (response.data.type == "adminauth") {
          let jwtverified = true;
          await responseBodyVerificationAdmin(response.data.data).catch(() => {
            jwtverified = false;
          });

          if (jwtverified) {
            let responsedata = await decodeResponseBodyAdmin(
              response.data.data
            );
            response.data = {
              ...response.data,
              ...responsedata.payload,
              exp: null,
              iat: null,
              iss: null,
              sub: null,
            };
          }
        } else {
          let jwtverified = true;
          await responseBodyVerificationUnprotected(response.data.data).catch(
            () => {
              jwtverified = false;
            }
          );

          if (jwtverified) {
            let responsedata = await decodeResponseBodyUnprotected(
              response.data.data
            );
            response.data = {
              ...response.data,
              ...responsedata.payload,
              exp: null,
              iat: null,
              iss: null,
              sub: null,
            };
          }
        }
      }
      return response;
    } catch (e) {
      return response;
    }
  },
  async (err) => {
    throw err;
  }
);

export default axios;
