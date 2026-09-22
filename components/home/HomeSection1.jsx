import Image from "next/image";
import Head from "next/head";

function HomeSection1() {
  return (
    <div className="section1">
      <Head>
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href="/images/bg-Shape.avif"
          fetchPriority="high"
        />
      </Head>
      <div className="section1Inner deswapMax">
        <div className="leftbox">
          <div className="content">
            <h2>
              Worlds First Money Markets{" "}
              <span style={{ color: "#E44757" }}> Liquidity Protocol </span>{" "}
              Built On Polygon Chain
            </h2>
            <p>
              Deswap is the first ever Decentralised Marketplace to lend loans,
              collect interest, and mint synthetic stablecoins built on polygon
              chain
            </p>
          </div>
        </div>
        <div className="rightbox">
          <div className="imageContainer">
            <Image
              width={482}
              height={482}
              src="/images/world.webp"
              alt="World map illustrating Deswap liquidity protocol"
              priority
              sizes="(max-width: 1000px) 80vw, 482px"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSection1;
