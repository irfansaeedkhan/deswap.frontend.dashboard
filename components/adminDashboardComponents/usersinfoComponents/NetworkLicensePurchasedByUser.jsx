import React from 'react'
import SmRightArrow from "@/assets/svgAssets/SmRightArrow";
import SmLeftArrow from "@/assets/svgAssets/SmLeftArrow";
function NetworkLicensePurchasedByUser() {
  return (
    <div className="tableContainer">
    <p>Network License Purchased By User</p>
    <div className="tableContainerTable customScroll">
      <table cellPadding="0" cellSpacing="0" border="0">
        <thead>
          <tr>
            <th>Date</th>
            <th>TxHash</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>3,March 2022 (11:11:10 am</td>
            <td>0sdf4...45f4</td>
            <td>453</td>
            <td>
              <button className="Unlocked">Verified</button>
            </td>
          </tr>
          <tr>
            <td>3,March 2022 (11:11:10 am</td>
            <td>0sdf4...45f4</td>
            <td>453</td>
            <td>
              <button className="locked">Pending</button>
            </td>
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

export default NetworkLicensePurchasedByUser