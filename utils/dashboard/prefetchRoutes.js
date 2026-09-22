import { useEffect } from "react";
import { useRouter } from "next/router";

const USER_DASHBOARD_ROUTES = [
  "/user/dashboard",
  "/user/dashboard/profile",
  "/user/dashboard/editprofile",
  "/user/dashboard/buydswap",
  "/user/dashboard/company",
  "/user/dashboard/metaverse",
  "/user/dashboard/nftlicense",
  "/user/dashboard/buydeswaptoken",
  "/user/dashboard/network",
  "/user/dashboard/networkdetails",
  "/user/dashboard/createtoken",
];

const ADMIN_DASHBOARD_ROUTES = [
  "/admin/dashboard",
  "/admin/dashboard/addnftlicense",
  "/admin/dashboard/createlevel",
  "/admin/dashboard/createcompanycategory",
  "/admin/dashboard/purchasednftlicense",
  "/admin/dashboard/addclamingpack",
  "/admin/dashboard/purchasedpack",
  "/admin/dashboard/claimmedpack",
  "/admin/dashboard/useraccount",
  "/admin/dashboard/companylist",
  "/admin/dashboard/companyfee",
  "/admin/dashboard/companyrewards",
  "/admin/dashboard/publickeyfee",
  "/admin/dashboard/userregistrationfee",
  "/admin/dashboard/swapmatictodaw",
  "/admin/dashboard/networkrewards",
  "/admin/dashboard/claimmednetworkrewards",
  "/admin/dashboard/networkrewardssetting",
];

export function usePrefetchDashboardRoutes(kind) {
  const router = useRouter();
  useEffect(() => {
    const hrefs =
      kind === "admin" ? ADMIN_DASHBOARD_ROUTES : USER_DASHBOARD_ROUTES;
    hrefs.forEach((href) => {
      router.prefetch(href).catch(() => {});
    });
    // Prefetch once when the dashboard chrome mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);
}
