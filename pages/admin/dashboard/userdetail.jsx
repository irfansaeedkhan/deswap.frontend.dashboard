import React, { useState } from "react";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useRouter } from "next/router";
import SimpleButton from "@/components/reusables/SimpleButton";
import Modal from "@/components/reusables/Modal";
import CopyIcon from "@/assets/svgAssets/CopyIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
import Image from "next/image";
import { AdminDashboardLayout } from "@/layout/admindashboard.layout";
import Dropdown from "@/components/global/DropDown";


const DropDowndata = [
  { id: 0, label: "Active" },
  { id: 1, label: "Disabled" },
];
// form validations
const schema = Joi.object({
  username: Joi.string().required().min(4).label("username").messages({
    "string.empty": `Username Required`,
    "any.required": `Required Field`,
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: {} })
    .required()
    .messages({
      "string.empty": `Email Required`,
      "any.required": `Email Required`,
    }),
  password: Joi.string().required().min(4).label("password").messages({
    "string.empty": `Password Required`,
    "any.required": `Required Field`,
  }),
});
function UserDetail() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const { handleSubmit, register, setError, formState } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const onSubmit = (data) => {
    setShowSuccess(false);
    // if (data) {
    //   setShowSuccess(true);
    // }

    //console.log(data);
  };
  const copy = async () => {
    await navigator.clipboard.writeText(
      "0xJ2n13CBbf530A1105711B27CDd9102716220ghn42"
    );
  };
  return (
    <div className="adminUserDetailContainer">
      <div className="adminUserDetailInner">
        <div className="title">
          <h1>User Detail</h1>
        </div>
        <div className="adminUserDetailMain">
          <div className="leftSide">
            {/* profile card */}
            <div className="profileCardContainer">
              <div className="ImageCardContainer">
                <div className="imageCard">
                  <div className="imageContainer">
                    <Image
                      src={"/images/avatar.png"}
                      width={88}
                      height={88}
                      alt="profile image"
                      loading="lazy"
                    />
                  </div>
                  <div className="imageDescription">
                    <h6>alexan88</h6>
                    <p>alexan@gmail.com</p>
                  </div>
                </div>
              </div>
              <div className="DescriptionCardContainer">
                <h6>Wallet Address</h6>
                <div className="copyaddContainer">
                  <p>0xAbsd...5eb5</p>
                  <button className="copyBtn" onClick={copy}>
                    <div className="copyImgIcon">
                      {" "}
                      <CopyIcon />
                    </div>
                  </button>
                </div>
              </div>
              <div className="statusContainer">
                <p>Status</p>
                <Dropdown data={DropDowndata} placeholder="Active" />
              </div>
            </div>
          </div>
          <div className="rightSide">
            {/* TransactionHistory */}
            <div className="TransactionHistory">
              <h3>Transactions</h3>
              <div className="TransactionHistoryTable customScroll">
                <table cellPadding="0" cellSpacing="0" border="0">
                  <thead>
                    <tr>
                      <th>Amount(DAW)</th>
                      <th>Price(USDC)</th>
                      <th>Contract</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>6,250</td>
                      <td className="price">
                        <p>1,000</p>
                        <p>Bonus 25%</p>
                      </td>
                      <td>0xa94e...639c</td>
                      <td className="timestamp">
                        <p>2021.11.23</p>
                        <p>15:48:26</p>
                      </td>
                    </tr>
                    <tr>
                      <td>6,250</td>
                      <td className="price">
                        <p>1,000</p>
                        <p>Bonus 25%</p>
                      </td>
                      <td>0xa94e...639c</td>
                      <td className="timestamp">
                        <p>2021.11.23</p>
                        <p>15:48:26</p>
                      </td>
                    </tr>
                    <tr>
                      <td>6,250</td>
                      <td className="price">
                        <p>1,000</p>
                        <p>Bonus 25%</p>
                      </td>
                      <td>0xa94e...639c</td>
                      <td className="timestamp">
                        <p>2021.11.23</p>
                        <p>15:48:26</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* sucess modal */}
      <Modal
        show={showSuccess}
        cross={true}
        onClose={() => setShowSuccess(false)}
      >
        <div className="editProfileForm">
          <h2>Edit Profile</h2>
          <div className="profileImgContainer">
            <input type="file" />
          </div>
          <div className="inputsList">
            <form method="post" autoComplete="off">
              <div className="formInputs">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter Username"
                  autoComplete="off"
                  {...register("username")}
                  error={formState.errors.username && true}
                />
                {formState.errors.username && (
                  <p>{formState.errors.username.message}</p>
                )}
              </div>
              <div className="formInputs">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  {...register("email")}
                  error={formState.errors.email && true}
                />
                {formState.errors.email && (
                  <p>{formState.errors.email.message}</p>
                )}
              </div>
              <div className="passwordContainer">
                <div className="formInputs">
                  <div className="iconinputContainer">
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
                  </div>

                  {formState.errors.password && (
                    <p>{formState.errors.password.message}</p>
                  )}
                </div>

                <button className="changepw">Change Password</button>
              </div>

              <div className="buttonContainer">
                <SimpleButton
                  text="Cancel"
                  color="#E44757"
                  backgroundColor="#291719"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSuccess(false);
                  }}
                  padding="1.6rem 0px"
                />
                <SimpleButton
                  backgroundColor="#E44757"
                  text="Save"
                  padding="1.6rem 0px"
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UserDetail;
UserDetail.PageLayout = AdminDashboardLayout;
