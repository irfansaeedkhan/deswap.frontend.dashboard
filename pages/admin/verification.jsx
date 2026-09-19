import VerificationFormContainer from "@/components/adminDashboardComponents/verification/VerificationFormContainer";
import Image from "next/image";
import { useRouter } from "next/router";
import { FormsLayout } from "@/layout/forms.layout";

import { checkAdminAuth } from "@/utils/auth/checkAdminAuth";
export const getServerSideProps = async (ctx) => {
  return await checkAdminAuth(ctx);
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
      <VerificationFormContainer userData={data.users} />
    </div>
  );
}

export default Verification;
Verification.PageLayout = FormsLayout;
