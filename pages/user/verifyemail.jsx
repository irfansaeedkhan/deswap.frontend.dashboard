import ForgetPasswordContainer from "@/components/userDashboardComponents/forgetpassword/ForgetPasswordContainer";
import Image from "next/image";
import { useRouter } from "next/router";
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
