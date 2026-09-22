import HomeSection1 from "@/components/home/HomeSection1";
import HomeSection2 from "@/components/home/HomeSection2";
import HomeSection3 from "@/components/home/HomeSection3";
import HomeSection4 from "@/components/home/HomeSection4";
import HomeSection5 from "@/components/home/HomeSection5";
import { LandingpageLayout } from "@/layout/landingpage.layout";

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
