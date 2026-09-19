import Image from "next/image";

function TokenomicsSection1() {
  return (
    <div className="section1">
      <div className="section1Inner deswapMax">
        <div className="title">
          <h2>TOKENOMICS</h2>
        </div>
        <div className="tokenList">
          <div className="list l1">
            <div className="imgContainer">
              <Image
                width={800}
                height={600}
                src="/images/list1.png"
                alt="list icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <p>
                The <span> 3%</span> share of the total supply of 100,000,000
                DAW which is 3,000,000 DAW at first is allocated to{" "}
                <span>IDOs</span> or <span>Launch Pads</span>.
              </p>
            </div>
          </div>
          <div className="list l2">
            <div className="imgContainer">
              <Image
                width={800}
                height={600}
                src="/images/list2.png"
                alt="list icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <p>
                The remaining supply will be reserved exclusively for the
                protocol and further operations, and 23% to team.
              </p>
              <p>
                <span>23%</span> tokens were allocated to the{" "}
                <span>Development Fund</span> for the core team, subject to the
                following vesting:
              </p>
              <div className="contentUl">
                <div className="leftList">
                  <p>
                    &gt; <span>80% </span> locked once Token Sale distribution
                    ended <br />
                    &gt; <span>60% </span> locked after 4 months
                  </p>
                </div>
                <div className="rightList">
                  <p>
                    &gt; <span>40% </span> locked after 8 months <br />
                    &gt; <span>20% </span> locked after 10 months <br />
                    &gt; <span>0%</span> locked after 14 months.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="list l3">
            <div className="imgContainer">
              <Image
                width={800}
                height={600}
                src="/images/list3.png"
                alt="list icon"
                loading="lazy"
               style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </div>
            <div className="content">
              <p>
                <span>74,000,000 DAW</span> being mined over 8 to 9 year period,
                starting after the IDO at a rate of 0.64 DAW per block (18,493
                per day). <br />
                DAW is distributed based on liquidity mining, with borrowers
                receiving <span> 30%</span> of daily rewards, suppliers
                receiving <span>30% </span>, and stable minters receiving{" "}
                <span> 22%</span>, <span>15% </span> gets burned immediately and{" "}
                <span>3% </span> get to ecosystem reserve fund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenomicsSection1;
