import React from "react";
import Image from "next/image";

function AgencyCard() {
  return (
    <div className="agencyCard">
      <div className="agencyLogo">
        <Image
          src={"/images/agencyPlaceholderImg.png"}
          width={400}
          height={266}
          alt="agency logo"
          loading="lazy"
        />
      </div>
      <div className="agencyName">
        <h5>Agency Brand Name</h5>
      </div>
    </div>
  );
}

export default AgencyCard;
