import User from "../Models/User.js";
import UserDetails from "../Models/userDetails.js";
import bcrypt from "bcrypt"

export const createUser = async (req, res) => {
  const { role, email, password, phoneNumber, address, location } = req.body;
  const { role: currentUserRole } = req.params;

  try {
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const canRegisterAs = {
      admin: ['user'],
      hr: ['user', 'admin', 'projectManager'],
      projectManager: ['user', 'admin', 'hr', 'projectManager']
    };

    // if (!canRegisterAs[currentUserRole] || !canRegisterAs[currentUserRole].includes(role)) {
    //   return res.status(403).json({ success: false, message: `Invalid role assignment. ${currentUserRole} can only register ${canRegisterAs[currentUserRole].join(", ")}.` });
    // }
    
    if (!currentUserRole || !canRegisterAs[currentUserRole]) {
      return res.status(400).json({ success: false, message: "Invalid current user role." });
    }

    if (!canRegisterAs[currentUserRole].includes(role)) {
      return res.status(403).json({ success: false, message: `Invalid role assignment. ${currentUserRole} can only register ${canRegisterAs[currentUserRole].join(", ")}.` });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
   
    const newUser = new User({
      email,
      password:hashedPassword,
      role,
    });

    await newUser.save();

    
    let userDetailsResponse = null;
    if (['user', 'projectManager'].includes(role)) {
      const userDetails = new UserDetails({
        userId: newUser._id,
        phoneNumber,
        address,
        location,
      });

      await userDetails.save();
      userDetailsResponse = {
        phoneNumber,
        address,
        location,
      };
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: {
        user: {
          userId: newUser._id,
          email: newUser.email,
          role: newUser.role,
        },
        userDetails: userDetailsResponse,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error); 
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ message: "An error occurred during user creation.", error: error.message });
  }
};


export const getAllUsers =  async (req, res) => {
  try {
    const users = await User.find(); 
    return res.status(200).json({
      success: true,
      message: "Access granted. You have the necessary permissions.",
      user:users
    });
  } catch (error) {
    console.error("Error accessing protected endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while accessing the endpoint.",
      error: error.message,
    });
  }
};




