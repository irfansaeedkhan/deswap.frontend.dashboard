import MetaverseSection1 from "@/components/metaverse/MetaverseSection1";
import MetaverseSection2 from "@/components/metaverse/MetaverseSection2";
import MetaverseSection3 from "@/components/metaverse/MetaverseSection3";
import MetaverseSection4 from "@/components/metaverse/MetaverseSection4";
import MetaverseSection5 from "@/components/metaverse/MetaverseSection5";
import MetaverseSection6 from "@/components/metaverse/MetaverseSection6";
import { LandingpageLayout } from "@/layout/landingpage.layout";

function Metaverse() {
  return (
    <div className="metaverseContainer">
      <MetaverseSection1 />
      <MetaverseSection2 />
      <MetaverseSection3 />
      <MetaverseSection4 />
      <MetaverseSection5 />
      <MetaverseSection6 />
    </div>
  );
}

export default Metaverse;
Metaverse.PageLayout = LandingpageLayout;
