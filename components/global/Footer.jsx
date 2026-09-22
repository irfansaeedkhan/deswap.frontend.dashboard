import Image from "next/image";
import Link from "next/link";
import TelegramIcon from "@/assets/svgAssets/TelegramIcon";
import RedditIcon from "@/assets/svgAssets/RedditIcon";
import TwitterIcon from "@/assets/svgAssets/TwitterIcon";
import MediumIcon from "@/assets/svgAssets/MediumIcon";

// import DeswapWhitepaper from "@/assets/DeswapWhitepaper.pdf";
import SimpleButton from "../reusables/SimpleButton";
import { useRouter } from "next/router";
function Footer() {
  const router = useRouter();

  const handleLaunchApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      window.location.assign("/user/login");
      return;
    }
    router.push("/user/login");
  };
  return (
    <footer className="footerContainer">
      <div className="footerInner">
        {/* white paper */}
        <div className="whitePaperContainer">
          <div className="whitePaperInner deswapMax">
            <div className="content">
              <h2>WhitePaper</h2>
              <p>
                More information about Deswap <br /> “Fastest Synthetic
                stablecoins powering liquidity protocol ever built”
              </p>
              {/* <a href={"/files/Deswap_Whitepaper.pdf"} download>
              <SimpleButton
                text="Download White Paper"
                backgroundColor="#E44757"
                maxWidth="28.3rem"
                fontSize={19}
                fontWeight={700}
              />
              </a> */}
              <Link href={"/files/Deswap_Whitepaper.pdf"} download passHref>
                <SimpleButton
                  text="Download White Paper"
                  backgroundColor="#E44757"
                  color="#FFFFFF"
                  maxWidth="28.3rem"
                  fontSize={19}
                  fontWeight={700}
                />
              </Link>
            </div>
          </div>
        </div>
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
                  <button onClick={handleLaunchApp} className="icon">
                    Launch App Now!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="copyrightContainer">
          <div className="copyrightInner deswapMax">
            <div className="textBox">
              <p>Copyright © 2021</p>
            </div>
            <div className="linkBox">
              <a
                className="linkBoxImg  navItem1 Svgneon-button"
                href="https://t.me/deswap"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Deswap on Telegram"
              >
                <TelegramIcon />
              </a>
              <a
                className="linkBoxImg navItem2 Svgneon-button"
                href="https://www.reddit.com/r/deswap"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Deswap on Reddit"
              >
                <RedditIcon />
              </a>
              <a
                className="linkBoxImg navItem3 Svgneon-button"
                href="https://medium.com/@deswap"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Deswap on Medium"
              >
                <MediumIcon />
              </a>
              <a
                className="linkBoxImg navItem4 Svgneon-button"
                href="https://twitter.com/deswap"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Deswap on X"
              >
                <TwitterIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
