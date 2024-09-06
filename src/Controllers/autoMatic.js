import StartMappingData from "../Models/Mapping.js";
import History from "../Models/History.js";
import AutomatedDisinfectantData from "../Models/automatedDisinfectant.js";
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
      userId,
      robotId,
      robotName,
      feedback,
      linear_velocity = [],
      angular_velocity = [],
      current_position = [],
      current_orientation = [],
      map_image ,
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

    //console.log("user request body:", req.body);

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
      if (!robotId || !ROBOT_IDS.includes(robotId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing robotId.",
        });
      }

      if (
        !userId ||
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
      //console.log("start mapping data is:", startMappingData);
      return res.status(201).json({
        success: true,
        message: "Automatic mapping data saved successfully.",
        data: startMappingData,
      });
    } else if (mode === "manual") {
      if (
        !userId ||
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
      //console.log("manual mapping data is:", history);
      return res.status(201).json({
        success: true,
        message: "Manual mapping data saved successfully.",
        data: history,
      });
    } else if (mode === "AutomatedDisinfectant") {
      if (
        !userId ||
        !feedback ||
        !position ||
        !orientation ||
        !map_image ||
        !object_image_name ||
        !object_feedback
      ) {
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
        map_image:imageBase,
        object_image_name,
        object_feedback,
      });

      await disinfectantData.save();
      //console.log("Automated Disinfectant data is:", disinfectantData);
      return res.status(201).json({
        success: true,
        message: "Automated Disinfectant data saved successfully.",
        data: disinfectantData,
      });
    }
  } catch (error) {
    //console.error("Error saving mapping data:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while saving mapping data.",
      error: error.message,
    });
  }
};

 
export const getAutomaticMapping = async (req, res) => {
  try {
    const data = await StartMappingData.find();
    return res.status(200).json({
      success: true,
      data: data.map((entry) => ({
        ...entry._doc,
        map_image: `data:image/png;base64,${entry.map_image}`,  
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching start mapping data.",
      error: error.message,
    });
  }
};

export const getManualMapping = async (req, res) => {
  try {
    const data = await History.find();
    return res.status(200).json({
      success: true,
      data: data.map((entry) => ({
        ...entry._doc,
        image: `data:image/png;base64,${entry.image}`,  
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching history data.",
      error: error.message,
    });
  }
};


export const getAutomaticDisinfectMapping = async (req, res) => {
  try {
    const data = await AutomatedDisinfectantData.find();
    return res.status(200).json({
      success: true,
      data: data.map((entry) => ({
        ...entry._doc,
        map_image: `data:image/png;base64,${entry.map_image}`,  
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching automated disinfectant data.",
      error: error.message,
    });
  }
};
