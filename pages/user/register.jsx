import RegisterFormContainer from "@/components/userDashboardComponents/register/RegisterFormContainer";
import Image from "next/image";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormsLayout } from "@/layout/forms.layout";

export const getServerSideProps = async (ctx) => {
  let returnObject = {
    props: {
      referalLink: false,
    },
  };
  try {
    if (ctx.query.ref != undefined) {
      returnObject.props.referalLink = true;
      returnObject.props.referalKey = ctx.query.ref;
    } else {
      returnObject.props.referalKey = "";
    }
    return returnObject;
  } catch (e) {
    // toast.error(e.message, {
    //   position: "top-center",
    //   autoClose: 3000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   });
    return returnObject;
  }
};

function Register(props) {
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
      <RegisterFormContainer referalKey={props.referalKey} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </div>
  );
}

export default Register;
Register.PageLayout = FormsLayout;
