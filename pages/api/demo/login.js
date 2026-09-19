import Cookies from "cookies";
import CryptoJS from "crypto-js";
import {
  createFrontUserToken,
  responseBodyEncryptionUnprotected,
} from "../../../utils/common/jwtToken";
import { demoUser, DEMO_CREDENTIALS } from "../../../lib/mock-data";

/**
 * Demo login — no Mongo/Redis required.
 * POST { email, password } or { data: encrypted } with demo credentials.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (
    process.env.DEMO_MODE !== "true" &&
    process.env.NEXT_PUBLIC_DEMO_MODE !== "true"
  ) {
    return res.status(404).json({ error: "Demo mode disabled" });
  }

  try {
    let email = req.body?.email;
    let password = req.body?.password;

    // Allow plain JSON body for demo clients
    if (!email && req.body?.demoEmail) {
      email = req.body.demoEmail;
      password = req.body.demoPassword;
    }

    if (
      email !== DEMO_CREDENTIALS.email ||
      password !== DEMO_CREDENTIALS.password
    ) {
      return res.status(401).json({
        error: "Invalid login",
        hint: `Use ${DEMO_CREDENTIALS.email} / ${DEMO_CREDENTIALS.password}`,
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

    // Demo session marker for auth helpers
    cookies.set("deswap_demo_session", "1", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });

    const payload = {
      user: {
        emailid: demoUser.emailid,
        uuid: demoUser.uuid,
        accountverified: true,
        address: demoUser.address,
      },
      message: "Demo login successful",
    };

    // Match production response shape when secrets exist
    try {
      const encrypted = await responseBodyEncryptionUnprotected(payload);
      res.setHeader("response-security", "true");
      return res.status(200).json({ data: encrypted, type: "noauth", demo: true });
    } catch (e) {
      return res.status(200).json({ ...payload, type: "noauth", demo: true });
    }
  } catch (e) {
    console.error("Demo login failed:", e.message);
    return res.status(500).json({ error: "Demo login failed" });
  }
}
