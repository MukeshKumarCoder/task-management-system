const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logActivity } = require("../Utils/activityLogger");

// signUp
exports.signUp = async (req, res) => {
  try {
    // data from body
    const { name, email, password, role, status } = req.body;

    // validate the data
    if (!name || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "User",
      status: status || "Active",
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });

    // Remove password from response
    user.password = undefined;

    //return res
    return res.status(200).json({
      success: true,
      message: "User Is Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

// Login
exports.Login = async (req, res) => {
  try {
    // data from body
    const { email, password } = req.body;
    // validate data

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    //user check exist or not
    const user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered please signup first",
      });
    }

    // Check if user status is Inactive
    if (user.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated. Please contact an admin.",
      });
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role, accountType: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // Save token to user document in database
      user.token = token;
      user.password = undefined;

      // Log login activity
      await logActivity(user._id, "Login");

      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password Is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};
