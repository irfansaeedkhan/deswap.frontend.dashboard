import Image from "next/image";
import Head from "next/head";

function HomeSection1() {
  return (
    <div className="section1">
      <Head>
        <link
          rel="preload"
          as="image"
          href="/images/bg-Shape.png"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/world.png"
          fetchPriority="high"
        />
      </Head>
      <div className="section1Inner deswapMax">
        <div className="leftbox">
          <div className="content">
            <h1>
              Worlds First Money Markets{" "}
              <span style={{ color: "#E44757" }}> Liquidity Protocol </span>{" "}
              Built On Polygon Chain
            </h1>
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
              src="/images/world.png"
              alt="World map illustrating Deswap liquidity protocol"
              priority
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSection1;
