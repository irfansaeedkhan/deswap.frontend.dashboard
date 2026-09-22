import Link from "next/link";
import { useRouter } from "next/router";
import React, { Component } from "react";
import { withRouter } from "next/router";
import axios from "@/utils/common/axios";
import Loader from "@/components/reusables/loader/Loader";
import Image from "next/image";
import { requestBodyEncryptionUnprotected } from "@/utils/common/jwtToken";

class VerifyEmailAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valueUser: false,
      userid: null,
      message: "Verifiying...",
      message1: "",
      message2: "",
      message3: "Please Wait Till Email Id Is Verified",
    };
    this.checkTokenValidation = this.checkTokenValidation.bind(this);
  }

  async checkTokenValidation() {
    try {
      // axios.post("/api/verify/email",{token:`${this.props.router.query.token}`},{withCredentials: true}).then((result)=>{
      //     if(result.status==200){
      //         this.setState({ valueUser:true});
      //         this.setState({ message:"Success"});
      //         this.setState({ message1:null});
      //         this.setState({ message2:"Your Email Id Have Been Verified"});
      //         this.setState({ message3:<Link legacyBehavior href="/user/login"><a>Click {" "}here to login</a></Link>});
      //         this.setState({ userid:result.data.data.uid});

      //     }else{

      //     }
      // })
      let encryptionData = await requestBodyEncryptionUnprotected({
        token: `${this.props.router.query.token}`,
      });
      let result = await axios
        .post(
          `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/verify/email`,
          { data: encryptionData },
          {
            withCredentials: true,
            headers: {
              "security-set": true,
            },
          }
        )
        .then((result) => {
          if (result.status == 200) {
            this.setState({ valueUser: true });
            this.setState({ message: "Success" });
            this.setState({ message1: null });
            this.setState({ message2: "Your Email Id Have Been Verified" });
            this.setState({
              message3: (
                <Link legacyBehavior href="/user/login">
                  <a>Click here to login</a>
                </Link>
              ),
            });
            this.setState({ userid: result.data.data.uid });
          } else {
          }
        })
        .catch((error) => {
          this.setState({ valueUser: false });
          this.setState({ message: "Failed" });
          this.setState({ message1: null });
          this.setState({ message2: "Failed To Verify Email Address" });
          this.setState({
            message3: (
              <Link legacyBehavior href="/user/login">
                <a>Please Login And Resend Verification Email</a>
              </Link>
            ),
          });
        });
    } catch (e) {
      console.log("Failed to fetch token value : ", e);
    }
  }

  routeChangeComplete = () => {
    // this WILL have valid query data not empty {}
    this.checkTokenValidation();
  };
  componentDidMount() {
    this.props.router.events.on(
      "routeChangeComplete",
      this.routeChangeComplete
    );
  }
  componentWillUnmount() {
    this.props.router.events.off(
      "routeChangeComplete",
      this.routeChangeComplete
    );
  }

  render() {
    {
      /*return(
            <div></div>
            <div className="w-full h-screen flex flex-col justify-center items-center bg-bgg font-nunito px-6">
                <span className="text-5xl font-bold text-danger text-center">{this.state.message1}</span>
                <span className="text-4xl font-bold text-danger text-center mt-1 mb-2">{this.state.message2}</span>
                <span className="text-sm font-bold text-white text-center">{this.state.message3}</span>
            </div>
        )*/
    }
    return (
      <div className="logoutpageContainer">
        <div className="logoContainer">
          <Image
            src={"/images/logo.png"}
            width={152}
            height={32}
            alt="logo"
            loading="lazy"
          />
        </div>
        <div className="area">
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div className="logoutContent">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
              <filter id="gooey">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="10"
                  result="blur"
                ></feGaussianBlur>
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  result="goo"
                ></feColorMatrix>
                <feBlend in="SourceGraphic" in2="goo"></feBlend>
              </filter>
            </defs>
          </svg>
          <div className="blob blob-0"></div>
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="blob blob-4"></div>
          <div className="blob blob-5"></div>

          <h2>{this.state.message}</h2>
          <br></br>
          <h3 className="text-center">{this.state.message1}</h3>
          <h3 className="text-center">{this.state.message2}</h3>
          <h3 className="text-center">{this.state.message3}</h3>
        </div>
      </div>
    );
  }
}

export default withRouter(VerifyEmailAddress);
