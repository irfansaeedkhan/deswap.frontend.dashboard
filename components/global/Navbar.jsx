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
          <div
            className="hamburger"
            role="button"
            tabIndex={0}
            aria-label="Open navigation menu"
            onClick={() => NavbarToggle()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                NavbarToggle();
              }
            }}
          >
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
          <ul className="nav-links">
            <li>
              <Link
                href="/"
                className={router.pathname == "/" ? "active" : ""}
                aria-current={router.pathname == "/" ? "page" : undefined}
                style={
                  router.pathname == "/"
                    ? { color: "#e44757", fontWeight: 700, fontSize: 19 }
                    : undefined
                }
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={router.pathname == "/about" ? "active" : ""}
              >
                About Deswap
              </Link>
            </li>
            <li>
              <Link
                href="/tokenomics"
                className={router.pathname == "/tokenomics" ? "active" : ""}
              >
                Tokenomics
              </Link>
            </li>
            <li>
              <Link
                href="/ecosystem"
                className={router.pathname == "/ecosystem" ? "active" : ""}
              >
                Ecosystem
              </Link>
            </li>
            <li>
              <Link
                href="/metaverse"
                className={router.pathname == "/metaverse" ? "active" : ""}
              >
                Metaverse
              </Link>
            </li>
          </ul>
          <SimpleButton
            border="none"
            backgroundColor="#E44757"
            color="#FFFFFF"
            onClick={handleLaunchApp}
            text="Launch App"
            maxWidth="17.8rem"
            fontSize={19}
            fontWeight={700}
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
              <Link
                href="/"
                onClick={() => NavbarToggle()}
                className={router.pathname == "/" ? "active" : ""}
                aria-current={router.pathname == "/" ? "page" : undefined}
                style={
                  router.pathname == "/"
                    ? { color: "#e44757", fontWeight: 700, fontSize: 19 }
                    : undefined
                }
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={() => NavbarToggle()}
                className={router.pathname == "/about" ? "active" : ""}
                style={
                  router.pathname == "/about" ? { color: "#F07884" } : undefined
                }
              >
                About Deswap
              </Link>
            </li>
            <li>
              <Link
                href="/tokenomics"
                onClick={() => NavbarToggle()}
                className={router.pathname == "/tokenomics" ? "active" : ""}
              >
                Tokenomics
              </Link>
            </li>
            <li>
              <Link
                href="/ecosystem"
                onClick={() => NavbarToggle()}
                className={router.pathname == "/ecosystem" ? "active" : ""}
              >
                Ecosystem
              </Link>
            </li>
            <li>
              <Link
                href="/metaverse"
                onClick={() => NavbarToggle()}
                className={router.pathname == "/metaverse" ? "active" : ""}
              >
                Metaverse
              </Link>
            </li>
            <li className="registerBtn">
              <Link href="/user/login" onClick={() => NavbarToggle()}>
                Launch App
              </Link>
            </li>
            <li className="registerBtn">
              <Link
                href="/user/register"
                onClick={() => NavbarToggle()}
                className={router.pathname == "/register" ? "active" : ""}
              >
                Register
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
