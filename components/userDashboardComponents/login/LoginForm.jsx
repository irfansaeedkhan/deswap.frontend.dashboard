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
import axios from "../../../utils/common/axios";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { setloginData } from "../../../utils/auth/login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SanitizeRequestObject } from "../../../utils/common/sanitize";
import { setWalletValues } from "../../../utils/common/localstorage";
import {
  ensureDashboardCss,
  preloadDashboardCss,
} from "@/utils/dashboard/ensureDashboardCss";

const re =
  /^([a-z0-9\.-]{2,25})@([a-z\d]{2,20})\.([a-z\.-]{2,8})(\.[a-z]{2,8})?$/;
const oneletteronenumberonechacter =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// form validations
const schema = Joi.object({
  email: Joi.string()
    // .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "co"] } })
    .email({ minDomainSegments: 2, tlds: {} })
    .regex(re)
    .required()
    .messages({
      "string.empty": `Email Required`,
      "any.required": `Email Required`,
      "string.pattern.base": `Invalid email id. Only - . special characters allowed , 0-9 and alphabat`,
    }),
  password: Joi.string()
    .regex(oneletteronenumberonechacter)
    .required()
    .min(4)
    .label("password")
    .messages({
      "string.empty": `Password Required`,
      "any.required": `Required Field`,
      "string.pattern.base": `Password must have at one character, one number and one special character`,
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
    const sanData = await SanitizeRequestObject(userData);
    if (!sanData) {
      toast.error("Invalid form data", { autoClose: 3000 });
      return;
    }

    try {
      await setloginbutton("Logging..");

      const isDemoEnv =
        process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
        (typeof window !== "undefined" &&
          (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.hostname.endsWith(".vercel.app")));

      const isDemoEmail =
        String(sanData.email || "").toLowerCase() === "demo@deswap.co";

      const useDemoLogin = isDemoEnv || isDemoEmail;

      let data;
      if (useDemoLogin) {
        // Relative URL — works on any local port (:3000, :3002, etc.)
        const response = await axios.post(
          `/api/demo/login`,
          {
            email: sanData.email,
            password: sanData.password,
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        data = response.data;
      } else {
        const platformUrl =
          process.env.NEXT_PUBLIC_PLATFORM_URL ||
          (typeof window !== "undefined" ? window.location.origin : "");
        let encryptionData = await requestBodyEncryptionUnprotected(sanData);
        const response = await axios.post(
          `${platformUrl}/api/login`,
          { data: encryptionData },
          {
            headers: {
              "security-set": true,
            },
          }
        );
        data = response.data;
      }

      const user = data?.user || data?.payload?.user;
      if (!user?.emailid) {
        throw new Error(
          data?.hint ||
            data?.error ||
            "Login response missing user. Use demo@deswap.co / Demo@1234"
        );
      }

      await setloginbutton("Login");
      setloginData(
        JSON.stringify({
          emailid: user.emailid,
          uuid: user.uuid,
          verified: user.accountverified,
          user: true,
          publickey: user.address,
        })
      );
      toast.success("Logged in successfully", { autoClose: 2000 });
      await setWalletValues("metamask", false);
      ensureDashboardCss();
      if (useDemoLogin) {
        return router.push("/user/dashboard");
      }
      return router.push("/user/verification");
    } catch (error) {
      setloginbutton("Login");
      const hint =
        error?.response?.data?.hint ||
        error?.response?.data?.error ||
        error?.message;
      const message =
        hint && String(hint).includes("demo@")
          ? hint
          : hint
            ? `Failed to login: ${hint}`
            : "Failed to login. Demo: demo@deswap.co / Demo@1234";
      toast.error(message, { autoClose: 3500 });
    }
  };

  return (
    <>
      <div className="loginForm">
        <h2>Login</h2>
        <p
          style={{
            fontSize: "13px",
            marginBottom: "8px",
            opacity: 0.85,
          }}
        >
          Demo: <strong>demo@deswap.co</strong> / <strong>Demo@1234</strong>
        </p>
        <div className="inputsList">
          <form method="post" autoComplete="off">
            <div className="formInputs">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                {...register("email")}
                autoComplete="off"
                error={formState.errors.email && true}
              />
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
              {formState.errors.password && (
                <p>{formState.errors.password.message}</p>
              )}
              <i onClick={togglePasswordVisiblity}>
                {passwordShown ? eyeSlash : eye}
              </i>
            </div>
            <div className="formInputs link">
              <Link legacyBehavior href="/user/forgotpassword">
                <a>Forgot Password ?</a>
              </Link>
            </div>
            <div className="formInputs">
              <button
                className=" btnslider"
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
          <div className="formFooter">
            <p>
              Don&apos;t Have An Account Yet?{" "}
              <Link legacyBehavior href="/user/register">
                <a>Register</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 99999 }}
        toastStyle={{
          backgroundColor: "#232323",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      />
    </>
  );
}

export default LoginForm;
