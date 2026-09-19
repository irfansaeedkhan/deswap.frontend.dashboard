import cookies from 'next-cookies';
import Cookies from 'cookies';
import CryptoJS from "crypto-js";
import {verifyFrontEndToken,decodeJWT,verifyJWT,createFrontUserToken} from "../common/jwtToken";
import {decryptData,decryptfrontendData} from "../common/crypto";


module.exports.checkUserAuth = async (ctx)=>{
    // Demo mode: allow access with demo session cookie
    if (
      process.env.DEMO_MODE === "true" ||
      process.env.NEXT_PUBLIC_DEMO_MODE === "true"
    ) {
      let allcookieDemo = await cookies(ctx);
      if (allcookieDemo["deswap_demo_session"] === "1") {
        return {
          props: {
            users: {
              uservalid: true,
              emailid: "demo@deswap.co",
              uuid: "demo-user-uuid-0001",
              emailverified: true,
              role: "User",
            },
            link: process.env.PLATFORM_URL || "http://localhost:3000",
            demo: true,
          },
        };
      }
    }

    let allcookie = await cookies(ctx);
    try{    
        if(allcookie[process.env.FRONT_END_COOKIE_NAME]==undefined){
            throw "Invalid User";
        }
        let encryptedCookie =  allcookie[process.env.FRONT_END_COOKIE_NAME];
        let result = await  decryptfrontendData(encryptedCookie); 
        await verifyFrontEndToken({jwtToken:result});
        let decoded = await decodeJWT({jwtToken:result});
        
        if(decoded.payload.role!="User"){
            return {
                props:{
                    users: {
                        uservalid:false,
                    }
                },
                redirect: {
                    destination: "/",
                    permanent: false,
                }
            };
        }
        
        if((decoded.payload.messageCodeAuth!=true)&&(!ctx.req.url.includes("/user/verification"))){
            //
            return {
                props:{
                    users: {
                        uservalid:false,
                    }
                },
                redirect: {
                    destination: "/",
                    permanent: false,
                }
            };
        }

        return {
            props:{
                users: {
                    uservalid:true,
                    emailid:decoded.payload.emailid,
                    uuid:decoded.payload.uuid,
                    emailverified:decoded.payload.emailverified,
                    role:decoded.payload.role,
                },
                link:process.env.PLATFORM_URL
            }
        }
    }catch(e){

        console.log("Refreshing token ",e)
        let returnProps = {
            props:{
                users: {
                    uservalid:false,
                }
            },
            redirect: {
                destination: '/logout',
                permanent: false,
            }
        };
        if(e.message=="jwt expired"){
            if(allcookie[process.env.FRONT_END_COOKIE_NAME]==undefined){
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                    props:{
                        users: {
                            uservalid:false,
                        }
                    }
                }
            }
            

            let result =  allcookie[process.env.DOMAIN_NAME];
            
            let stringedcookie = await decryptData(result);
            let cookie = await JSON.parse(stringedcookie);
            
            let verificationResult = await verifyJWT({jwtToken:cookie.jwtToken}).catch((err)=>{
                global.color = {
                    red:"\x1b[31m",
                    green:"\x1b[32m",
                    yellow:"\x1b[33m",
                    black:"\x1b[30m",
                    reset:"\x1b[0m",
                    blue:"\x1b[34m"
                };
                
                if(e.message!="jwt expired"){
                    throw "Invalid token";
                }
            });
            
            let serverdecoded = await decodeJWT({jwtToken:result});
            let frontresult =  allcookie[process.env.FRONT_END_COOKIE_NAME];
            frontresult = await  decryptfrontendData(frontresult); 
            let frontdecoded = await decodeJWT({jwtToken:frontresult});
            
            if(!frontdecoded){
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    },
                    props:{
                        users: {
                            uservalid:false,
                        }
                    }
                }
            }

            let frontEndRefreshedToken = await createFrontUserToken({
                uuid: frontdecoded.payload.uuid,
                time:frontdecoded.payload.loginTime,
                verificationStatus:frontdecoded.payload.emailverified,
                emailid:frontdecoded.payload.emailid,
                role:frontdecoded.payload.role,
                messageCodeAuth:frontdecoded.payload.messageCodeAuth
            });
            
            let encryptedFrontendKey = await CryptoJS.AES.encrypt(
                frontEndRefreshedToken,
                process.env.FRONTEND_COOKIES_SECRET_KEY
            ).toString();

            const cookiesServer = new Cookies(ctx.req, ctx.res);
            let cookiesetfronend = await cookiesServer.set(process.env.FRONT_END_COOKIE_NAME,encryptedFrontendKey,{
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite:'strict',
                //secure:true
            });

            return {
                props:{
                    users: {
                        uservalid:true,
                        emailid:frontdecoded.payload.emailid,
                        uuid:frontdecoded.payload.uuid,
                        emailverified:frontdecoded.payload.emailverified,
                        role:frontdecoded.payload.role,
                    },
                    link:process.env.PLATFORM_URL
                }
            }
        }
        //Write code for refreshing page & check if session still exits in the backend then only otherwise
        return returnProps;
    }
}





