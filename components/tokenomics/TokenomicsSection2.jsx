import Image from "next/image";

function TokenomicsSection2() {
  return (
    <div className="section2">
      <div className="section2Inner deswapMax">
        <div className="leftbox">
          <div className="analicCard">
            <div className="percentageContainer">
              <div className="circle blue"></div>
              <h3>42%</h3>
            </div>
            <p>Platform development</p>
          </div>
          <div className="analicCard">
            <div className="percentageContainer">
              <div className="circle green"></div>
              <h3>20%</h3>
            </div>
            <p>Legal expenses</p>
          </div>
          <div className="analicCard">
            <div className="percentageContainer">
              <div className="circle yellow"></div>
              <h3>20%</h3>
            </div>
            <p>Operating costs</p>
          </div>
          <div className="analicCard">
            <div className="percentageContainer">
              <div className="circle pink"></div>
              <h3>20%</h3>
            </div>
            <p>Marketing and advertising</p>
          </div>
          <div className="analicCard">
            <div className="percentageContainer">
              <div className="circle red"></div>
              <h3>4%</h3>
            </div>
            <p>Other expenses</p>
          </div>
        </div>
        <div className="rightbox">
          <div className="imgContainer">
            <Image
              width={800}
              height={600}
              src="/images/chart.png"
              alt="share icon"
              loading="lazy"
             style={{ width: "100%", height: "auto", objectFit: "contain" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenomicsSection2;
