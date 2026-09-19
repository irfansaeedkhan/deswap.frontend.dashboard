const nodemailer = require("nodemailer");

const MailTransporter = async () => {
  try {
    const transporter =  nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      debug: false,
      logger: false,
      tls: {
        secureProtocol: "TLSv1_method",
        secure: false,
        ignoreTLS: true,
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    return transporter;
  } catch (error) {
    console.log("unable to send email for registeration :", error);
  }
};

export default MailTransporter;
