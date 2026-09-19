import Image from "next/image";
function AboutSection4() {
  return (
    <div className="section4">
      <div className="section4Inner deswapMax">
        <div className="contentContainer">
          <div className="level2">
            <div className="imglevel">
              <Image
                width={815}
                height={458}
                src="/images/metaverseimage3.png"
                alt="stable coins"
                loading="lazy"
              />
            </div>
            <div className="content">
              <div className="title">
                <h2>Release NFT</h2>
              </div>
              <p>
                The sellers of these flats or villas will have to have a Real
                Estate license. Each license is an NFT.
              </p>
              <div className="cardsContainer">
                <div className="card">
                  <h5>999</h5>
                  <p>
                    Only 999 NFT Real Estate Licences will be available in
                    Octagon Metaverse.
                  </p>
                </div>
                <div className="card">
                  <h5>WHY BUY THEM?</h5>
                  <p>
                    Because without these licenses it is not possible to do
                    business in Octagon&apos;s Meta Real Estate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection4;
