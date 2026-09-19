import getMongoDBConnection from "../../../utils/connection/mongodbconnection.js";
import userModel from "../../../models/Users";
import resetpasswordModel from "../../../models/password/resetpassword.js";
import { verifyJWT, decodeJWT } from "@/utils/common/jwtToken";
import { decryptEmailVerificationData } from "../../../utils/common/crypto";
import { responseBodyEncryptionUnprotected } from "../../../utils/common/jwtToken"
import unprotectedmiddleware from "../../../middleware/unprotectedmiddleware"


const handler = async(req, res) => {
    try {

        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        let token = await decodeURIComponent(req.body.token);

        let decryptedToken = await decryptEmailVerificationData(token);

        let verificationResult = await verifyJWT({ jwtToken: decryptedToken });

        let jwtToken = await decodeJWT({ jwtToken: decryptedToken });

        //
        let user = await userModel.findOne({
            uuid: jwtToken.payload.user
        });

        if (user == null || user == undefined) {
            res.status(400).json({ data: null, error: "Invalid user" });
            return
        }

        let fetchingFromRecord = await resetpasswordModel.findOne({
            uid: jwtToken.payload.user,
            tokenhash: jwtToken.payload.hash,
            tokenType: "EmailVerification"
        });

        if (fetchingFromRecord == null || fetchingFromRecord == undefined) {
            res.status(400).json({ data: null, error: "Invalid link" });
            return;
        }

        await userModel.updateOne({
            uuid: jwtToken.payload.user
        }, {
            $set: {
                emailVerified: true
            },
        });
        //
        await resetpasswordModel.deleteOne({
            uid: jwtToken.payload.user,
            tokenhash: jwtToken.payload.hash,
            tokenType: "EmailVerification"
        });

        res.setHeader('response-security', true)
        res.status(200).json({ data: await responseBodyEncryptionUnprotected({ data: { uid: jwtToken.payload.user }, error: null }), type: "noauth" });

    } catch (e) {
        //console.log("Error message : ",e);
        if (e.message == "jwt expired") {
            res.status(400).json({ data: null, error: "Token expired" });
        } else {
            res.status(400).json({ data: null, error: "Invalid token" });
        }
        return;
    }
}

export default unprotectedmiddleware(handler);