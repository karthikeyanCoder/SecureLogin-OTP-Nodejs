import User from "../Models/User.js";
const LATEST_VERSION = {
  version: "2.0",
  mandatory: true,
};

export const updateUserVersion = async (req, res) => {
  try {
    const { userId, newVersion } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.currentVersion = newVersion;
    user.lastUpdateNotification = null;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "App version updated successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const checkForUpdate = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const currentVersion = user.currentVersion;
    const latestVersion = LATEST_VERSION.version;

    if (currentVersion < latestVersion) {
      const now = new Date();
      const notificationInterval = 30 * 60 * 1000; 

     
      if (!user.lastUpdateNotification || now - user.lastUpdateNotification > notificationInterval) {
        user.lastUpdateNotification = now;  
        await user.save();  

        return res.status(200).json({
          success: true,
          message: `A newer version (${latestVersion}) is available. Please update your App.`,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "veru thing upto date ",
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        message: "You are using the latest version.",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
