import nextConnect from 'next-connect';
import multer from 'multer';
import { resolve } from "path";
import fs from "fs";
import { uploadFile } from "../../../../utils/common/aws";
//import  from "../";
import ProfilePic from "../../../../models/profilepic/profilepic";
import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../middleware/usermiddleware";
import Joi from "joi";
import { verifyJWT, decodeJWT } from "../../../../utils/common/jwtToken";
import Cookies from 'cookies';
import { decryptData } from "../../../../utils/common/crypto";
import { responseBodyEncryption } from "../../../../utils/common/jwtToken"
import {encryptImage} from "../../../../utils/authNextfunction/encryption"
/**
 * @api {post} /api/users/profile/upload/ Upload user profile
 * @apiName UploadUserProfile
 * @apiGroup User/Profile
 * @apiVersion 1.0.0
 * @apiDescription Upload user profile
 * @apiBody {file} file Profile picture
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/profile/upload/', {file: file})
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} data User data.
 * @apiSuccessExample {json} Success-Response:
 * {
 * "data": "Encrypted data"
 * }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 * {
 * "message": "Error message"
 * }
 */

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
    convert: true,
};

const upload = multer({
    storage: multer.diskStorage({
        destination: './public',
        filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
    }),
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
    try {

        var filedetail = fs.statSync(req.file.path);
        var buffer = new Buffer.alloc(filedetail.size);
        //encryptImage(buffer,"key")
        var fileHandle = fs.openSync(req.file.path, "rs");
        let bytesRead = fs.readSync(fileHandle, buffer, 0, filedetail.size, 0);
        uploadFile({ fileName: req.file.filename, fileContent: buffer }, async (err, data) => {
            try {
                if (err) {
                    return res.status(400).json({ data: null, error: err });
                }


                await getMongoDBConnection();

                let cookies = await new Cookies(req, res);
                let encryptedCookie = await cookies.get(process.env.DOMAIN_NAME);

                if (!encryptedCookie) {
                    res.status(401).json({ data: null, error: "Invalid login" });
                    return;
                }
                let stringedcookie = await decryptData(encryptedCookie);
                let cookie = await JSON.parse(stringedcookie);

                //Checking wether valid jwt token or not
                if (cookie.jwtToken == undefined || cookie.jwtToken == "") {
                    res.status(401).json({ data: null, error: "Invalid login" });
                    return
                }

                let verificationResult = await verifyJWT({ jwtToken: cookie.jwtToken });
                let jwtToken = await decodeJWT({ jwtToken: cookie.jwtToken });

                const uuid=jwtToken.payload.uuid


                await ProfilePic.updateMany({UserID:uuid,Status:"Active"},{$set:{Status:"Deactive"}})


                const profile = await ProfilePic.insertMany([{
                    Name: req.file.filename,
                    Location: data.Location,
                    UserID: uuid
                }]).catch((e) => {
                    console.log("Error message : ", e);
                });
                await fs.unlinkSync(req.file.path);

                res.setHeader('response-security', true)
                return res.status(200).json({ data: await responseBodyEncryption({data: "Success", location: profile, error: null }), type: "userauth" });
            } catch (e) {
                console.log(e);
            }
        });

    } catch (e) {
        //console.log("Error : ",e);
        //fs.unlinkSync(req.file.path);
        res.status(400).json({ data: '', error: "Failed to upload file" });
    }
});

//export default apiRoute;
export default usermiddleware(apiRoute);

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};
