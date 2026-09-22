import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "@/utils/common/axios";
import { toast } from "react-toastify";

/**
 * User <-> Admin switcher — lives in dashboard sidebar only.
 * Role follows the current URL so browser back/forward stays in sync.
 */
export default function DemoRoleSwitcher() {
  const router = useRouter();
  const current = router.pathname.startsWith("/admin") ? "admin" : "user";
  const [busy, setBusy] = useState(false);

  const switchTo = async (role) => {
    if (busy) return;
    setBusy(true);
    try {
      const { data } = await axios.post(
        `/api/demo/switch-role`,
        { role },
        { withCredentials: true }
      );
      toast.success(
        role === "admin" ? "Switched to Admin demo" : "Switched to User demo",
        { autoClose: 1500 }
      );
      window.location.assign(
        data.redirect ||
          (role === "admin" ? "/admin/dashboard" : "/user/dashboard")
      );
    } catch (e) {
      toast.error(
        e?.response?.data?.hint || e?.message || "Failed to switch role"
      );
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: 2,
        borderRadius: 20,
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        disabled={busy || current === "user"}
        onClick={() => switchTo("user")}
        style={{
          width: "auto",
          border: "none",
          borderRadius: 16,
          padding: "4px 10px",
          cursor: busy || current === "user" ? "default" : "pointer",
          background: current === "user" ? "#E44757" : "#2a2a2a",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          opacity: busy ? 0.7 : 1,
        }}
      >
        User
      </button>
      <button
        type="button"
        disabled={busy || current === "admin"}
        onClick={() => switchTo("admin")}
        style={{
          width: "auto",
          border: "none",
          borderRadius: 16,
          padding: "4px 10px",
          cursor: busy || current === "admin" ? "default" : "pointer",
          background: current === "admin" ? "#E44757" : "#2a2a2a",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          opacity: busy ? 0.7 : 1,
        }}
      >
        Admin
      </button>
    </div>
  );
}
