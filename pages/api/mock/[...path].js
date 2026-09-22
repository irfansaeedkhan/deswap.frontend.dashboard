import {
  paginate,
  packs,
  networkRewards,
  companies,
  nfts,
  dashboardSummary,
  demoUser,
} from "../../../lib/mock-data";

/**
 * Catch-all mock API for demo mode.
 * Examples:
 *   GET /api/mock/dashboard
 *   GET /api/mock/packs?page=2&limit=10
 *   GET /api/mock/companies?offset=10&limit=10
 */
export default function handler(req, res) {
  const segments = [].concat(req.query.path || []);
  const resource = (segments[0] || "").toLowerCase();
  const page = req.query.page || req.query.Page || 1;
  const offset = req.query.offset;
  const limit = req.query.limit || 10;

  const ok = (payload) =>
    res.status(200).json({
      data: payload,
      type: "noauth",
      demo: true,
    });

  switch (resource) {
    case "dashboard":
    case "summary":
      return ok(dashboardSummary);
    case "user":
    case "profile":
      return ok({ user: demoUser, ...dashboardSummary.profile });
    case "packs":
    case "purchasedpack":
      return ok(paginate(packs, { page, offset, limit }));
    case "network":
    case "networkrewards":
      return ok({
        ...paginate(networkRewards, { page, offset, limit }),
        total: [{ totalRewards: dashboardSummary.totalRewardsUSD }],
        claimmed: [{ totalRewards: dashboardSummary.claimedRewards }],
        avaible: [{ totalRewards: dashboardSummary.availableRewards }],
      });
    case "companies":
    case "company":
      return ok(paginate(companies, { page, offset, limit }));
    case "nfts":
    case "marketplace":
      return ok(paginate(nfts, { page, offset, limit }));
    default:
      return ok({
        message: "Deswap demo mock",
        resources: [
          "dashboard",
          "packs",
          "networkrewards",
          "companies",
          "nfts",
          "profile",
        ],
        query: { page, offset, limit },
      });
  }
}
