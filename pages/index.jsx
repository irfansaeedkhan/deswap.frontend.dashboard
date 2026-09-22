// components
import dynamic from "next/dynamic";
import HomeSection1 from "@/components/home/HomeSection1";
import { LandingpageLayout } from "@/layout/landingpage.layout";

const HomeSection2 = dynamic(() => import("@/components/home/HomeSection2"), {
  ssr: true,
});
const HomeSection3 = dynamic(() => import("@/components/home/HomeSection3"), {
  ssr: true,
});
const HomeSection4 = dynamic(() => import("@/components/home/HomeSection4"), {
  ssr: true,
});
const HomeSection5 = dynamic(() => import("@/components/home/HomeSection5"), {
  ssr: true,
});

export default function Home() {
  return (
    <div className="homeContainer">
      <HomeSection1 />
      <HomeSection2 />
      <HomeSection3 />
      <HomeSection4 />
      <HomeSection5 />
    </div>
  );
}

Home.PageLayout = LandingpageLayout;
