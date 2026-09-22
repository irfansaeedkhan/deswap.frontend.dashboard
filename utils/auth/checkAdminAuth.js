import cookies from 'next-cookies';
import Cookies from 'cookies';
import CryptoJS from "crypto-js";
import { verifyFrontEndToken, decodeJWT, verifyJWT, createFrontUserToken,createFrontAdminToken } from "../common/jwtToken";
import { decryptData, decryptfrontendData } from "../common/crypto";

module.exports.checkAdminAuth = async (ctx) => {
    // Demo mode: allow access with demo session cookie
    if (
      process.env.DEMO_MODE === "true" ||
      process.env.NEXT_PUBLIC_DEMO_MODE === "true"
    ) {
      const header = ctx?.req?.headers?.cookie || "";
      const isDemoSession = header.includes("deswap_demo_session=1");
      const isDemoAdmin = header.includes("deswap_demo_role=admin");
      if (isDemoSession && isDemoAdmin) {
          return {
            props: {
              users: {
                uservalid: true,
                emailid: "admin@deswap.co",
                uuid: "demo-admin-uuid-0001",
                emailverified: true,
                role: "DeswapAdminRole",
              },
              link: process.env.PLATFORM_URL || "http://localhost:3000",
              demo: true,
            },
          };
      }
    }

    //Fetching cookie before pages loads
    let allcookie = await cookies(ctx);
    try {

        //If if not found then throw error
        if (allcookie[process.env.FRONT_END_COOKIE_NAME] == undefined) {
            throw "Invalid User";
        }

        //Fetching cookie
        //let result =  allcookie[process.env.FRONT_END_COOKIE_NAME];
        let encryptedCookie = allcookie[process.env.FRONT_END_COOKIE_NAME];

        let result = await decryptfrontendData(encryptedCookie);

        //Veriying jwt token jwt valid or not
        await verifyFrontEndToken({ jwtToken: result });

        //Decoding jwt if it is valid
        let decoded = await decodeJWT({ jwtToken: result });


        //If verfied and decode then returning
        //If role is admin then only allow valid user otherwise return specific
        //
        if (decoded?.payload?.role !== "DeswapAdminRole") {
            return {
                props: {
                    users: {
                        uservalid: false,
                    }
                },
                redirect: {
                    destination: `${process.env.NEXT_PUBLIC_USER_FRONTEND_REDIRECT}`,
                    permanent: false,
                }
            };
        }

        if ((decoded?.payload?.messageCodeAuth != true) && (!ctx.req.url.includes("/admin/verification"))) {
            //
            return {
                props: {
                    users: {
                        uservalid: false,
                    }
                },
                redirect: {
                    destination: "/",
                    permanent: false,
                }
            };
        }


        return {
            props: {
                users: {
                    uservalid: true,
                    emailid: decoded?.payload?.emailid,
                    uuid: decoded?.payload?.uuid,
                    role: decoded?.payload?.role,
                },
                link: process.env.PLATFORM_URL
            }
        }

    } catch (e) {
        let returnProps = {
            props: {
                users: {
                    uservalid: false,
                }
            },
            redirect: {
                destination: '/logout',
                permanent: false,
            }
        };
        if (e.message == "jwt expired") {
            if (allcookie[process.env.FRONT_END_COOKIE_NAME] == undefined) {
                return {
                    redirect: {
                        destination: '/logout',
                        permanent: false,
                    },
                    props: {
                        users: {
                            uservalid: false,
                        }
                    }
                }
            }

            let result = allcookie[process.env.DOMAIN_NAME];

            let stringedcookie = await decryptData(result);

            let cookie = await JSON.parse(stringedcookie);

            let verificationResult = await verifyJWT({ jwtToken: cookie.jwtToken }).catch((err) => {
                global.color = {
                    red: "\x1b[31m",
                    green: "\x1b[32m",
                    yellow: "\x1b[33m",
                    black: "\x1b[30m",
                    reset: "\x1b[0m",
                    blue: "\x1b[34m"
                };

                if (e.message != "jwt expired") {
                    throw "Invalid token";
                }
            });
            /*
            if(!verificationResult){
                return returnProps;
            }*/

            let serverdecoded = await decodeJWT({ jwtToken: result });


            let frontresult = allcookie[process.env.FRONT_END_COOKIE_NAME];
            let frontdecoded = await decodeJWT({ jwtToken: frontresult });
            let frontEndRefreshedToken = await createFrontAdminToken({
                uuid: frontdecoded?.payload?.uuid,
                time: frontdecoded?.payload?.loginTime,
                verificationStatus: frontdecoded?.payload?.emailverified,
                emailid: frontdecoded?.payload?.emailid,
                role: frontdecoded?.payload?.role,
                ip:frontdecoded?.payload?.ip,
                messageCodeAuth: frontdecoded?.payload?.messageCodeAuth
            });


            //allcookie[process.env.DOMAIN_NAME].
            const cookiesServer = new Cookies(ctx.req, ctx.res);

            let encryptedFrontendKey = await CryptoJS.AES.encrypt(
                frontEndRefreshedToken,
                process.env.FRONTEND_COOKIES_SECRET_KEY
            ).toString();

            let cookiesetfronend = await cookiesServer.set(process.env.FRONT_END_COOKIE_NAME, encryptedFrontendKey, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'strict',
                //secure:true
            });

            return {
                props: {
                    users: {
                        uservalid: true,
                        emailid: frontdecoded?.payload?.emailid,
                        uuid: frontdecoded?.payload?.uuid,
                        role: frontdecoded?.payload?.role,
                    },
                    link: process.env.PLATFORM_URL
                }
            }
        }
        //console.log(instanceof e);
        //Write code for refreshing page & check if session still exits in the backend then only otherwise
        return returnProps;
    }
}