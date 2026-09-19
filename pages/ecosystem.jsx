import EcosystemSection1 from "@/components/ecosystem/EcosystemSection1";
import EcosystemSection2 from "@/components/ecosystem/EcosystemSection2";
import { LandingpageLayout } from "@/layout/landingpage.layout";
function Ecosystem() {
  return (
    <div className="EcosystemContainer">
      <EcosystemSection1 />
      <EcosystemSection2 />
    </div>
  );
}

export default Ecosystem;
Ecosystem.PageLayout = LandingpageLayout;
