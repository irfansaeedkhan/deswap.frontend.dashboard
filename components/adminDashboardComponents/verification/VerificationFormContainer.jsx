import React from "react";
import VerificationForm from "./VerificationForm";

function VerificationFormContainer({userData}) {
  return (
    <div className="verificationContainer">
      <div className="verificationInner">
        <VerificationForm userData={userData}/>
      </div>
    </div>
  );
}

export default VerificationFormContainer;
