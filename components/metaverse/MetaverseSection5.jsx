import Image from "next/image";

function MetaverseSection5() {
  return (
    <div className="section5">
      <div className="section5Inner deswapMax">
        <div className="title">
          <h2>Loans In The Metaverse</h2>
        </div>
        <div className="tokenList">
          <div className="list l1">
            <div className="imgContainer">
              <Image
                width={800}
                height={600}
                src="/images/metaverseimage4_1.png"
                alt="share icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <p>
                DeSwap will offer loans in the metaverse so that people are able
                to buy their own homes
              </p>
            </div>
          </div>
          <div className="list l2">
            <div className="imgContainer">
              <Image
                width={800}
                height={600}
                src="/images/metaverseimage4_2.png"
                alt="metaverse icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <p>
                Thus laying the foundations for a decentralised digital mortgage
                on Polygon&apos;s Blockchain.
              </p>
            </div>
          </div>
          <div className="list l3">
            <div className="imgContainer">
              <Image
                width={800}
                height={600}
                src="/images/metaverseimage4_3.png"
                alt="metaverse icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <p>
                The mortgages will be disbursed in YAI the stable coin of
                Deswap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetaverseSection5;
