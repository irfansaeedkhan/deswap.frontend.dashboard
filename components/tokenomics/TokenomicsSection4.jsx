import Image from "next/image";

function TokenomicsSection4() {
  return (
    <div className="section4 tokenomics">
      <div className="section4Inner deswapMax">
        <div className="content">
          <div className="topList">
            <div className="topListCard">
              <h5>Q1 2021</h5>
              <div className="card">
                <div className="imgContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/greenTick.png"
                    alt=" icon"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />{" "}
                </div>
                <p>Idea formation and background research</p>
              </div>
            </div>
            <div className="topListCard">
              <h5>Q2 2021</h5>
              <div className="card">
                <div className="imgContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/greenTick.png"
                    alt=" icon"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />{" "}
                </div>
                <p>Product Development Began</p>
              </div>
            </div>
            <div className="topListCard">
              <h5>Q3 2021</h5>
              <div className="card">
                <div className="imgContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/greenTick.png"
                    alt=" icon"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />{" "}
                </div>
                <p>IDOs and Fund Raise</p>
              </div>
            </div>
            <div className="topListCard">
              <h5>Q4 2021</h5>
              <div className="card">
                <div className="imgContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/greenTick.png"
                    alt=" icon"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />{" "}
                </div>
                <p>Lending and Borrowing Ecosystem launch</p>
              </div>
            </div>
          </div>
          <div className="hrLine">
            <Image
              width={800}
              height={10}
              src="/images/arrowone.svg"
              alt=" icon"
              loading="lazy"
             style={{ width: "100%", height: "auto", objectFit: "contain" }} />
          </div>
          <div className="hrLinemobile">
            <Image
              width={800}
              height={10}
              src="/images/arrowmobile.png"
              alt=" icon"
              loading="lazy"
             style={{ width: "100%", height: "auto", objectFit: "contain" }} />
          </div>
          <div className="bottomList">
            <div className="bottomListCard">
              <h5>Q1 2022</h5>
              <div className="card">
                <div className="imgContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/greyTick.png"
                    alt=" icon"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />{" "}
                </div>
                <p>Polygon Centered DEFI Wallet launch</p>
              </div>
              <div className="card">
                <div className="imgContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/greyTick.png"
                    alt=" icon"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />{" "}
                </div>
                <p>Rewards Token Launch</p>
              </div>
            </div>
            <div className="bottomListCard">
              <h5>Q2 2022</h5>
              <div className="card">
                <div className="imgContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/greyTick.png"
                    alt=" icon"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />{" "}
                </div>
                <p>LaunchPad Launch</p>
              </div>
              <div className="card">
                <div className="imgContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/greyTick.png"
                    alt=" icon"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />{" "}
                </div>
                <p>
                  First ever DEFI based user financial profile history
                  management system launch
                </p>
              </div>
            </div>
            <div className="bottomListCard">
              <h5>Q3 2022</h5>
              <div className="card">
                <div className="imgContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/greyTick.png"
                    alt=" icon"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />{" "}
                </div>
                <p>Voting systems launch</p>
              </div>
            </div>
            <div className="bottomListCard">
              <h5>Q4 2022</h5>
              <div className="card">
                <div className="imgContainer">
                  <Image
                    width={800}
                    height={600}
                    src="/images/greyTick.png"
                    alt=" icon"
                    loading="lazy"
                   style={{ width: "100%", height: "auto", objectFit: "contain" }} />{" "}
                </div>
                <p>Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenomicsSection4;
