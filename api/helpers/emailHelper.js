const nodeMailer = require('nodemailer');

module.exports = function (email, token) {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.RESET_EMAIL,
      pass: process.env.RESET_PASSWORD
    }
  });
  const mailOptions = {
    from: `"Gastory" <${process.env.RESET_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: 'Gastory password reset', // Subject line
    html: `<h1 style="color: red">Password Reset</h1>
      <br />
      <h3>Click on the following link to reset your password: </h3><a href="${process.env.UI_URL}/whoopsis?reset=${encodeURIComponent(token)}">${process.env.UI_URL}/whoopsis?reset=${token}</a>
      <br />
      <p>If you did not request this password change please feel free to ignore it.</p>
      <br />
      <br />
      <br />
      <strong>With ❤️ from Gastory</strong>
    ` // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}