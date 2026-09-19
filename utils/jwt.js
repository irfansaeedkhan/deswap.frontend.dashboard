var jwt = require("jsonwebtoken");
const crypto = require("crypto");
import { Buffer } from 'buffer';


const secretKey = Buffer.from(process.env.ENCRYPTION_SECRET_KEY, 'hex');
const randomData = Buffer.from(process.env.ENCRYPTION_RANDOM_DATA, 'hex');
const JWT = (userData) => {
  const userInfo = {
    id: userData._id,
    email: userData.email,
  };

  const JWTToken = jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  const cipher = crypto.createCipheriv(
    process.env.ALGORITHM,
    secretKey,
    randomData
  );

  let encryptedData = cipher.update(JWTToken, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return encryptedData;
};
export default JWT;
