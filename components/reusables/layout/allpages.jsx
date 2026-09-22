import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import MetaTags from "../metatags";
import { MetaDataArr } from "../constants";

const Loader = dynamic(() => import("@/components/reusables/loader/Loader"), {
  ssr: false,
});

export function PagesLayout({ children, title, description, imagelink }) {
  const router = useRouter();
  const [routeLoading, setRouteLoading] = React.useState(false);

  React.useEffect(() => {
    const start = (url) => {
      if (url.split("?")[0] !== router.asPath.split("?")[0]) {
        setRouteLoading(true);
      }
    };
    const done = () => setRouteLoading(false);
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
    };
  }, [router]);

  const GetPageMetaData = (path) => {
    const pageMetaDes = MetaDataArr.filter((data) => data.url === path);
    return pageMetaDes;
  };
  const metaData = GetPageMetaData(router.asPath);

  return (
    <>
      <MetaTags
        title={metaData && metaData.length > 0 ? metaData[0].title : title}
        description={
          description ||
          "Deswap is the first decentralised marketplace to lend loans, collect interest, and mint synthetic stablecoins on Polygon."
        }
        imagelink={imagelink}
      ></MetaTags>
      {routeLoading && <Loader title="Loading" />}
      {children}
    </>
  );
}
