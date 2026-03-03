import nodemailer from 'nodemailer'
export const sendEmail = async ({ to = '', subject = '', text = '', html = '' }) => {


  const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });



  const info = await transporter.sendMail({
    from: '"abdo', // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
}