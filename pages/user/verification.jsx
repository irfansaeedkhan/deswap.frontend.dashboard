import VerificationFormContainer from "@/components/userDashboardComponents/verification/VerificationFormContainer";
import Image from "next/image";
import { useRouter } from "next/router";
//import ClientAuth from "../../utils/authenticaion/clientAuth";
import { checkUserAuth } from "../../utils/auth/userauth";
import { FormsLayout } from "@/layout/forms.layout";

export const getServerSideProps = async (ctx) => {
  return await checkUserAuth(ctx);
};

function Verification(data) {
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
      {/* <VerificationFormContainer userData={data} /> */}
      <VerificationFormContainer userData={data.users} />
    </div>
  );
}

export default Verification;
Verification.PageLayout = FormsLayout;
