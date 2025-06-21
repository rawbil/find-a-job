import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

interface Options {
  email: string;
  template: string;
  subject: string;
  data: any;
}

export default async function sendMail(options: Options) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
    logger: true,
    debug: true,
  });

  const { email, template, subject, data } = options;

  const htmlString = path.join(__dirname, "../mails", template);
  const html = (await ejs.renderFile(htmlString, data)) as string;

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
    data,
  };

  await transporter.sendMail(mailOptions);
}
