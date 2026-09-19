import LoginFormContainer from "@/components/adminDashboardComponents/login/LoginFormContainer";
import Image from "next/image";
import { useRouter } from "next/router";
import { FormsLayout } from "@/layout/forms.layout";

function AdminLogin() {
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
      <LoginFormContainer />
    </div>
  );
}

export default AdminLogin;
AdminLogin.PageLayout = FormsLayout;
