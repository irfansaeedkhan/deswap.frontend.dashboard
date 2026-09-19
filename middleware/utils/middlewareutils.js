import Cookies from "cookies";

module.exports.getMiddlewareCookies = async (req, res) => {
  let cookies = await new Cookies(req, res);
  let encryptedCookie = await cookies.get(process.env.DOMAIN_NAME);
  return { cookies, encryptedCookie };
};
