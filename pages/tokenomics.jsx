import TokenomicsSection1 from "@/components/tokenomics/TokenomicsSection1";
import TokenomicsSection2 from "@/components/tokenomics/TokenomicsSection2";
import TokenomicsSection3 from "@/components/tokenomics/TokenomicsSection3";
import TokenomicsSection4 from "@/components/tokenomics/TokenomicsSection4";
import { LandingpageLayout } from "@/layout/landingpage.layout";

export default function Tokenomics() {
  return (
    <>
      <div className="TokenomicsContainer">
        <TokenomicsSection1 />
        <TokenomicsSection2 />
        <TokenomicsSection3 />
      </div>
      <TokenomicsSection4 />
    </>
  );
}
Tokenomics.PageLayout = LandingpageLayout;
