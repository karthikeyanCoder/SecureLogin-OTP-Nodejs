import validator from "validator";
import BookSession from "../Models/BookApoinmentModel.js";
import { bookingEmail } from "../utils/AppoinmentEmailSender.js";

export const bookSession = async (req, res) => {
  const { name, companyName, email, mobile, address, sessionDate } = req.body;
  console.log("Booking request data: ", req.body);

  try {
    if (!name || !companyName || !email || !mobile || !address || !sessionDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

   
    if (!validator.isNumeric(mobile) || mobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be a 10-digit number.",
      });
    }
    const startDate = new Date(sessionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return res.status(400).json({
        success: false,
        message: "The appointment date must be today or a future date.",
      });
    }
    const existingUser = await BookSession.findOne({ email, mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A booking already exists for this user.",
      });
    }
    const endBlockDate = new Date(startDate);
    endBlockDate.setDate(startDate.getDate() + 3);

    const blockedSession = await BookSession.findOne({
      $or: [
        { date: { $gte: startDate, $lte: endBlockDate } },
        { blockedDates: { $elemMatch: { $gte: startDate, $lte: endBlockDate } } }
      ],
      isAvailable: false,
    });

    if (blockedSession) {
      return res.status(400).json({
        success: false,
        message: "These dates are not available for booking.",
      });
    }

    const blockedDates = [];
    for (let i = 0; i <= 3; i++) {
      const blockedDate = new Date(startDate);
      blockedDate.setDate(startDate.getDate() + i);
      blockedDates.push(blockedDate);
    }

    let session = await BookSession.findOne({ date: startDate });
    if (!session) {
      session = new BookSession({
        name,
        companyName,
        email,
        mobile,
        address,
        date: startDate,
        isAvailable: true,
        blockedDates: blockedDates,
      });
    }

    if (!session.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This session is not available for booking.",
      });
    }

    session.isAvailable = false;
    session.bookedAt = new Date();
    session.bookedUntil = endBlockDate;
    session.blockedDates = blockedDates;
    await session.save();
    await bookingEmail(email, startDate.toLocaleDateString());
    res.status(200).json({
      success: true,
      message: `Session booked successfully for ${startDate.toLocaleDateString()} }. `,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error booking session",
      error: error.message,
    });
  }
};


export const getBlockedDates = async (req, res) => {
  try {
     
    const sessions = await BookSession.find({ isAvailable: false }, 'blockedDates');
    
    
    const blockedDates = sessions.reduce((acc, session) => acc.concat(session.blockedDates), []);
    
    res.status(200).json(blockedDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching blocked dates",
      error: error.message,
    });
  }
};


export const getBookedDates = async (req, res) => {
  try {
    const sessions = await BookSession.find({ isAvailable: false });
    const bookedDates = sessions.map(session => session.date);
    res.status(200).json(bookedDates);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching booked dates",
      error: error.message,
    });
  }
};
