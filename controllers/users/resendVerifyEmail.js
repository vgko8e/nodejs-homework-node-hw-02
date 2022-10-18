const { User } = require("../../models/user");
const { RequestError, sendEmail } = require("../../helpers");

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw RequestError({ status: 404 });
  }
  if (user.verify) {
    throw RequestError({ status: 400 }, "User already verify");
  }
  const mail = {
    to: email,
    subject: "Confirm registration",
    html: `<a href="http://localhost:3000/api/users/verify/${user.verificationToken}" target="_blank">Submit email</a>`,
  };
  await sendEmail(mail);
  res.json({
    message: "Email verify resend",
  });
};

module.exports = resendVerifyEmail;
