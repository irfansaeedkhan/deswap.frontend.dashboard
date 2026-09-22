import { resolveDemoPayload } from "../../../../lib/demo-api-router";

/**
 * Catch-all demo handler. Axios rewrites /api/* → /api/demo/handle/*
 * when NEXT_PUBLIC_DEMO_MODE is on.
 */
export default function handler(req, res) {
  const segments = [].concat(req.query.path || []);
  try {
    const payload = resolveDemoPayload(segments, req);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(payload);
  } catch (e) {
    console.error("Demo handle error:", e);
    return res.status(500).json({ error: "Demo handler failed", hint: e.message });
  }
}
