import StartMappingData from "../Models/MODEAUTOMATICMAPPING.js"
import History from "../Models/MODEMANUALMAPPING.js";
import AutomatedDisinfectantData from "../Models/MODEDISINFECTIONMAPPING.JS.js";

const ROBOT_IDS = [
  "0001",
  "0002",
  "0003",
  "0004",
  "0005",
  "0006",
  "0007",
  "0008",
  "0009",
  "0010",
];
export const saveMappingData = async (req, res) => {
  try {
    const {
      mode,
      robotId,
      robotName,
      feedback,
      linear_velocity = [],
      angular_velocity = [],
      current_position = [],
      current_orientation = [],
      map_image,
      completion_command,
      map_name,
      timeTaken,
      status,
      percentageCompleted,
      position,
      orientation,
      object_image_name,
      object_feedback,
    } = req.body;

    console.log("user request body:", req.body);

    const userId = req.user._id;
    console.log("post request  userid ", userId);

    if (
      !mode ||
      (mode !== "automatic" &&
        mode !== "manual" &&
        mode !== "AutomatedDisinfectant")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or missing mode. Expected 'automatic', 'manual', or 'Automated Disinfectant'.",
      });
    }

    if (mode === "automatic") {
      console.log("Processing automatic mode with the following data:");
      console.log("robotId:", robotId);
      console.log("feedback:", feedback);
      console.log("linear_velocity:", linear_velocity);
      console.log("angular_velocity:", angular_velocity);
      console.log("current_position:", current_position);
      console.log("current_orientation:", current_orientation);
      console.log("map_image:", map_image);
      console.log("completion_command:", completion_command);
      console.log("map_name:", map_name);
      console.log("timeTaken:", timeTaken);
      console.log("status:", status);
      console.log("percentageCompleted:", percentageCompleted);
      if (!robotId || !ROBOT_IDS.includes(robotId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing robotId.",
        });
      }

      if (
        !feedback ||
        !Array.isArray(linear_velocity) ||
        !Array.isArray(angular_velocity) ||
        !Array.isArray(current_position) ||
        !Array.isArray(current_orientation) ||
        !map_image ||
        !completion_command ||
        !map_name ||
        !timeTaken ||
        !status ||
        !percentageCompleted
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields or invalid data types.",
        });
      }

      const imageBase64 = Buffer.from(map_image, "base64").toString("base64");

      const startMappingData = new StartMappingData({
        userId,
        robotId,
        feedback,
        linear_velocity,
        angular_velocity,
        current_position,
        current_orientation,
        map_image: imageBase64,
        completion_command,
        map_name,
        timeTaken,
        status,
        percentageCompleted,
      });

      await startMappingData.save();

      return res.status(201).json({
        success: true,
        message: "Automatic mapping data saved successfully.",
        data: startMappingData,
      });
    } else if (mode === "manual") {
      if (
        !robotName ||
        !robotId ||
        !map_name ||
        !map_image ||
        !timeTaken ||
        !percentageCompleted ||
        !status ||
        !linear_velocity ||
        !angular_velocity ||
        !position ||
        !orientation
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields or invalid data types.",
        });
      }

      const imageBase64 = Buffer.from(map_image, "base64").toString("base64");

      const history = new History({
        userId,
        robotId,
        robotName,
        mapName: map_name,
        image: imageBase64,
        timeTaken,
        percentCompleted: percentageCompleted,
        status,
        linear_velocity,
        angular_velocity,
        position,
        orientation,
      });

      await history.save();
      return res.status(201).json({
        success: true,
        message: "Manual mapping data saved successfully.",
        data: history,
      });
    } else if (mode === "AutomatedDisinfectant") {
      if (
        !feedback ||
        !position ||
        !orientation ||
        !map_image ||
        !object_image_name ||
        !object_feedback
      ) {
        console.log(
          "automatic data",
          feedback,
          position,
          orientation,
          map_image,
          object_image_name,
          object_feedback
        );

        return res.status(400).json({
          success: false,
          message:
            "Missing required fields or invalid data types for Automated Disinfectant mode.",
        });
      }

      const imageBase = Buffer.from(map_image, "base64").toString("base64");
      const disinfectantData = new AutomatedDisinfectantData({
        userId,
        feedback,
        position,
        orientation,
        map_image: imageBase,
        object_image_name,
        object_feedback,
      });

      await disinfectantData.save();
      return res.status(201).json({
        success: true,
        message: "Automated Disinfectant data saved successfully.",
        data: disinfectantData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while saving mapping data.",
      error: error.message,
    });
  }
};
export const getMappingData = async (req, res) => {
  try {
    const { mode } = req.query;

    //const userId = req.user.id;
    const userId = req?.user?.userId;
    console.log("Request mode:", mode);
    console.log("User ID:", userId);
    let data;

    if (mode === "automatic") {
      data = await StartMappingData.find({ userId });
    } else if (mode === "manual") {
      data = await History.find({ userId });
    } else if (mode === "AutomatedDisinfectant") {
      data = await AutomatedDisinfectantData.find({ userId });
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Invalid mode. Expected 'automatic', 'manual', or 'AutomatedDisinfectant'.",
      });
    }
    console.log("data is ", data);
    return res.status(200).json({
      success: true,
      message: `Data retrieved successfully for mode: ${mode}.`,
      data: data.map((entry) => ({
        ...entry._doc,
        map_image: `data:image/png;base64,${entry.map_image}`,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving mapping data.",
      error: error.message,
    });
  }
};
