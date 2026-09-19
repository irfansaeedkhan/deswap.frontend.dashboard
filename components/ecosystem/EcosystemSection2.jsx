import Image from "next/image";
function EcosystemSection2() {
  return (
    <div className="section2">
      <div className="section2Inner deswapMax">
        <div className="title">
          <h2>Features of Deswap platform and DAW Token</h2>
        </div>

        <div className="featureContainer">
          <div className="featureCard">
            <div className="imgbox">
              <Image
                width={800}
                height={600}
                src="/images/feature1.png"
                alt="feature1 icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <h4>Constant Growth In Value DAW Token</h4>
              <p>
                Expanding the audience and releasing new products leads new
                users and increases trust, which leads to increased demand for a
                token.
              </p>
            </div>
          </div>
          <div className="featureCard">
            <div className="imgbox">
              <Image
                width={800}
                height={600}
                src="/images/feature2.png"
                alt="feature2 icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <h4>Security</h4>
              <p>
                The Polygon chain(s) operators are themselves Stakers and
                Delegates in a Proof-of-Stake system in the Matic Network.
              </p>
            </div>
          </div>
          <div className="featureCard">
            <div className="imgbox">
              <Image
                width={800}
                height={600}
                src="/images/feature3.png"
                alt="feature3 icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <h4>Highest Speed In DEFI</h4>
              <p>
                Our Network is capable of doing 80k transactions per second.
              </p>
            </div>
          </div>
          <div className="featureCard">
            <div className="imgbox">
              <Image
                width={800}
                height={600}
                src="/images/feature4.png"
                alt="feature4 icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <h4>Instant Liquidity</h4>
              <p>
                Borrow the Crypto on DEMAND which has access to instant
                liquidity.
              </p>
            </div>
          </div>
          <div className="featureCard">
            <div className="imgbox">
              <Image
                width={800}
                height={600}
                src="/images/feature5.png"
                alt="feature5 icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <h4>Lowest Gas Fee</h4>
              <p>
                Deswap has the lowest gas fee among other Lending major players
                in the market.
              </p>
            </div>
          </div>
          <div className="featureCard">
            <div className="imgbox">
              <Image
                width={800}
                height={600}
                src="/images/feature6.png"
                alt="feature6 icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <h4>Scalability</h4>
              <p>
                Scalability is achieved through the use of a decentralised
                Plasma operator method that achieves finality on a polygon
                chain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EcosystemSection2;
