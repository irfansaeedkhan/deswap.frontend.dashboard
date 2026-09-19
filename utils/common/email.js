import {createTransporter} from "../connection/nodemailerconfig.js";

module.exports.sendEmail = async (data)=>{
    try {
		  let transporter = await createTransporter();
      return await transporter.sendMail({
          from: `"${process.env.SENDER_EMAIL_NAME}" <${process.env.SENDER_EMAIL_ID}>`,
          to: data.toAddress,
          subject: data.subject,
          text: data.bodyText,
          html: data.bodyHTML,
        });
	} catch (e) {
		throw e;
	}   
}