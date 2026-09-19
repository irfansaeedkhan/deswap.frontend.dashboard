import ResetPasswordForm from "./resetpasswordForm";
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
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default ForgetPasswordContainer;
