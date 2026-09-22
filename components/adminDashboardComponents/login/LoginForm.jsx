import React, { useState, useEffect } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "@/utils/common/axios";
import {requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { setloginData } from "../../../utils/auth/login";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"
import {
  ensureDashboardCss,
  preloadDashboardCss,
} from "@/utils/dashboard/ensureDashboardCss";


const re = /^([a-z0-9\.-]{2,25})@([a-z\d]{2,20})\.([a-z\.-]{2,8})(\.[a-z]{2,8})?$/;
const oneletteronenumberonechacter = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


// form validations
const schema = Joi.object({
  email: Joi.string()
  .regex(re)
    // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "co"] } })
    // .email({ minDomainSegments: 2, tlds: {} })

    .required()
    .messages({
      "string.empty": `UserName/Email Required`,
      "any.required": `UserName/Email Required`,
      "string.pattern.base": `Invalid email id. Only - . special characters allowed , 0-9 and alphabat`
    }),
  password: Joi.string().regex(oneletteronenumberonechacter).required().min(4).label("password").messages({
    "string.empty": `Password Required`,
    "any.required": `Required Field`,
    "string.pattern.base": `Password must have at one character, one number and one special character`
  }),
});

function LoginForm() {
  const router = useRouter();
  const [loginbutton, setloginbutton] = useState("Login");
  useEffect(() => {
    preloadDashboardCss();
  }, []);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirmPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const toggleConfirmPasswordVisiblity = () => {
    setconfirmPasswordShown(confirmPasswordShown ? false : true);
  };
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });
  const onSubmit = async (userData) => {
    try {
      const data1 = await SanitizeRequestObject(userData);
      if (!data1) return;
      await setloginbutton("Logging..");

      const isDemo =
        process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.endsWith(".vercel.app") ||
        String(data1.email || "").toLowerCase() === "admin@deswap.co";

      let data;
      if (isDemo) {
        // Relative URL — works on any local port
        const response = await axios.post(
          `/api/demo/admin-login`,
          { email: data1.email, password: data1.password },
          { withCredentials: true }
        );
        data = response.data;
      } else {
        const platformUrl =
          process.env.NEXT_PUBLIC_PLATFORM_URL || window.location.origin;
        let encryptionData = await requestBodyEncryptionUnprotected(data1);
        const response = await axios.post(
          `${platformUrl}/api/admin/login`,
          { data: encryptionData },
          { headers: { "security-set": true } }
        );
        data = response.data;
      }

      const user = data?.user;
      if (!user?.emailid) {
        throw new Error(data?.hint || "Login failed");
      }

      await setloginbutton("Login");
      setloginData(
        JSON.stringify({
          emailid: user.emailid,
          uuid: user.uuid,
          verified: user.accountverified,
          user: false,
          publickey: user.address,
        })
      );
      toast.success("Logged in successfully", { autoClose: 2000 });
      ensureDashboardCss();
      return router.push("/admin/dashboard");
    } catch (e) {
      console.log("Error message : ", e);
      setloginbutton("Login");
      toast.error(
        e?.response?.data?.hint ||
          e?.message ||
          "Failed to login. Demo admin: admin@deswap.co / Admin@1234",
        { autoClose: 3500 }
      );
    }
  };

  return (
    <>
      <div className="loginForm">
        <h2>Login</h2>
        <p style={{ fontSize: "13px", marginBottom: "8px", opacity: 0.85 }}>
          Demo admin: <strong>admin@deswap.co</strong> /{" "}
          <strong>Admin@1234</strong>
        </p>
        <div className="inputsList">
          <form method="post" autoComplete="off">
            <div className="formInputs">
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Email"
                autoComplete="off"
                {...register("email")}
                error={formState.errors.email && true}
              />
              {/* <label htmlFor="email">Username or email</label> */}
              {formState.errors.email && (
                <p>{formState.errors.email.message}</p>
              )}
            </div>
            <div className="formInputs">
              <input
                id="password"
                name="password"
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
                autoComplete="off"
                {...register("password")}
                error={formState.errors.password && true}
              />
              <i onClick={togglePasswordVisiblity}>
                {passwordShown ? eyeSlash : eye}
              </i>
              {/* <label htmlFor="password">Password</label> */}
              {formState.errors.password && (
                <p>{formState.errors.password.message}</p>
              )}
            </div>
            <div className="formInputs link">
              <Link legacyBehavior href="/admin/forgotpassword">
                <a>Forgot Password ?</a>
              </Link>
            </div>
            <div className="formInputs">
              <button
                className="SimpleButton btnHoverEffectOutline btnslider"
                style={{
                  background: !formState.isValid ? "#333333" : "#e44757",
                  color: !formState.isValid ? "#474747" : "#FFF",
                }}
                disabled={!formState.isValid}
                onClick={handleSubmit(onSubmit)}
              >
                {loginbutton}
              </button>
            </div>
          </form>
        </div>
      </div>
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
toastStyle={{ backgroundColor: "#232323", color: "#FFFFFF", fontSize: "12px" }}
/>
    </>
  );
}

export default LoginForm;
