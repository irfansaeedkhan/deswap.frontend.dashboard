import Image from "next/image";
function MetaverseSection3() {
  return (
    <div className="section3">
      <div className="section3Inner deswapMax">
        <div className="contentContainer">
          <div className="level1">
            <div className="content">
              <div className="title">
                <h2>Buy, Sell or Rent Real Estate</h2>
              </div>
              <p>
                In the early years the Metaverse will be based on launchpads of
                skyscrapers and villa communities, which users can buy to resell
                or rent.
              </p>
            </div>

            <div className="imglevel">
              <Image
                width={800}
                height={600}
                src="/images/metaverseimage2.png"
                alt="rent metaverse real state"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetaverseSection3;
