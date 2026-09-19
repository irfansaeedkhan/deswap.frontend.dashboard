import awss3connection from "../connection/awss3connection";

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports.createMultipartUpload = async (
  fileKey,
  fileType = "image/jpeg",
  ACL = "public-read"
) => {
  let s3 = await awss3connection();
  return await s3
    .createMultipartUpload({
      Bucket: process.env.bucketName,
      Key: fileKey,
      ACL: ACL,
      ContentType: fileType,
    })
    .promise();
};

// Function will upload data to S3 bucket
module.exports.uploadDataToAWSInMultipart = async (upload_params) => {
  let s3 = await awss3connection();
  return await s3.uploadPart(upload_params).promise();
};

module.exports.completeMultipartUpload = async (complete_upload_param) => {
  let s3 = await awss3connection();
  return await s3.completeMultipartUpload(complete_upload_param).promise();
};

module.exports.deleteObject = async (params) => {
  let s3 = await awss3connection();
  return await s3.deleteObject(params).promise();
};

module.exports.createPreSignedURLPart = async (
  fileKey,
  UploadId,
  PartNumber
) => {
  let s3 = await awss3connection();
  return await s3.getSignedUrlPromise("uploadPart", {
    Bucket: process.env.bucketName,
    Key: fileKey,
    UploadId: UploadId,
    PartNumber: PartNumber,
  });
};

module.exports.createAWSObjectName = async () => {
  return await makeid(30);
};

module.exports.createPresignedPost = async (params) => {
  const s3 = await awss3connection();
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
