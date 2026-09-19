import Image from "next/image";
function HomeSection5() {
  return (
    <div className="section5">
      <div className="section5Inner deswapMax">
        <div className="title">
          <h2>Platform Partners</h2>
        </div>
        <div className="partnersContainer">
          <div className="partnerLogo">
            <Image
              width={424}
              height={212}
              src="/images/logopolygon.png"
              alt="Polygon partner logo"
              loading="lazy"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
          <div className="partnerLogo">
            <Image
              width={424}
              height={212}
              src="/images/logometamask.png"
              alt="MetaMask partner logo"
              loading="lazy"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
          <div className="partnerLogo">
            <Image
              width={424}
              height={212}
              src="/images/logoconnectwallet.png"
              alt="WalletConnect partner logo"
              loading="lazy"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
          <div className="partnerLogo">
            <Image
              width={424}
              height={212}
              src="/images/logodefipad.png"
              alt="DeFiPad partner logo"
              loading="lazy"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
          <div className="partnerLogo">
            <Image
              width={424}
              height={212}
              src="/images/logoipshare.png"
              alt="IPShare partner logo"
              loading="lazy"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
          <div className="partnerLogo">
            <Image
              width={424}
              height={212}
              src="/images/LogoCatex.png"
              alt="Catex partner logo"
              loading="lazy"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSection5;
