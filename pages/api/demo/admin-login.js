import Cookies from "cookies";
import CryptoJS from "crypto-js";
import { createFrontAdminToken } from "../../../utils/common/jwtToken";
import { demoAdmin, DEMO_ADMIN_CREDENTIALS } from "../../../lib/mock-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    if (
      email !== DEMO_ADMIN_CREDENTIALS.email.toLowerCase() ||
      password !== DEMO_ADMIN_CREDENTIALS.password
    ) {
      return res.status(401).json({
        error: "Invalid login",
        hint: `Demo admin: ${DEMO_ADMIN_CREDENTIALS.email} / ${DEMO_ADMIN_CREDENTIALS.password}`,
      });
    }

    const frontToken = await createFrontAdminToken({
      uuid: demoAdmin.uuid,
      time: Date.now(),
      verificationStatus: true,
      emailid: demoAdmin.emailid,
      role: "DeswapAdminRole",
      messageCodeAuth: true,
      ip: "127.0.0.1",
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
    cookies.set("deswap_demo_role", "admin", {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      user: {
        emailid: demoAdmin.emailid,
        uuid: demoAdmin.uuid,
        accountverified: true,
        address: demoAdmin.address,
        role: "DeswapAdminRole",
      },
      type: "noauth",
      demo: true,
      message: "Demo admin login successful",
    });
  } catch (e) {
    console.error("Demo admin login failed:", e.message);
    return res.status(500).json({
      error: "Demo admin login failed",
      hint: e.message,
    });
  }
}
