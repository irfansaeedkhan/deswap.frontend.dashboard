import AWS from "aws-sdk";

function awss3connection(){
    try{
        AWS.config.update({
            accessKeyId: process.env.accessKey,
            secretAccessKey: process.env.secretKey,
            region: process.env.region,
        });
        
        let awsS3 = new AWS.S3();
        return awsS3;
        //
    }catch(e){
        console.log(e);
    }
}
export default awss3connection;