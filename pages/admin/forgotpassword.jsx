import ForgetPasswordContainer from "@/components/adminDashboardComponents/forgetpassword/ForgetPasswordContainer";
import Image from "next/image";
import { useRouter } from "next/router";
import { FormsLayout } from "@/layout/forms.layout";

function Forgetpassword() {
  const router = useRouter();
  const handleGetBack = (e) => {
    e.preventDefault();
    router.push("/");
  };
  return (
    <div className="formMainContainer">
      <div className="logoContainer">
        <Image
          src={"/images/logo.png"}
          width={152}
          height={34}
          alt="logo"
          onClick={handleGetBack}
          loading="lazy"
        />
      </div>
      <ForgetPasswordContainer />
    </div>
  );
}

export default Forgetpassword;
Forgetpassword.PageLayout = FormsLayout;
