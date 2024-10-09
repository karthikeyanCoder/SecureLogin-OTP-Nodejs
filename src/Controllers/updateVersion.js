import User from "../Models/User.js";

const LATEST_VERSION = {
  version: "2.0",
  mandatory: true,
};

export const checkAndUpdateVersion = async (req, res) => {
  try {
    const { userId, newVersion } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentVersion = user.currentVersion;
    const latestVersion = LATEST_VERSION.version;

    // If newVersion is provided, update the user's current version
    if (newVersion && newVersion !== currentVersion) {
      user.currentVersion = newVersion;
      user.lastUpdateNotification = null; // Reset notification timestamp
      await user.save();
      return res.status(200).json({
        success: true,
        message: "App version updated successfully.",
      });
    }

    // Check if the user's current version is outdated
    if (currentVersion < latestVersion) {
      const now = new Date();
      const notificationInterval = 30 * 60 * 1000; // 30 minutes

      if (!user.lastUpdateNotification || now - user.lastUpdateNotification > notificationInterval) {
        user.lastUpdateNotification = now; // Update the timestamp
        await user.save();

        return res.status(200).json({
          success: true,
          message: `A newer version (${latestVersion}) is available. Please update your App.`,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "You have already been notified about the new version.",
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


export const getUserVersion = async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId);
    //const userId = req?.user?.userId;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      currentVersion: user.currentVersion, 
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};