const nodeMailer = require('nodemailer');


const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.RESET_EMAIL,
    pass: process.env.RESET_PASSWORD
  }
});

const send = function (mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

module.exports = {
  sendResetEmail: function (email, token) {
    const mailOptions = {
      from: `"Gastory" <${process.env.RESET_EMAIL}>`, // sender address
      to: email, // list of receivers
      subject: 'Gastory password reset', // Subject line
      html: `<h2 style="color: red">Password Reset</h2>
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
    send(mailOptions);
  },
  sendConfirmChangeEmail: function (email) {
    const mailOptions = {
      from: `"Gastory" <${process.env.RESET_EMAIL}>`, // sender address
      to: email, // list of receivers
      subject: 'Gastory password changed', // Subject line
      html: `<h2 style="color: teal">You password has been changed</h2>
        <br />
        <p>If you did not change your password then go and run to see what happened...</p>
        <p>But if you did... then we are good, go ahead and login with your flashy (and hopefully) strong secure new password.</p>
        <br />
        <strong>With ❤️ from Gastory</strong>
      ` // html body
    };
    send(mailOptions);
  }
};