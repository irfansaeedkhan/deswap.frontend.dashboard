import Image from "next/image";

function AboutSection3() {
  return (
    <div className="section3">
      <div className="section3Inner deswapMax">
        <div className="contentContainer">
          <div className="level1">
            <div className="content">
              <div className="title">
                <h2>PROBLEMS</h2>
              </div>
              <p>
                The networks like BSC and ETH became too expensive and Very slow
                and the current many existing protocols also lack the major
                market assets . Though we aren&apos;t the first in the market to
                connect decentralised financial services with conventional
                loans, nor is it the first protocol to bridge the gaps between
                these conventional services and blockchains. In order to remain
                secure, there have been protocols that have used billions of
                dollars in assets held inside the protocols.
              </p>
              <p>
                Current protocols like Compound, Have appear to be very
                centralised, since the decision-making power is mostly held by
                stakeholders and private equity investors. Decentralization is
                not part of their distribution strategy.
              </p>
              <p>
                A further $1 billion worth of Ether[3] are being held as
                unproductive MakerDao Contracts, which come at a significant
                expense to those that issue assets. In addition, to utilise
                assets to mint stablecoins, a user must convert it from a money
                market protocol to a smart contract, remove any benefits of the
                underlying asset as collateral, and put the item into cold
                storage.
              </p>
            </div>

            <div className="imglevel">
              <Image
                width={800}
                height={"90%"}
                src="/images/problem.png"
                alt="stable coins"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
          </div>
          <div className="level2">
            <div className="imglevel">
              <Image
                width={800}
                height={"90%"}
                src="/images/solution.png"
                alt="stable coins"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <div className="title">
                <h2>SOLUTION</h2>
              </div>
              <p>
                We are majorly focusing to solve the current major fee and slow
                transactions problems by building out lending and borrowing
                ecosystem on Polygon chain which can handle 80k transactions per
                second. Accessibility and a benefit to locked collateral are
                achieved when an established money market is linked to synthetic
                stablecoin creation.
              </p>
              <p>
                By using Polygon chain, any user may easily access a highspeed
                and low transaction cost blockchain with collateral, earn
                interest on that collateral, use it to borrow against, and
                manufacture stablecoins instantly. Using a graphical user
                interface, these solutions will happen immediately on the
                blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection3;
