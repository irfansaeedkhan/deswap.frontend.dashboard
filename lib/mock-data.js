/**
 * Shared demo fixtures for Deswap dashboard (pagination-aware).
 * Used by /api/mock/* and DEMO_MODE handlers.
 */

const PAGE_SIZE = 10;

function paginate(items, { page = 1, offset, limit = PAGE_SIZE } = {}) {
  const size = Number(limit) || PAGE_SIZE;
  let start;
  let activePageNo;
  if (offset !== undefined && offset !== null && offset !== "") {
    start = Number(offset) || 0;
    activePageNo = Math.floor(start / size) + 1;
  } else {
    activePageNo = Math.max(1, Number(page) || 1);
    start = (activePageNo - 1) * size;
  }
  const slice = items.slice(start, start + size);
  return {
    data: slice,
    total: items.length,
    activePageNo,
    pageSize: size,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
    hasNext: start + size < items.length,
    hasPrev: start > 0,
  };
}

const demoUser = {
  emailid: "demo@deswap.co",
  uuid: "demo-user-uuid-0001",
  username: "demouser",
  accountverified: true,
  emailverified: true,
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
  role: "User",
  messageCodeAuth: true,
};

const packs = Array.from({ length: 14 }, (_, i) => ({
  _id: `pack-${i + 1}`,
  name: `Deswap Pack ${i + 1}`,
  price: Number((100 + i * 25.5).toFixed(2)),
  currency: "USDC",
  lockup: 30 + (i % 3) * 30,
  lockupinterval: "days",
  status: ["active", "pending", "claimed", "expired"][i % 4],
  purchaseddate: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  rewards: Number((i * 1.23456789).toFixed(8)),
}));

const networkRewards = Array.from({ length: 16 }, (_, i) => ({
  _id: `nr-${i + 1}`,
  level: (i % 5) + 1,
  amount: Number((12.345678 + i * 0.111111).toFixed(8)),
  currency: "USDC",
  status: ["available", "claimed", "pending"][i % 3],
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
}));

const companies = Array.from({ length: 15 }, (_, i) => ({
  _id: `co-${i + 1}`,
  name: `Company ${i + 1}`,
  owner: `owner${i + 1}@deswap.co`,
  employees: 3 + (i % 8),
  business: ["DeFi", "NFT", "Gaming", "Infra"][i % 4],
  catagoryName: ["Startup", "Enterprise", "DAO"][i % 3],
  created_at: new Date(Date.now() - i * 86400000 * 5).toISOString(),
  renewalDate: new Date(Date.now() + i * 86400000 * 10).toISOString(),
  expireDate: new Date(Date.now() + i * 86400000 * 40).toISOString(),
}));

const nfts = Array.from({ length: 14 }, (_, i) => ({
  _id: `nft-${i + 1}`,
  name: `Deswap NFT #${i + 1}`,
  price: Number((0.5 + i * 0.15).toFixed(4)),
  currency: "MATIC",
  image: "/images/logo.png",
  status: ["listed", "sold", "auction", "staked"][i % 4],
  owner: demoUser.address,
}));

const dashboardSummary = {
  totalDeswap: "12,480.50",
  totalUSD: "3,210.25",
  totalRewardsUSD: 482.5,
  totalRewardsDeswap: 1920.0,
  availableRewards: 120.25,
  claimedRewards: 362.25,
  profile: {
    emailid: demoUser.emailid,
    username: demoUser.username,
    walletaddress: demoUser.address,
  },
};

module.exports = {
  PAGE_SIZE,
  paginate,
  demoUser,
  packs,
  networkRewards,
  companies,
  nfts,
  dashboardSummary,
  DEMO_CREDENTIALS: {
    email: "demo@deswap.co",
    password: "Demo@1234",
  },
};
