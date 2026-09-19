import React from "react";
import RegisterForm from "./RegisterForm";


function RegisterFormContainer({referalKey}) {
  return (
    <div className="registerContainer">
      <div className="registerInner">
        <RegisterForm referalKey={referalKey}/>
      </div>
    </div>
  );
}

export default RegisterFormContainer;
