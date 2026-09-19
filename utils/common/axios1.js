import axios from "axios";
import axiosRetry from "axios-retry";
import Router from "next/router";
import {
  responseBodyVerification,
  decodeResponseBody,
  decodeResponseBodyUnprotected,
  responseBodyVerificationUnprotected,
  responseBodyVerificationAdmin,
  decodeResponseBodyAdmin,
} from "../../utils/common/jwtToken";

import { encryptReqPayload } from "./encryptrequestpayload";

export const axiosNodeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PLATFORM_URL,
  withCredentials: true,
});

axiosNodeApi.interceptors.request.use(function (config) {
  // Encrypt the Data
  if (config.url) {
    console.log("hello");
    config.data = { data: encryptReqPayload(config.data) };
  }
  console.log("config", config);
  return config;
});

axiosNodeApi.interceptors.response.use(
  async (response) => {
    console.log("hi");
    try {
      if (
        response.status == 200 &&
        response.headers.hasOwnProperty("response-security") &&
        response.headers["response-security"] != undefined &&
        response.headers["response-security"] == "true"
      ) {
        //
        if (response.data.type == "noauth") {
          let jwtverified = true;
          await responseBodyVerificationUnprotected(response.data.data).catch(
            (error) => {
              console.log(error);
              jwtverified = false;
            }
          );

          if (jwtverified) {
            let responsedata = await decodeResponseBodyUnprotected(
              response.data.data
            );
            response.data = {
              ...response.data,
              ...responsedata.payload,
              exp: null,
              iat: null,
              iss: null,
              sub: null,
            };
          }
        } else if (response.data.type == "userauth") {
          let jwtverified = true;
          await responseBodyVerification(response.data.data).catch((error) => {
            jwtverified = false;
          });

          if (jwtverified) {
            let responsedata = await decodeResponseBody(response.data.data);
            response.data = {
              ...response.data,
              ...responsedata.payload,
              exp: null,
              iat: null,
              iss: null,
              sub: null,
            };
          }
        } else if (response.data.type == "adminauth") {
          let jwtverified = true;
          await responseBodyVerificationAdmin(response.data.data).catch(
            (error) => {
              jwtverified = false;
            }
          );

          if (jwtverified) {
            let responsedata = await decodeResponseBodyAdmin(
              response.data.data
            );
            response.data = {
              ...response.data,
              ...responsedata.payload,
              exp: null,
              iat: null,
              iss: null,
              sub: null,
            };
          }
        } else {
          let jwtverified = true;
          await responseBodyVerificationUnprotected(response.data.data).catch(
            (error) => {
              jwtverified = false;
            }
          );

          if (jwtverified) {
            let responsedata = await decodeResponseBodyUnprotected(
              response.data.data
            );
            response.data = {
              ...response.data,
              ...responsedata.payload,
              exp: null,
              iat: null,
              iss: null,
              sub: null,
            };
          }
        }
      }
      return response;
    } catch (e) {
      return response;
    }
  },
  async (err) => {
    if (err.response != null && err.response.status) {
      if (err.response.data.error == "Invalid login") {
        //console.log("Axios error invalid login : logout");
        //Router.push("/logout");
      }

      if (err.response.data.error == "Invalid token") {
        //console.log("Axios error invalid token : logout");
        //Router.push("/logout");
      }

      if (err.response.data.error == "Failed to refresh token") {
        //console.log("Axios error failed to refresh token : logout");
        //Router.push("/logout");
      }
    }
    throw err;
  }
);
