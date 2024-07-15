import User from "../Models/User.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      email,
      password: await bcrypt.hash(password, 10),
      isFirstTime: true,
    });

    user = await newUser.save();

    return res.json({
      message: "User registered successfully.  ",
      isFirstTime: true,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return res
      .status(500)
      .json({ message: "Registration failed. Please try again." });
  }
};
