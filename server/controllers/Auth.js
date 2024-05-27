const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//sendotp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne({ email });

    // if user already User.exists, then return response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP Generated: ", otp);

    //check unique otp or not
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    //otp entry in db
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return the resonse successfully
    res.status(200).json({
      success: true,
      message: "OTP send successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signup
expects.signUp = async (req, res) => {
  try {
    //data fetch from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate it
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !contactNumber ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //2 password mactch (password === conformpassword)
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is not equal to ConformPassword, Please try again",
      });
    }

    //check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // find most resent OTP stored in db for the user
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("Most resent OTP: ", recentOtp);

    //validate otp
    if (recentOtp.lastName == 0) {
      //otp not found
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //entry create in db(store user datails)
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetail: profileDetails._id,
      iamge: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //return res
    return res.status(200).json({
      success: true,
      message: "User is registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User can't registered, Please try again",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;
    //validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, Please try again",
      });
    }

    //check user exist or not
    const user = await User.findOne({ email }).populate("additionalDetail");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered, Please first SignUp",
      });
    }

    //generate JWT token, after password match
    if (await bcrypt.compare(password, user.password)) {
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httponly: true,
      };

      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie and send response
      res.cookies("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Login successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failed, Please try again",
    });
  }
};

//changePassword
exports.changePassword = async (req, res) => {
  try {
    // Get data from request body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate the input
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm new password do not match",
      });
    }

    // Get the user ID from the token (assuming authentication middleware sets req.user)
    const userId = req.user.id;

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the old password matches the current password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    // Send mail - Password updated (using the mailSender utility)
    await mailSender(user.email, "Password Updated", "<p>Your password has been updated successfully.</p>");

    // Return response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Password update failed, please try again",
    });
  }
};
