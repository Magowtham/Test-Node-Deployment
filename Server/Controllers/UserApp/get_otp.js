const UserModel = require("../../Models/user_data");
const OtpModel = require("../../Models/otp");
const generateOtp = require("./generate_otp");
const sendGmail = require("./send_gmail");
const getOtp = async (req, res) => {
  try {
    const { newUser, email } = req.body;
    if (!newUser) {
      const [searchEmail] = await UserModel.find(
        { email },
        { _id: 0, email: 1 }
      );
      if (!searchEmail) {
        return res
          .status(400)
          .json({ status: false, message: "user not exists" });
      }
    }
    const otp = generateOtp(5);
    const gmailStatus = await sendGmail(email, otp, 3, newUser);
    await OtpModel({
      email,
      otp,
      expirationTime: new Date(Date.now() + 3 * 60 * 1000),
    }).save();
    res.status(200).json({ status: true, message: gmailStatus });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: false, message: "oops something went wrong" });
  }
};

module.exports = getOtp;
