const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//resetPasswordToken (in mail link)
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from request body
    const email = req.body.email;

    //check user for this email, email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: "YOur Email is not registered with us",
      });
    }

    //generate token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true } // updated detail retuen
    );

    //create url
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail containing url
    await mailSender(
      email,
      "Password Reser Link | StudyNotion",
      `<h1>Hello ${req.body.firstName}</h1> <p>Password Reset Link : ${url}</p> <h3>Time limit of reset password link </h3>`
    );

    // return response
    return res.json({
      success: true,
      message:
        "Email send successfully, Please check email and change password",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset the password",
    });
  }
};

//resetPassword (DB update the password)
exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;

    //validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password not matching",
      });
    }

    //get userdetails fron db using token
    const userDetails = await user.findOne({ token: token });

    //if no entry - invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token Invalid",
      });
    }

    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token Expired, Please regenerate your token",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //password update in db
    await user.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reset the password",
    });
  }
};
