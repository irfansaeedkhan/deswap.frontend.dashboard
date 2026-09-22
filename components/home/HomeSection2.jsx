import Image from "next/image";
function HomeSection2() {
  return (
    <div className="section2">
      <div className="section2Inner deswapMax">
        <div className="cardContainer">
          <div className="cardContent">
            <div className="imagebox">
              <Image
                width={192}
                height={192}
                src="/images/audit.png"
                alt="audit icon"
                sizes="192px"
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </div>
            <div className="contentbox">
              <h2>Audited by Techrate</h2>
              <p>
                Techrate is an analytical and engineering agency focused on
                blockchain technology solutions and audits.
              </p>
              <a href="/about">
                <p>Readmore</p>
                <div className="imgCustomArrow">
                  <Image
                    width={31}
                    height={31}
                    src="/images/arrowRight.svg"
                    alt="arrow icon"
                    style={{ width: 31, height: 31 }}
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSection2;
