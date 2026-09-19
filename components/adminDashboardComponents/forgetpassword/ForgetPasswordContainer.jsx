import React from "react";
import ForgetPasswordForm from "./ForgetPasswordForm";
import { useRouter } from "next/router";

function ForgetPasswordContainer() {
  const router = useRouter();
  const handleGetBack = (e) => {
    e.preventDefault();
    router.push("/");
  };
  return (
    <div className="ForgetPasswordContainer">
      <div className="ForgetPasswordInner">
        <ForgetPasswordForm />
      </div>
    </div>
  );
}

export default ForgetPasswordContainer;
