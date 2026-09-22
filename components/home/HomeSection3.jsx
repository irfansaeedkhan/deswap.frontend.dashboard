import Image from "next/image";
function HomeSection3() {
  return (
    <div className="section3">
      <div className="section3Inner deswapMax">
        <div className="cardContainer">
          <div className="title">
            <h2>What is DESWAP?</h2>
          </div>
          <div className="content">
            <p>
              Deswap powers the world&apos;s first decentralized stablecoin(YAI)
              built on polygon network, DAW, which is backed by a basket of
              stablecoins and crypto assets with no centralized control.
            </p>
            <p>
              We are aiming to change the interaction between the lenders and
              borrowers so that people can exchange assets without seamlessly
              losing their funds in the form of higher gas fees. On the Polygon
              chain, the Deswap Protocol is designed to enable a comprehensive
              algorithmic money market protocol.
            </p>
            <a href="/about">
              <p>View Detail</p>
              <div className="imgCustomArrow">
                <Image
                  width={800}
                  height={600}
                  src="/images/arrowRight.svg"
                  alt="arrow icon"
                  loading="lazy"
                 style={{ width: "100%", height: "auto", objectFit: "contain" }} />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSection3;
