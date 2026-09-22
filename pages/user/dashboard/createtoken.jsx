import React from "react";
import CopyIcon from "@/assets/svgAssets/CopyIcon";
import { UserDashboardLayout } from "@/layout/userdashboard.layout";

function CreateToken() {
  const copy = async () => {
    await navigator.clipboard.writeText(
      "0xJ2n13CBbf530A1105711B27CDd9102716220ghn42"
    );
  };
  return (
    <div className="CreateTokenContainer">
      <div className="CreateTokenInner">
        <div className="title">
          <h1>Create Token</h1>
        </div>
        <div className="CreateTokenMain">
          <div className="CreateTokenTableContainer">
            <div className="CreateTokenContainerTable customScroll">
              <table cellPadding="0" cellSpacing="0" border="0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Supply (Tokens Quantity)</th>
                    <th>Decimals</th>
                    <th>Send To Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>DESWAP</td>
                    <td>DESWAP</td>
                    <td>10.000.000</td>
                    <td>18</td>
                    <td className="positionrelative">
                      <div className="copyaddContainer">
                        <p>0xJ2n...ghn42</p>
                        <button className="copyBtn" onClick={copy}>
                          <div className="copyImgIcon">
                            {" "}
                            <CopyIcon />
                          </div>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>DESWAP</td>
                    <td>DESWAP</td>
                    <td>55.000.000</td>
                    <td>42</td>
                    <td className="positionrelative">
                      <div className="copyaddContainer">
                        <p>0xJ2n....34gd34</p>
                        <button className="copyBtn" onClick={copy}>
                          <div className="copyImgIcon">
                            {" "}
                            <CopyIcon />
                          </div>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateToken;
CreateToken.PageLayout = UserDashboardLayout;


