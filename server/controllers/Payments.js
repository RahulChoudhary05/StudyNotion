const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  //get courseId and userId
  const { course_id } = req.body;
  const userId = req.user.id;
  //validation
  //valid courseId
  if (!course_id) {
    return res.json({
      success: false,
      message: "Please provide valid course ID",
    });
  }

  //valid courseDetail
  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Can't find the course",
      });
    }

    //user already pay for the same course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student already enrolled",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }

  //order create
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now().toString),
    notes: {
      courseID: course_id,
      userId,
    },
  };
  try {
    //initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    //return response
    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Could not initiate order",
    });
  }
};

//verify signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
  //server secret
  const webhookSecret = "12345678";

  //Razorpay secret
  const signature = req.header("x-razorpay-signature");

  //match both secret
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature == digest) {
    console.log("Payment is Authorised");
    const { courseID, userId } = req.body.payload.payment.entity.notes;
    try {
      //find the course and enroll the student in it
      const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: courseID },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Course not found",
        });
      }
      console.log(enrolledCourse);

      //find the student and add course list enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { courses: courseID } },
        { new: true }
      );
      console.log(enrolledStudent);

      //mail sender confermation, enrolled in course
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulation for StudyNotion",
        "Congratulation, You are enrolled into new StudyNotion Course"
      );

      console.log(emailResponse);

      //resopnse
      return res.status(200).json({
        success: true,
        message: "Signature vreified, courese add and mail send seccessflly",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }
};
