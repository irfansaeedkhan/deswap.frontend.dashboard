const nodemailer = require("nodemailer");

module.exports.createTransporter = async ()=>{
	try {
        return await nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            debug: false,
            logger: false,
            tls: {
                secureProtocol:"TLSv1_method",
                secure: false,
                ignoreTLS: true,
                rejectUnauthorized: false
            },
            auth: {
              user: process.env.SMTP_USERNAME,
              pass: process.env.SMTP_PASSWORD,
            },
            attachments: [{
              filename: 'logo.png',
              path: `${__dirname}/../../../public/logo.png`,
              cid: 'logo1' //same cid value as in the html img src
            }]
          });
	} catch (e) {
		throw e;
	}
}
