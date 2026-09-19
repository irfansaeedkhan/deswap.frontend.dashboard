import Image from "next/image";
function HomeSection4() {
  return (
    <div className="section4">
      <div className="section4Inner deswapMax">
        <div className="title">
          <h2>Deswap Protocol</h2>
        </div>

        <div className="contentContainer">
          <div className="level1">
            <div className="imglevel">
              <Image
                width={800}
                height={600}
                src="/images/level1.png"
                alt="Polygon Chain"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <p>
              You can borrow cryptocurrencies and stablecoins, like the
              USD-pegged Tether, with no credit check or prior deposits on the
              Polygon Chain.{" "}
            </p>
          </div>
          <div className="level2">
            <p>
              Provide cryptocurrencies and stablecoins as well as fixed-interest
              payment models and earn a variable interest rate as compensation
              for providing liquidity on the network that is secured by assets
              over-collateralized by multiple times their value.{" "}
            </p>
            <div className="imglevel">
              <Image
                width={800}
                height={600}
                src="/images/level2.png"
                alt="level2 icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
          </div>
          <div className="level3">
            <div className="imglevel">
              <Image
                width={800}
                height={600}
                src="/images/level3.png"
                alt="level3 icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <p>
              Running through the biggest blockchain platforms, users can access
              stablecoins backed by their collateral that can be used at over
              all over the world{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSection4;
