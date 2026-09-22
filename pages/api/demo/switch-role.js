/**
 * Switch session role for client demos (user <-> admin).
 * POST { role: 'user' | 'admin' }
 */
import Cookies from "cookies";
import CryptoJS from "crypto-js";
import {
  createFrontUserToken,
  createFrontAdminToken,
} from "../../../utils/common/jwtToken";
import {
  demoUser,
  demoAdmin,
} from "../../../lib/mock-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const role = String(req.body?.role || "user").toLowerCase();
    const isAdmin = role === "admin";
    const identity = isAdmin ? demoAdmin : demoUser;

    const token = isAdmin
      ? await createFrontAdminToken({
          uuid: identity.uuid,
          time: Date.now(),
          verificationStatus: true,
          emailid: identity.emailid,
          role: "DeswapAdminRole",
          messageCodeAuth: true,
          ip: "127.0.0.1",
        })
      : await createFrontUserToken({
          uuid: identity.uuid,
          time: Date.now(),
          verificationStatus: true,
          emailid: identity.emailid,
          role: "User",
          messageCodeAuth: true,
        });

    const encrypted = CryptoJS.AES.encrypt(
      token,
      process.env.FRONTEND_COOKIES_SECRET_KEY || "demo-frontend-cookies-secret"
    ).toString();

    const cookies = new Cookies(req, res);
    cookies.set(
      process.env.FRONT_END_COOKIE_NAME || "users.deswap.local",
      encrypted,
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
    cookies.set("deswap_demo_role", isAdmin ? "admin" : "user", {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      demo: true,
      role: isAdmin ? "admin" : "user",
      redirect: isAdmin ? "/admin/dashboard" : "/user/dashboard",
      user: {
        emailid: identity.emailid,
        uuid: identity.uuid,
        role: isAdmin ? "DeswapAdminRole" : "User",
      },
    });
  } catch (e) {
    console.error("Demo switch failed:", e.message);
    return res.status(500).json({ error: "Demo switch failed", hint: e.message });
  }
}
