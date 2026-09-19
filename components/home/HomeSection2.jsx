import Image from "next/image";
function HomeSection2() {
  return (
    <div className="section2">
      <div className="section2Inner deswapMax">
        <div className="cardContainer">
          <div className="cardContent">
            <div className="imagebox">
              <Image
                width={800}
                height={600}
                src="/images/audit.png"
                alt="audit icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="contentbox">
              <h2>Audited by Techrate</h2>
              <p>
                Techrate is an analytical and engineering agency focused on
                blockchain technology solutions and audits.
              </p>
              <a href="#">
                <p>Readmore</p>
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
    </div>
  );
}

export default HomeSection2;
