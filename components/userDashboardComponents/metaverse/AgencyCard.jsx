import React from "react";
import Image from "next/image";

function AgencyCard({ name, image }) {
  return (
    <div className="agencyCard">
      <div className="agencyLogo">
        <Image
          src={image || "/images/auctionnft.png"}
          width={400}
          height={400}
          alt={name || "agency logo"}
          loading="lazy"
        />
      </div>
      <div className="agencyName">
        <h5>{name || "Agency Brand Name"}</h5>
      </div>
    </div>
  );
}

export default AgencyCard;
