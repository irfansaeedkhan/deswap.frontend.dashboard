import Cookies from "cookies";
import CryptoJS from "crypto-js";
import { createFrontUserToken } from "../../../utils/common/jwtToken";
import { demoUser, DEMO_CREDENTIALS } from "../../../lib/mock-data";

/**
 * Demo login — no Mongo/Redis required.
 * POST { email, password } with demo credentials.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (
    process.env.DEMO_MODE !== "true" &&
    process.env.NEXT_PUBLIC_DEMO_MODE !== "true"
  ) {
    return res.status(404).json({
      error: "Demo mode disabled",
      hint: "Set DEMO_MODE=true and NEXT_PUBLIC_DEMO_MODE=true in .env.local",
    });
  }

  try {
    const email = String(req.body?.email || req.body?.demoEmail || "")
      .trim()
      .toLowerCase();
    const password = String(
      req.body?.password || req.body?.demoPassword || ""
    );

    if (
      email !== DEMO_CREDENTIALS.email.toLowerCase() ||
      password !== DEMO_CREDENTIALS.password
    ) {
      return res.status(401).json({
        error: "Invalid login",
        hint: `Demo credentials: ${DEMO_CREDENTIALS.email} / ${DEMO_CREDENTIALS.password}`,
      });
    }

    const loginTime = Date.now();
    const frontToken = await createFrontUserToken({
      uuid: demoUser.uuid,
      time: loginTime,
      verificationStatus: true,
      emailid: demoUser.emailid,
      role: "User",
      messageCodeAuth: true,
    });

    const encryptedFrontendKey = CryptoJS.AES.encrypt(
      frontToken,
      process.env.FRONTEND_COOKIES_SECRET_KEY || "demo-frontend-cookies-secret"
    ).toString();

    const cookies = new Cookies(req, res);
    cookies.set(
      process.env.FRONT_END_COOKIE_NAME || "users.deswap.local",
      encryptedFrontendKey,
      {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
        path: "/",
      }
    );

    cookies.set("deswap_demo_session", "1", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });

    // Plain JSON for the browser — avoids encrypted-response decode failures in demo
    return res.status(200).json({
      user: {
        emailid: demoUser.emailid,
        uuid: demoUser.uuid,
        accountverified: true,
        address: demoUser.address,
      },
      type: "noauth",
      demo: true,
      message: "Demo login successful",
    });
  } catch (e) {
    console.error("Demo login failed:", e.message);
    return res.status(500).json({
      error: "Demo login failed",
      hint: e.message,
    });
  }
}
