import awss3connection from "../connection/awss3connection";


module.exports.uploadFile = (data, cb) => {
    try {


        let s3 = awss3connection();
        let params = {
            Bucket: process.env.bucketName,
            Key: process.env.pathTillFolder + data.fileName,
            Body: data.fileContent,
            ContentType: "images",
            ACL: 'public-read'
        };
        //process.env.pathTillFolder+
        //
        s3.upload(params, cb);
        //
    } catch (e) {
        console.log("Failed to upload file : ", e);
    }
}


module.exports.downloadFile = async (data, cb) => {
    try {

        // const crypto = require('crypto');

        // let cipher = crypto.createCipher('aes-256-cbc', 'key');
        // let encrypted = cipher.update(data.fileContent, 'utf8', 'hex');
        // encrypted += cipher.final('hex');

        //
        let s3 = awss3connection();
        // let params = {
        //     Bucket: process.env.bucketName,
        //     Key: process.env.pathTillFolder + data.fileName,
        //     Body: encrypted, //data.fileContent,
        //     ContentType: "images",
        //     ACL: 'public-read'
        // };
        //process.env.pathTillFolder+
        //
        const list= await s3.listObjectsV2({
            Bucket:process.env.bucketName
        }).promise();


        return list;
        //
    } catch (e) {
        console.log("Failed to upload file : ", e);
    }
}