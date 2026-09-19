import getMongoDBConnection from "../../../../utils/connection/mongodbconnection";
import usermiddleware from "../../../../middleware/usermiddleware";
import Users from "../../../../models/Users";
import ProfilePic from "../../../../models/profilepic/profilepic";
import { responseBodyEncryption } from "../../../../utils/common/jwtToken"
const crypto = require('crypto');
import { downloadFile } from "../../../../utils/common/aws";
import awss3connection from "../../../../utils/connection/awss3connection";
import fs from "fs";
import path from "path"
import {decryptImage} from "../../../../utils/authNextfunction/encryption"
/**
 * @api {post} /api/users/profile/fetch/ Fetch user profile
 * @apiName FetchUserProfile
 * @apiGroup User/Profile
 * @apiVersion 1.0.0
 * @apiDescription Fetch user profile
 * @apiExample {axios} Example usage:
 * axios.post('/api/users/profile/fetch/')
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
 * 
 * 
 *  
 */
const handler = async (req, res) => {
    try {
        //
        if (req.method !== 'POST') {
            res.status(400).json({ data: null, error: "Invalid Method" });
            return;
        }

        await getMongoDBConnection();

        let result = await ProfilePic.findOne({
            UserID: req.body.uuid,
            Status: 'Active'
        })

        //decryptImage("","key")



        // let s3 = awss3connection();
        // // console.log("result.Location", result.Location.split("/")[result.Location.split("/").length - 1])
        // var params = { Bucket: process.env.bucketName, Key: process.env.pathTillFolder + result.Location.split("/")[result.Location.split("/").length - 1] }
        // var s3file = await s3.getObject(params).promise()

        // console.log("s3file", s3file.Body)

        // let decipher = crypto.createDecipher('aes-256-cbc', 'key');
        // let decrypted = decipher.update(s3file.Body.toString('utf-8'), 'hex', 'utf8');
        // decrypted += decipher.final('utf8');
        // var buf = Buffer.from(decrypted, 'utf-8');

        

        // fs.writeFile(path.join("public/tett.jpg"), buf, err => {
        //     if (err) {
        //         console.error(err)
        //         return
        //     }
        // })

            res.setHeader('response-security', true)
            res.status(200).json({ data: await responseBodyEncryption({ data: result,/*body:s3file.Body*/ error: null }), type: "userauth" });

        } catch (e) {
            console.log(e);
            res.status(400).json({ data: null, error: "Failed to fetch" });
        }
    }

//Need to add middleware
export default usermiddleware(handler);