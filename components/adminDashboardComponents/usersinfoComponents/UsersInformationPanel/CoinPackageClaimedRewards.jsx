import React from 'react'
import SmRightArrow from "@/assets/svgAssets/SmRightArrow";
import SmLeftArrow from "@/assets/svgAssets/SmLeftArrow";
function CoinPackageClaimedRewards() {
  return (
    <div className="tableContainer">
    <p>Coin Package Claimed Rewards</p>
    <div className="tableContainerTable customScroll">
      <table cellPadding="0" cellSpacing="0" border="0">
        <thead>
          <tr>
            <th>CoinpackID</th>
            <th>Pruchased Stacking Pack Id</th>
            <th>Date</th>
            <th>TxHash</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td><button className="Unlocked">Verified</button></td>
          </tr>
          <tr>
          <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td><button className="locked">Pending</button></td>
          </tr>

        </tbody>
      </table>
    </div>
    <div className="pagination">
      <div className="total">
        <p>Total Items :  21</p>
        {"  "}
      </div>

      <div className="content_detail__pagination cdp" actpage="1">
        <a href="#" className="cdp_i">
          <SmLeftArrow />
        </a>
        <a href="#" className="cdp_i">
          1
        </a>
        <a href="#" className="cdp_i">
          2
        </a>
        <a href="#" className="cdp_i">
          <SmRightArrow />
        </a>
      </div>
    </div>
    <div className="pagination mobile">
      <div className="total">
        <p>Total Items :  221</p>
        {"  "}
      </div>

      <div className="content_detail__pagination cdp" actpage="1">
        <a href="#" className="cdp_i">
          <SmLeftArrow />
        </a>
        <a href="#" className="cdp_i">
          1
        </a>
        <a href="#" className="cdp_i">
          2
        </a>
        <a href="#" className="cdp_i">
          <SmRightArrow />
        </a>
      </div>
    </div>
  </div>
  )
}

export default CoinPackageClaimedRewards