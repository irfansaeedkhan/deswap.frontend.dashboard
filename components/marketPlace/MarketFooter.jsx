import Image from "next/image";
import Link from "next/link";
import TelegramIcon from "@/assets/svgAssets/TelegramIcon";
import RedditIcon from "@/assets/svgAssets/RedditIcon";
import TwitterIcon from "@/assets/svgAssets/TwitterIcon";
import MediumIcon from "@/assets/svgAssets/MediumIcon";

// import DeswapWhitepaper from "@/assets/DeswapWhitepaper.pdf";
import SimpleButton from "../reusables/SimpleButton";
import { useRouter } from "next/router";
function MarketFooter() {
  const router = useRouter();

  const handleLaunchApp = (e) => {
    e.preventDefault()
    router.push('/user/login')
  }
  return (
    <footer className="footerContainer">
      <div className="footerInner">
        {/* launch app */}
        <div className="launchAppContainer">
          <div className="launchAppInner deswapMax">
            <div className="leftbox">
              <div className="content">
                <h2>
                  Worlds First Money Markets Liquidity Protocol Built On Polygon
                  Chain
                </h2>
              </div>
            </div>
            <div className="rightbox">
              <div className="content">
                <p>
                  Ready to create a unique <br /> experience? Let&apos;s get in
                  touch!
                </p>
                <div className="btnRound ">
                  <div className="roundBox"></div>
                  <button onClick={handleLaunchApp} className="icon">Launch App Now!</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyrightContainer">
          <div className="copyrightInner deswapMax">
            <div className="textBox">
              <h6>Copyright © 2021</h6>
            </div>
            <div className="linkBox">
              <div className="linkBoxImg  navItem1 Svgneon-button" >
                <TelegramIcon />
                {/* <Image  width={800} height={600}   src="/images/telegram.png"    alt="telegram"  style={{ width: "100%", height: "auto", objectFit: "contain" }} /> */}
              </div>
              <div className="linkBoxImg navItem2 Svgneon-button">
                <RedditIcon />
                {/* <Image  width={800} height={600}  
                  className="linkBoxImg navItem1 Svgneon-button"
                  
                  src="/images/redit.png"
                  alt="redit"
                 style={{ width: "100%", height: "auto", objectFit: "contain" }} /> */}
              </div>
              <div className="linkBoxImg navItem3 Svgneon-button">
              <MediumIcon />
                {/* <Image  width={800} height={600}  
                  className="linkBoxImg navItem1 Svgneon-button"
                  
                  src="/images/medium.png"

                  alt="medium"
                 style={{ width: "100%", height: "auto", objectFit: "contain" }} /> */}
              </div>
              <div className="linkBoxImg navItem4 Svgneon-button">
                {/* <Image  width={800} height={600}  
                  className="linkBoxImg"
                  
                  src="/images/twitter.png"
                  alt="twitter"
                 style={{ width: "100%", height: "auto", objectFit: "contain" }} /> */}
                 <TwitterIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MarketFooter;
