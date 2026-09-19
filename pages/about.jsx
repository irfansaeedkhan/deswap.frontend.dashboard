import AboutSection1 from "@/components/about/AboutSection1";
import AboutSection2 from "@/components/about/AboutSection2";
import AboutSection3 from "@/components/about/AboutSection3";
import AboutSection4 from "@/components/about/AboutSection4";
import { LandingpageLayout } from "@/layout/landingpage.layout";
function About() {
  return (
    <div className="aboutContainer">
      <AboutSection1 />
      <AboutSection2 />
      <AboutSection3 />
      <AboutSection4 />
    </div>
  );
}

export default About;
About.PageLayout = LandingpageLayout;
