import Image from "next/image";
import SimpleButton from "../reusables/SimpleButton";
import Link from "next/link";
import { useRouter } from "next/router";

const NavbarToggle = () => {
  if (typeof document === "undefined") return;
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-linksMobile");
  const links = document.querySelectorAll(".nav-linksMobile li");
  const layoutContainer = document.getElementById("layoutContainer");
  const customnav = document.querySelector(".customnav");
  const navContainer = document.querySelector(".navContainer");
  navLinks?.classList.toggle("open");
  navContainer?.classList.toggle("open");
  layoutContainer?.classList.toggle("open");
  customnav?.classList.toggle("open");
  links?.forEach((link) => {
    link.classList.toggle("fade");
  });
  hamburger?.classList.toggle("toggle");
};

function Navbar() {
  const router = useRouter();

  const handleLaunchApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Hard navigate so login always opens even if client router is stuck
    if (typeof window !== "undefined") {
      window.location.assign("/user/login");
      return;
    }
    router.push("/user/login");
  };

  return (
    <div className="navContainer">
      <nav className="customnav">
        <div className="navInner deswapMax">
          <div className="logo desktop">
            <Link href="/">
              <Image
                width={152}
                height={34}
                src="/images/logo.png"
                alt="Deswap Logo"
                priority
              />
            </Link>
          </div>
          <div className="logo mobile">
            <Link href="/">
              <Image
                width={40}
                height={40}
                src="/images/logoicon.png"
                alt="Deswap Logo"
                priority
              />
            </Link>
          </div>
          <div className="hamburger" onClick={() => NavbarToggle()}>
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
          <ul className="nav-links">
            <li>
              <Link legacyBehavior href="/">
                <a className={router.pathname == "/" ? "active" : ""}>Home</a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/about">
                <a className={router.pathname == "/about" ? "active" : ""}>
                  About Deswap
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/tokenomics">
                <a className={router.pathname == "/tokenomics" ? "active" : ""}>
                  Tokenomics
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/ecosystem">
                <a className={router.pathname == "/ecosystem" ? "active" : ""}>
                  Ecosystem
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/metaverse">
                <a className={router.pathname == "/metaverse" ? "active" : ""}>
                  Metaverse
                </a>
              </Link>
            </li>
          </ul>
          <SimpleButton
            border="none"
            backgroundColor="#E44757"
            onClick={handleLaunchApp}
            text="Launch App"
            maxWidth="17.8rem"
          />
          <div className="flagContainer">
            <Image
              width={56}
              height={56}
              src="/images/flag.png"
              alt="Language flag"
              style={{ width: 39, height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>
        <div className="mobilenavContainer">
          <ul className="nav-linksMobile">
            <li>
              <Link legacyBehavior href="/">
                <a
                  onClick={() => NavbarToggle()}
                  className={router.pathname == "/" ? "active" : ""}
                >
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/about">
                <a
                  onClick={() => NavbarToggle()}
                  className={router.pathname == "/about" ? "active" : ""}
                >
                  About Deswap
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/tokenomics">
                <a
                  onClick={() => NavbarToggle()}
                  className={router.pathname == "/tokenomics" ? "active" : ""}
                >
                  Tokenomics
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/ecosystem">
                <a
                  onClick={() => NavbarToggle()}
                  className={router.pathname == "/ecosystem" ? "active" : ""}
                >
                  Ecosystem
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/metaverse">
                <a
                  onClick={() => NavbarToggle()}
                  className={router.pathname == "/metaverse" ? "active" : ""}
                >
                  Metaverse
                </a>
              </Link>
            </li>
            <li className="registerBtn">
              <Link legacyBehavior href="/user/login">
                <a onClick={() => NavbarToggle()}>Launch App</a>
              </Link>
            </li>
            <li className="registerBtn">
              <Link legacyBehavior href="/user/register">
                <a
                  onClick={() => NavbarToggle()}
                  className={router.pathname == "/register" ? "active" : ""}
                >
                  Register
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
