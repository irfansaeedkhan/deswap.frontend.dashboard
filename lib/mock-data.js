/**
 * Client-demo fixtures — shapes match what dashboard widgets expect.
 * No MongoDB required.
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
    totaldata: items.length,
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
  walletaddress: ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"],
  role: "User",
  messageCodeAuth: true,
  createdAt: new Date("2024-01-15T10:00:00.000Z").toISOString(),
};

const demoAdmin = {
  emailid: "admin@deswap.co",
  uuid: "demo-admin-uuid-0001",
  username: "demoadmin",
  accountverified: true,
  emailverified: true,
  address: "0xAdmin35Cc6634C0532925a3b844Bc9e7595f0bEb1",
  role: "DeswapAdminRole",
  messageCodeAuth: true,
};

const DEMO_CREDENTIALS = {
  email: "demo@deswap.co",
  password: "Demo@1234",
};

const DEMO_ADMIN_CREDENTIALS = {
  email: "admin@deswap.co",
  password: "Admin@1234",
};

const packCatalog = Array.from({ length: 12 }, (_, i) => ({
  _id: `pack-catalog-${i + 1}`,
  DAW: 10 + i * 2.5,
  PackName: `Deswap Pack ${i + 1}`,
  Name: `Deswap Pack ${i + 1}`,
  name: `Deswap Pack ${i + 1}`,
  Price: 100 + i * 50,
  price: 100 + i * 50,
  Amount: 100 + i * 50,
  Currency: "USDC",
  Bonous: 5 + (i % 5),
  LockedPeriod: 30 + (i % 3) * 30,
  LockedPeriodType: "days",
  lockup: 30 + (i % 3) * 30,
  lockupinterval: "days",
  description: `Earn rewards with Deswap staking pack ${i + 1}`,
  Status: "Active",
  maxlicense: 100,
  currentIndex: i + 1,
}));

const purchasedActive = Array.from({ length: 8 }, (_, i) => ({
  _id: `purchased-active-${i + 1}`,
  TotalAmount: 250 + i * 75.5,
  Quantity: 1 + (i % 3),
  created_at: new Date(Date.now() - (40 + i * 5) * 86400000).toISOString(),
  Status: i % 2 === 0 ? "Active" : "Locked",
  Currency: "USDC",
  PackID: {
    PackName: `Deswap Pack ${(i % 4) + 1}`,
    Name: `Deswap Pack ${(i % 4) + 1}`,
    Bonous: 5 + (i % 3),
    DAW: 12.5 + i * 3.25,
    LockedPeriod: 30,
    LockedPeriodType: "days",
    Price: 100 + i * 50,
  },
}));

const purchasedClaimed = Array.from({ length: 6 }, (_, i) => ({
  _id: `purchased-claimed-${i + 1}`,
  TotalAmount: 180 + i * 40,
  Quantity: 1,
  created_at: new Date(Date.now() - i * 86400000 * 10).toISOString(),
  claimed_at: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  Status: "Claimmed",
  Currency: "USDC",
  TxHash: `0xa94e${String(i + 1).padStart(4, "0")}c31b8d639c`,
  txhash: `0xa94e${String(i + 1).padStart(4, "0")}c31b8d639c`,
  PackID: {
    PackName: `Deswap Pack ${(i % 3) + 1}`,
    Name: `Deswap Pack ${(i % 3) + 1}`,
    Bonous: 8,
    DAW: 18.5 + i * 2,
    LockedPeriod: 60,
    LockedPeriodType: "days",
    Price: 150,
  },
}));

const networkRewardRows = Array.from({ length: 14 }, (_, i) => ({
  _id: `nr-row-${i + 1}`,
  Amount: 20 + i * 3.25,
  RewardsPercentage: 0.05 + (i % 5) * 0.01,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  Status: i % 3 === 0 ? "Claimmed" : "Locked",
  level: (i % 5) + 1,
  UserFrom: {
    username: `member${i + 1}`,
    walletaddress: [`0xMember${String(i + 1).padStart(3, "0")}Cc6634C0532925a3b844Bc9e7595`],
  },
}));

const nftImagePool = [
  "/images/nftLcard1.png",
  "/images/nftLcard2.png",
  "/images/nft1.png",
  "/images/nft2.png",
  "/images/nft3.png",
  "/images/nft4.png",
  "/images/nft5.png",
  "/images/licensecardImg.png",
  "/images/networklicense1.png",
  "/images/networklicense2.png",
  "/images/networklicense3.png",
  "/images/licenseLogo.png",
];

const companyLogoPool = [
  "/images/companylogo1.png",
  "/images/octagonLogo.png",
  "/images/licenseLogo.png",
  "/images/avatar.png",
  "/images/companyprofile.png",
];

const companies = Array.from({ length: 15 }, (_, i) => ({
  _id: `co-${i + 1}`,
  name: `Company ${i + 1}`,
  username: `company${i + 1}`,
  owner: `owner${i + 1}@deswap.co`,
  email: `hello${i + 1}@company${i + 1}.io`,
  address: `${120 + i} Blockchain Ave, Suite ${i + 1}, Dubai`,
  employees: 3 + (i % 8),
  business: ["DeFi", "NFT", "Gaming", "Infra"][i % 4],
  catagoryName: ["Startup", "Enterprise", "DAO"][i % 3],
  ipfSURL: companyLogoPool[i % companyLogoPool.length],
  created_at: new Date(Date.now() - i * 86400000 * 5).toISOString(),
  renewalDate: new Date(Date.now() + i * 86400000 * 10).toISOString(),
  expireDate: new Date(Date.now() + i * 86400000 * 40).toISOString(),
  status: ["active", "pending", "approved"][i % 3],
}));

const companyCategories = [
  { _id: "cat-1", Name: "Startup", Description: "Early-stage Web3 companies", Status: "Active" },
  { _id: "cat-2", Name: "Enterprise", Description: "Established protocol teams", Status: "Active" },
  { _id: "cat-3", Name: "DAO", Description: "Decentralized organizations", Status: "Active" },
  { _id: "cat-4", Name: "Marketplace", Description: "NFT and token marketplaces", Status: "Active" },
  { _id: "cat-5", Name: "Infrastructure", Description: "Nodes, RPC and tooling", Status: "Active" },
];

const companyRewardLevels = [
  { _id: "lvl-1", Name: "Bronze", Description: "Entry company reward level", Status: "Active", Percentage: 2 },
  { _id: "lvl-2", Name: "Silver", Description: "Mid company reward level", Status: "Active", Percentage: 4 },
  { _id: "lvl-3", Name: "Gold", Description: "Top company reward level", Status: "Active", Percentage: 7 },
];

const networkRewardSettings = Array.from({ length: 8 }, (_, i) => ({
  _id: `nrs-${i + 1}`,
  Level: i + 1,
  Percentage: [12, 10, 8, 7, 5, 4, 3, 2][i],
  Status: i === 7 ? "Deactivated" : "Active",
}));

const feeRequests = Array.from({ length: 12 }, (_, i) => ({
  _id: `fee-${i + 1}`,
  name: `Company ${i + 1}`,
  uuid: {
    emailid: `owner${i + 1}@deswap.co`,
    walletaddress: [`0xFee${String(i + 1).padStart(4, "0")}Cc6634C0532925a3b844Bc9e7595`],
  },
  created_at: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  TxHash: `0xfee${String(i + 1).padStart(4, "0")}aabbccddeeff0011223344556677`,
  Amount: 120 + i * 15,
  AmountInMatic: 85.25 + i * 3.1,
  CorrectAmountInMatic: 85.25 + i * 3.1,
  conversionRate: 0.82,
  ConversionRate: 0.82,
  Status: ["Requested", "Approved", "Pending"][i % 3],
  transactionDetails: {
    from: `0xFee${String(i + 1).padStart(4, "0")}Cc6634C0532925a3b844Bc9e7595`,
    to: "0xAdmin35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    value: "85000000000000000000",
  },
}));

const publicKeyFees = feeRequests.map((row, i) => ({
  ...row,
  _id: `pkfee-${i + 1}`,
  TxHash: `0xpk${String(i + 1).padStart(4, "0")}aabbccddeeff0011223344556677`,
}));

const nftLicenses = Array.from({ length: 12 }, (_, i) => ({
  _id: `nft-lic-${i + 1}`,
  Name: `NFT License ${i + 1}`,
  name: `NFT License ${i + 1}`,
  Price: 50 + i * 25,
  price: 50 + i * 25,
  Currency: "USDC",
  currency: "USDC",
  Description: `Deswap NFT license tier ${i + 1}`,
  description: `Deswap NFT license tier ${i + 1}`,
  LookUp: 90,
  LookUpInterval: "days",
  lockup: 90,
  lockupinterval: "days",
  Image: nftImagePool[i % nftImagePool.length],
  Index: i + 1,
  maxlicense: 100,
  currentIndex: i + 1,
  imagelocation: nftImagePool[i % nftImagePool.length],
  imgPlaceholder: nftImagePool[i % nftImagePool.length],
  status: ["available", "sold", "active"][i % 3],
}));

const purchasedNftLicenses = Array.from({ length: 8 }, (_, i) => ({
  _id: `pnft-${i + 1}`,
  Quantity: 1,
  created_at: new Date(Date.now() - i * 86400000 * 7).toISOString(),
  NftLicense: {
    Name: `Active NFT License ${i + 1}`,
    Description: "Purchased NFT license",
    Price: 75 + i * 20,
    Currency: "USDC",
    LookUp: 90,
    LookUpInterval: "days",
    Image: nftImagePool[i % nftImagePool.length],
    Index: i + 1,
  },
  name: `Active NFT License ${i + 1}`,
  price: 75 + i * 20,
  currency: "USDC",
  description: "Purchased NFT license",
  lockup: 90,
  lockupinterval: "days",
  purchasedindex: i + 1,
  maxindex: 100,
  purchaseddate: new Date(Date.now() - i * 86400000 * 7).toISOString(),
  claimcountdown: `${10 + i}d`,
  imagelocation: nftImagePool[i % nftImagePool.length],
  id: `pnft-${i + 1}`,
}));

const nfts = Array.from({ length: 14 }, (_, i) => ({
  _id: `nft-${i + 1}`,
  name: `Deswap NFT #${i + 1}`,
  price: Number((0.5 + i * 0.15).toFixed(4)),
  currency: "MATIC",
  image: nftImagePool[i % nftImagePool.length],
  status: ["listed", "sold", "auction", "staked"][i % 4],
  owner: demoUser.address,
}));

const adminUsers = Array.from({ length: 18 }, (_, i) => ({
  _id: `user-${i + 1}`,
  username: `user${i + 1}`,
  emailid: `user${i + 1}@deswap.co`,
  uuid: `uuid-user-${i + 1}`,
  walletaddress: [`0xUser${String(i + 1).padStart(4, "0")}6634C0532925a3b844Bc9e7595`],
  created_at: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  status: ["active", "pending", "verified"][i % 3],
  role: "User",
}));

const adminPurchasedPacks = Array.from({ length: 16 }, (_, i) => ({
  _id: `admin-pp-${i + 1}`,
  TotalAmount: 200 + i * 55,
  Amount: 200 + i * 55,
  AmountInMatic: 140 + i * 8,
  DAW: 150 + i * 12.5,
  created_at: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  Status: ["Requested", "Approved", "Claimmed", "Pending"][i % 4],
  TxHash: `0xpack${String(i + 1).padStart(4, "0")}aabbccddeeff001122334455`,
  username: `user${(i % 8) + 1}`,
  emailid: `user${(i % 8) + 1}@deswap.co`,
  walletaddress: `0xUser${String((i % 8) + 1).padStart(4, "0")}6634C0532925a3b844Bc9e7595`,
  uuid: {
    emailid: `user${(i % 8) + 1}@deswap.co`,
    username: `user${(i % 8) + 1}`,
    walletaddress: [
      `0xUser${String((i % 8) + 1).padStart(4, "0")}6634C0532925a3b844Bc9e7595`,
    ],
  },
  UserID: {
    username: `user${(i % 8) + 1}`,
    emailid: `user${(i % 8) + 1}@deswap.co`,
    walletaddress: [
      `0xUser${String((i % 8) + 1).padStart(4, "0")}6634C0532925a3b844Bc9e7595`,
    ],
  },
  PackID: {
    Name: `Deswap Pack ${(i % 5) + 1}`,
    Price: 100 + (i % 5) * 50,
    Bonous: 5,
  },
}));

const claimedNetworkAdmin = Array.from({ length: 16 }, (_, i) => ({
  _id: `cnr-${i + 1}`,
  Amount: Number((18.5 + i * 2.75).toFixed(2)),
  TxHash: `0xclaim${String(i + 1).padStart(4, "0")}aabbccddeeff0011223344556677`,
  created_at: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  Status: ["Requested", "Approved", "Claimmed"][i % 3],
  RequestStatus: ["Requested", "Approved", "Pending"][i % 3],
  RejectReason: i % 4 === 0 ? "Amount mismatch" : "",
  PublicAddress: `0xPub${String(i + 1).padStart(4, "0")}Cc6634C0532925a3b844Bc9e7595`,
  NetworkRewardsID: {
    UserTo: { emailid: `user${(i % 8) + 1}@deswap.co` },
    UserFrom: { emailid: `member${(i % 6) + 1}@deswap.co` },
    PublicAddress: `0xPub${String(i + 1).padStart(4, "0")}Cc6634C0532925a3b844Bc9e7595`,
  },
  transactionDetails: {
    from: `0xFrom${String(i + 1).padStart(4, "0")}Cc6634C0532925a3b844Bc9e7595`,
    to: "0xAdmin35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    value: "1500000000000000000",
  },
}));

const chartMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function chartSeries(seed = 10) {
  return chartMonths.map((_, i) => Math.round(seed + i * 7 + (i % 3) * 12));
}

function monthDaySeries(seed = 48) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const last = new Date(year, month + 1, 0).getDate();
  const m = String(month + 1).padStart(2, "0");
  return Array.from({ length: last }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const wave = Math.round(seed + (i + 1) * 6 + Math.sin(i / 2.4) * 28);
    return {
      _id: `${year}-${m}-${day}`,
      count: 3 + ((i * 5) % 16),
      totalQty: Math.max(12, wave),
      totalAmount: Math.max(12, wave) * 14.5,
      createdAt: `${year}-${m}-${day}T12:00:00.000Z`,
    };
  });
}

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

const packs = packCatalog;

const networkRewards = networkRewardRows;

module.exports = {
  PAGE_SIZE,
  paginate,
  demoUser,
  demoAdmin,
  DEMO_CREDENTIALS,
  DEMO_ADMIN_CREDENTIALS,
  packCatalog,
  packs,
  purchasedActive,
  purchasedClaimed,
  networkRewardRows,
  networkRewards,
  companies,
  companyCategories,
  companyRewardLevels,
  networkRewardSettings,
  feeRequests,
  publicKeyFees,
  nftLicenses,
  purchasedNftLicenses,
  nfts,
  adminUsers,
  adminPurchasedPacks,
  claimedNetworkAdmin,
  chartMonths,
  chartSeries,
  monthDaySeries,
  dashboardSummary,
};
