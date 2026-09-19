import React from "react";
import Image from "next/image";
function CollectionActivity() {
  return (
    <div className="collectionActivityContainer">
      <div className="filterList">
        <h6>Filter By</h6>
        <button className=" btnHoverEffectOutline ">Listings</button>
        <button className=" btnHoverEffectOutline ">Sales</button>
        <button className=" btnHoverEffectOutline ">Offers</button>
        <button className=" btnHoverEffectOutline ">Collection Offers</button>
        <button className=" btnHoverEffectOutline ">Transfers</button>
      </div>
      <div className="activityTable customScroll">
        <table cellPadding="0" cellSpacing="0" border="0">
          <thead>
            <tr>
              <th> &nbsp; </th>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>From</th>
              <th>To</th>
              <th>time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="grey">Minted</span>
              </td>
              <td>
                <div className="ItemContain">
                  <div className="profileIcon">
                    <Image
                      width={50}
                      height={50}
                      src={"/images/tableprofile.png"}
                      alt={"profile icon"}
                      loading="lazy"
                    />
                  </div>
                  <div className="profileData">
                    <h5>Water City</h5>
                    <h6>Julie_Pacino</h6>
                  </div>
                </div>
              </td>
              <td>----</td>
              <td>1</td>
              <td>
                <span className="themered">Null addrress</span>
              </td>
              <td>
                <span className="themered">You</span>
              </td>
              <td>
                <span className="grey">4 days ago</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="grey">Minted</span>
              </td>
              <td>
                <div className="ItemContain">
                  <div className="profileIcon">
                    <Image
                      width={50}
                      height={50}
                      src={"/images/tableprofile.png"}
                      alt={"profile icon"}
                      loading="lazy"
                    />
                  </div>
                  <div className="profileData">
                    <h5>Water City</h5>
                    <h6>Julie_Pacino</h6>
                  </div>
                </div>
              </td>
              <td>----</td>
              <td>1</td>
              <td>
                <span className="themered">Null addrress</span>
              </td>
              <td>
                <span className="themered">You</span>
              </td>
              <td>
                <span className="grey">4 days ago</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="grey">Minted</span>
              </td>
              <td>
                <div className="ItemContain">
                  <div className="profileIcon">
                    <Image
                      width={50}
                      height={50}
                      src={"/images/tableprofile.png"}
                      alt={"profile icon"}
                      loading="lazy"
                    />
                  </div>
                  <div className="profileData">
                    <h5>Water City</h5>
                    <h6>Julie_Pacino</h6>
                  </div>
                </div>
              </td>
              <td>----</td>
              <td>1</td>
              <td>
                <span className="themered">Null addrress</span>
              </td>
              <td>
                <span className="themered">You</span>
              </td>
              <td>
                <span className="grey">4 days ago</span>
              </td>
            </tr>
            <tr>
              <td>
                <span className="grey">Minted</span>
              </td>
              <td>
                <div className="ItemContain">
                  <div className="profileIcon">
                    <Image
                      width={50}
                      height={50}
                      src={"/images/tableprofile.png"}
                      alt={"profile icon"}
                      loading="lazy"
                    />
                  </div>
                  <div className="profileData">
                    <h5>Water City</h5>
                    <h6>Julie_Pacino</h6>
                  </div>
                </div>
              </td>
              <td>----</td>
              <td>1</td>
              <td>
                <span className="themered">Null addrress</span>
              </td>
              <td>
                <span className="themered">You</span>
              </td>
              <td>
                <span className="grey">4 days ago</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CollectionActivity;
