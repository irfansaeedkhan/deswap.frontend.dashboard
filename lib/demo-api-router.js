/**
 * Maps real /api/* paths to demo JSON payloads (no Mongo).
 */
const mock = require("./mock-data");

function ok(extra = {}) {
  return { ...extra, demo: true };
}

function parseBody(req) {
  try {
    if (!req.body) return {};
    if (typeof req.body === "string") return JSON.parse(req.body);
    // encrypted wrappers ignored in demo — use query/body fields when present
    return {
      ...req.body,
      ...(req.body.data && typeof req.body.data === "object" ? req.body.data : {}),
    };
  } catch {
    return {};
  }
}

function pageArgs(req) {
  const body = parseBody(req);
  const q = req.query || {};
  return {
    page: q.page || q.Page || body.page || body.activePageNo || 1,
    offset: q.offset ?? body.offset ?? body.skip,
    limit: q.limit || body.limit || body.dataperpage || 10,
  };
}

function needle(value) {
  return String(value || "").trim().toLowerCase();
}

function filterCompanies(body) {
  const name = needle(body.name || body.companyname);
  const owner = needle(body.username || body.owner);
  const email = needle(body.email || body.emailid);
  let list = mock.companies.slice();
  if (name) {
    list = list.filter((c) =>
      [c.name, c.business, c.catagoryName].some((f) => needle(f).includes(name))
    );
  }
  if (owner) {
    list = list.filter((c) => needle(c.owner).includes(owner));
  }
  if (email) {
    list = list.filter((c) => needle(c.owner).includes(email));
  }
  const sort = String(body.sort || body.sortBy || "").toLowerCase();
  if (sort === "date" || sort === "datedesc") {
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sort === "dateasc") {
    list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }
  return list;
}

function filterAdminUsers(body) {
  const username = needle(body.username);
  const email = needle(body.email || body.emailid);
  const wallet = needle(
    body.publickey || body.walletaddress || body.walletAddress
  );
  let list = mock.adminUsers.slice();
  if (username) {
    list = list.filter((u) => needle(u.username).includes(username));
  }
  if (email) {
    list = list.filter((u) => needle(u.emailid).includes(email));
  }
  if (wallet) {
    list = list.filter((u) =>
      needle(u.walletaddress && u.walletaddress[0]).includes(wallet)
    );
  }
  const sort = String(body.sort || "").toLowerCase();
  if (sort === "desc" || sort === "date") {
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sort === "asc") {
    list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }
  return list;
}

/**
 * @param {string[]} segments path after /api/
 * @param {import('http').IncomingMessage} req
 */
function resolveDemoPayload(segments, req) {
  const path = segments.join("/").toLowerCase();
  const method = (req.method || "GET").toUpperCase();
  const args = pageArgs(req);

  // ---------- conversions / swap ----------
  if (path.includes("conversion/deswaptodollar")) {
    return ok({ conversion: 0.257, data: { PriceInUSD: 0.257 } });
  }
  if (path.includes("conversion/dollartodeswap")) {
    return ok({ conversion: 3.89, data: { PriceInUSD: 3.89 } });
  }
  if (path.includes("conversion/savedollartodeswap") || path.includes("conversion/dollartodeswap")) {
    return ok({ conversion: 3.89, total: 3.89, data: { PriceInUSD: 3.89 } });
  }
  if (path.includes("conversion/dollartomatic") || path.includes("conversion/matictodollar") || path.includes("saveddollartomatic")) {
    return ok({ conversion: 0.82, total: 0.82, data: { PriceInUSD: 0.82 } });
  }
  if (path.includes("swap/exchange") || path.includes("users/swap")) {
    return ok({
      data: { data: "1.2450", Price: 1.245, conversion: 1.245 },
      Price: 1.245,
      conversion: 1.245,
    });
  }
  if (path.includes("exchange/graphdata") || path.includes("graphdata")) {
    const now = Date.now();
    const points = Array.from({ length: 24 }, (_, i) => ({
      Price: Number((1.12 + Math.sin(i / 3) * 0.08 + i * 0.004).toFixed(4)),
      created_at: new Date(now - (23 - i) * 5 * 60 * 1000).toISOString(),
    }));
    return ok({ data: points });
  }

  // ---------- credentials / profile ----------
  if (path.includes("getusercredentials") || path.endsWith("getusercredentials")) {
    return ok({
      UserCredentails: {
        username: mock.demoUser.username,
        emailid: mock.demoUser.emailid,
        uuid: mock.demoUser.uuid,
        walletaddress: mock.demoUser.walletaddress,
        address: mock.demoUser.address,
      },
      userNetwork: [],
    });
  }
  if (path.includes("users/profile/fetch")) {
    return ok({ data: { Location: "/images/avatar.png" } });
  }
  if (path.includes("users/profile/info") || path.includes("users/profile")) {
    return ok({
      data: {
        username: mock.demoUser.username,
        emailid: mock.demoUser.emailid,
        walletaddress: mock.demoUser.walletaddress,
        address: mock.demoUser.address,
        createdAt: mock.demoUser.createdAt,
        profilePic: "/images/avatar.png",
        marketPlaceBio: "Deswap demo account",
        social_facebook: "",
        social_twitter: "",
      },
      walletaddress: mock.demoUser.walletaddress,
      username: mock.demoUser.username,
      emailid: mock.demoUser.emailid,
    });
  }

  // ---------- user packs (exclude admin/*) ----------
  if (!path.startsWith("admin/") && path.includes("purchasedpack/fetch/active")) {
    return ok({ data: mock.purchasedActive, totaldata: mock.purchasedActive.length });
  }
  if (!path.startsWith("admin/") && path.includes("purchasedpack/fetch/claimmed")) {
    return ok({ data: mock.purchasedClaimed, totaldata: mock.purchasedClaimed.length });
  }
  if (!path.startsWith("admin/") && path.includes("purchasedpack/fetch/data")) {
    return ok({
      data: {
        avaible: [{ totalrewards: 2480.5, totalbonousrewards: 124.25 }],
        locked: [{ totalrewards: 10000 }],
        claimmed: [{ totalrewards: 362.25 }],
      },
    });
  }
  if (!path.startsWith("admin/") && (path.includes("purchasedpack/fetch/all") || path.includes("purchasedpack/fetch"))) {
    const all = [...mock.purchasedActive, ...mock.purchasedClaimed];
    return ok(mock.paginate(all, args));
  }
  if (path.includes("users/pack/fetch/boughtpack")) {
    const packsBought = Array.from({ length: 12 }, (_, i) => ({
      created_at: new Date(new Date().getFullYear(), i, 8 + (i % 4)).toISOString(),
      TotalAmount: 200 + i * 40,
    }));
    return ok({
      success: true,
      totalUserPackPurchased: packsBought,
      data: packsBought,
    });
  }
  if (path.includes("users/pack/fetch/fetchreferral") || path.includes("pack/fetch/fetchreferral")) {
    const referrals = Array.from({ length: 12 }, (_, i) => ({
      created_at: new Date(new Date().getFullYear(), i, 3 + (i % 5)).toISOString(),
    }));
    return ok({
      success: true,
      totalUserReferrals: referrals,
      data: referrals,
    });
  }
  if (path.includes("users/pack/fetch") || path.includes("users/pack")) {
    if (method === "POST" && (path.includes("insert") || path.includes("claim"))) {
      return ok({ data: true, message: "Demo pack action successful" });
    }
    return ok(mock.paginate(mock.packCatalog, args));
  }

  // ---------- network (exclude admin) ----------
  if (!path.startsWith("admin/") && path.includes("network/upline")) {
    const upline = Array.from({ length: 5 }, (_, i) => ({
      MetaMaskAccountPublicKey: `0xUp${String(i + 1).padStart(4, "0")}Cc6634C0532925a3b844Bc9e7595`,
      username: `upline${i + 1}`,
      emailid: `upline${i + 1}@deswap.co`,
    }));
    return ok({ data: upline });
  }
  if (!path.startsWith("admin/") && path.includes("network/downline")) {
    const downline = Array.from({ length: 8 }, (_, level) =>
      Array.from({ length: 2 }, (_, i) => ({
        walletaddress: `0xDn${level}${i}Cc6634C0532925a3b844Bc9e7595f0bEb0`,
        MetaMaskAccountPublicKey: `0xDn${level}${i}Cc6634C0532925a3b844Bc9e7595f0bEb0`,
        username: `downline-${level + 1}-${i + 1}`,
      }))
    );
    return ok({ data: downline });
  }
  if (!path.startsWith("admin/") && path.includes("network/fetch/totaldata")) {
    return ok({
      data: {
        total: [{ totalRewards: mock.dashboardSummary.totalRewardsUSD }],
        claimmed: [{ totalRewards: mock.dashboardSummary.claimedRewards }],
        avaible: [{ totalRewards: mock.dashboardSummary.availableRewards }],
      },
      total: [{ totalRewards: mock.dashboardSummary.totalRewardsUSD }],
      claimmed: [{ totalRewards: mock.dashboardSummary.claimedRewards }],
      avaible: [{ totalRewards: mock.dashboardSummary.availableRewards }],
    });
  }
  if (!path.startsWith("admin/") && path.includes("network/fetch/claimmed")) {
    const claimed = mock.networkRewardRows
      .filter((r) => r.Status === "Claimmed")
      .map((r, i) => ({
        ...r,
        Level: r.level,
        ClaimmedNetworkID: {
          PublicAddress: r.UserFrom?.walletaddress?.[0] || `0xClaim${i}`,
          TxHash: `0xclaimtx${String(i + 1).padStart(4, "0")}aabb`,
        },
      }));
    return ok({
      ...mock.paginate(claimed, args),
      count: claimed.length,
      totaldata: claimed.length,
    });
  }
  if (!path.startsWith("admin/") && path.includes("network/rewards") && path.includes("claim")) {
    return ok({ data: true, message: "Demo rewards claimed" });
  }
  if (!path.startsWith("admin/") && (path.includes("network/fetch/all") || path.includes("network/fetch"))) {
    return ok({
      data: mock.networkRewardRows,
      totaldata: mock.networkRewardRows.length,
      count: mock.networkRewardRows.length,
      ...mock.paginate(mock.networkRewardRows, args),
    });
  }
  if (!path.startsWith("admin/") && path.includes("network/rewards")) {
    return ok({
      data: {
        total: [{ totalRewards: mock.dashboardSummary.totalRewardsUSD }],
        claimmed: [{ totalRewards: mock.dashboardSummary.claimedRewards }],
        avaible: [{ totalRewards: mock.dashboardSummary.availableRewards }],
      },
      total: [{ totalRewards: mock.dashboardSummary.totalRewardsUSD }],
      claimmed: [{ totalRewards: mock.dashboardSummary.claimedRewards }],
      avaible: [{ totalRewards: mock.dashboardSummary.availableRewards }],
    });
  }

  // ---------- nft license ----------
  if (!path.startsWith("admin/") && path.includes("purchasednftlicense")) {
    return ok({
      ...mock.paginate(mock.purchasedNftLicenses, args),
      max: { Index: 100 },
    });
  }
  if (!path.startsWith("admin/") && path.includes("nftlicense")) {
    if (path.includes("insert")) {
      return ok({ data: true, message: "Demo NFT license purchased" });
    }
    return ok({
      ...mock.paginate(mock.nftLicenses, args),
      max: { Index: 100 },
    });
  }

  // ---------- company ----------
  if (path.includes("users/company") || path.includes("company/fetchmycompany")) {
    if (path.includes("insert")) {
      return ok({ data: true, message: "Demo company listed" });
    }
    return ok(mock.paginate(filterCompanies(parseBody(req)), args));
  }

  // ---------- admin ----------
  if (path.includes("admin/navbarinfo")) {
    return ok({
      data: {
        username: mock.demoAdmin.username,
        emailid: mock.demoAdmin.emailid,
        notifications: 3,
        RequestedPacks: 4,
        RequestedPurchasedPacks: 6,
        RequestedUserTransactions: 3,
        RequestedNetworkRewards: 5,
      },
      username: mock.demoAdmin.username,
      emailid: mock.demoAdmin.emailid,
      RequestedPacks: 4,
      RequestedPurchasedPacks: 6,
      RequestedUserTransactions: 3,
      RequestedNetworkRewards: 5,
    });
  }
  if (path.includes("admin/purchasedpack/fetch/total")) {
    return ok({
      total: 128450.75,
      totalUsers: mock.adminUsers.length,
    });
  }
  if (path.includes("admin/purchasedpack/fetch/all")) {
    return ok({
      ...mock.paginate(mock.adminPurchasedPacks, args),
      data: mock.paginate(mock.adminPurchasedPacks, args).data,
    });
  }
  // Charts before generic purchasedpack/clammied matchers
  if (
    path.includes("admin/users/totalaccount") ||
    path.includes("admin/users/totalpacks") ||
    path.includes("admin/graph") ||
    path.includes("chart") ||
    path.includes("fetch/graph")
  ) {
    const series = mock.monthDaySeries(42);
    return ok({
      data: series,
      labels: series.map((s) => Number(s._id.split("-")[2])),
      total: series.reduce((a, b) => a + b.totalQty, 0),
    });
  }
  if (path.includes("admin/clammied") || path.includes("admin/claimmed") || path.includes("networkclaimmed")) {
    if (method !== "GET" && (path.includes("update") || path.includes("approve") || path.includes("delete"))) {
      return ok({ data: true, message: "Demo admin action successful" });
    }
    return ok(mock.paginate(mock.claimedNetworkAdmin, args));
  }
  if (path.includes("admin/purchasedpack")) {
    if (method !== "GET" && (path.includes("update") || path.includes("approve") || path.includes("delete"))) {
      return ok({ data: true, message: "Demo admin action successful" });
    }
    return ok(mock.paginate(mock.adminPurchasedPacks, args));
  }
  if (
    path.endsWith("admin/users/total") ||
    path.includes("admin/users/total/") ||
    path === "admin/users/total"
  ) {
    return ok({
      data: {
        totalUsers: mock.adminUsers.length,
        totaPackPurchased: mock.adminPurchasedPacks.length,
      },
      totalUsers: mock.adminUsers.length,
    });
  }
  if (path.includes("admin/network/upline") || path.includes("admin/network/downline")) {
    const line = Array.from({ length: 6 }, (_, i) => ({
      MetaMaskAccountPublicKey: `0xAd${String(i + 1).padStart(4, "0")}Cc6634C0532925a3b844Bc9e7595`,
      username: `member${i + 1}`,
      emailid: `member${i + 1}@deswap.co`,
    }));
    return ok({ data: line });
  }
  if (path.includes("admin/users/list") || path.includes("admin/users/total") || path.includes("admin/users")) {
    if (path.includes("update")) {
      return ok({ data: true, message: "Demo user updated" });
    }
    const users = filterAdminUsers(parseBody(req));
    return ok({
      ...mock.paginate(users, args),
      total: users.length,
      totalUsers: users.length,
    });
  }
  if (path.includes("admin/pack")) {
    if (path.includes("insert") || path.includes("update") || path.includes("delete")) {
      return ok({ data: true, message: "Demo pack saved" });
    }
    return ok(mock.paginate(mock.packCatalog, args));
  }
  if (path.includes("admin/company/catagory")) {
    if (path.includes("insert") || path.includes("update") || path.includes("delete")) {
      return ok({ data: true, message: "Demo category saved" });
    }
    return ok(mock.paginate(mock.companyCategories, args));
  }
  if (path.includes("admin/company/fetch/requested") || path.includes("admin/companyfee")) {
    return ok(mock.paginate(mock.feeRequests, args));
  }
  if (path.includes("admin/publickey")) {
    return ok(mock.paginate(mock.publicKeyFees, args));
  }
  if (path.includes("admin/companyrewards")) {
    if (path.includes("chart") || path.includes("graph")) {
      const series = mock.monthDaySeries(36);
      return ok({ data: series });
    }
    return ok(mock.paginate(mock.feeRequests, args));
  }
  if (path.includes("admin/company")) {
    if (path.includes("insert") || path.includes("update")) {
      return ok({ data: true, message: "Demo company action successful" });
    }
    const companies = filterCompanies(parseBody(req));
    return ok({
      ...mock.paginate(companies, args),
      totalCompany: companies.length,
      totalActiveCompany: companies.filter((c) => c.status === "active").length,
    });
  }
  if (path.includes("admin/swap")) {
    if (path.includes("update") || path.includes("insert")) {
      return ok({ data: true, message: "Demo swap updated" });
    }
    return ok(mock.paginate(mock.swapRequests, args));
  }
  if (path.includes("admin/companyrewards") || path.includes("admin/userpurchased")) {
    return ok(mock.paginate(mock.adminPurchasedPacks, args));
  }
  if (path.includes("admin/rewardssetting")) {
    if (path.includes("insert") || path.includes("update") || path.includes("delete")) {
      return ok({ data: true, message: "Demo reward setting saved" });
    }
    return ok({
      ...mock.paginate(mock.networkRewardSettings, { ...args, limit: 20 }),
      data: mock.networkRewardSettings,
    });
  }
  if (path.includes("admin/nftlicense") || path.includes("admin/reward") || path.includes("admin/level")) {
    if (path.includes("insert") || path.includes("update") || path.includes("delete")) {
      return ok({ data: true, message: "Demo admin save successful" });
    }
    if (path.includes("admin/rewardlevel") || path.includes("admin/level")) {
      return ok(mock.paginate(mock.companyRewardLevels, args));
    }
    return ok(mock.paginate(mock.nftLicenses, args));
  }

  // ---------- marketplace / misc ----------
  if (path.includes("marketplace") || path.includes("nfts")) {
    return ok(mock.paginate(mock.nfts, args));
  }

  // Mutations default success in demo
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return ok({
      data: true,
      message: "Demo action completed",
      success: true,
    });
  }

  // Fallback dashboard summary
  return ok({
    data: mock.dashboardSummary,
    message: "Demo mock",
    path,
    resources: ["users", "admin", "conversion", "packs", "network"],
  });
}

module.exports = { resolveDemoPayload, parseBody };
