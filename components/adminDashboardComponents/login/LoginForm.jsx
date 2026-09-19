import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import {requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";
import { setloginData } from "../../../utils/auth/login";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {SanitizeRequestObject,SanitizeRequestString} from "../../../utils/common/sanitize"


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
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setconfirmPasswordShown] = useState(false);
  const [Error, Seterr] = useState("");
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
      //
      Seterr("");
      const data1=await SanitizeRequestObject(userData)
      if (data1) {
        await setloginbutton("Logging..");
        let encryptionData = await requestBodyEncryptionUnprotected(data1)
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/admin/login`,{data:encryptionData},{
          headers:{
            'security-set':true
          }
        });
        //const { data } = await axios.post("/api/login", userData);
        // let encryptionData = await requestBodyEncryptionUnprotected(userData)
        // const { data } = await axios.post(
        //   `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/login`,
        //   {data:encryptionData},
        //   { withCredentials: true,
        //     headers:{
        //       'security-set':true
        //     }
        //    }
        // );
        const data2=await SanitizeRequestObject(data)
        if (data2) {
          await setloginbutton("Login");
          setloginData(
            JSON.stringify({
              emailid: data2.user.emailid,
              uuid: data2.user.uuid,
              verified: data2.user.accountverified,
              user: false,
              publickey: data2.user.address,
            })
          );
        }
        //router.push("/admin/verification");
        await Seterr("Logged in successfully");
        return router.push("/admin/verification");
      }
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
      console.log("Error message : ", e);
      setloginbutton("Login")
      Seterr("Failed to login");
      setError("Failed to login");
    }
  };

  return (
    <>
      <div className="loginForm">
        <h2>Login</h2>
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
