import StartMappingData from "../Models/Mapping.js";
import mongoose from "mongoose";
import { Buffer } from "buffer";

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

export const startMapping = async (req, res) => {
  try {
    const { userId } = req.query;

    return res.status(200).json({
      success: true,
      message: "Mapping started successfully.",
      userId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while starting the mapping process.",
      error: error.message,
    });
  }
};

export const saveMappingData = async (req, res) => {
  try {
    const {
      userId,
      robotId,
      mode,
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
    } = req.body;

    if (!robotId || !ROBOT_IDS.includes(robotId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing robotId.",
      });
    }

    if (
      !userId ||
      !mode ||
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
        message:
          "Missing required fields or invalid data types. Ensure all fields are provided and contain valid data.",
      });
    }

    if (
      !Array.isArray(linear_velocity) ||
      !linear_velocity.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "x" in item &&
          "y" in item &&
          "z" in item
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "linear_velocity should be an array of objects with x, y, z properties.",
      });
    }

    if (
      !Array.isArray(angular_velocity) ||
      !angular_velocity.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "x" in item &&
          "y" in item &&
          "z" in item
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "angular_velocity should be an array of objects with x, y, z properties.",
      });
    }

    if (
      !Array.isArray(current_position) ||
      !current_position.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "x" in item &&
          "y" in item &&
          "z" in item
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "current_position should be an array of objects with x, y, z properties.",
      });
    }

    if (
      !Array.isArray(current_orientation) ||
      !current_orientation.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "x" in item &&
          "y" in item &&
          "z" in item &&
          "w" in item
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "current_orientation should be an array of objects with x, y, z, w properties.",
      });
    }

    // Decode base64 image
    const imageBase64 = Buffer.from(map_image, "base64").toString("base64");

    const startMappingData = new StartMappingData({
      userId,
      robotId,
      mode,
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
      message: "Mapping data saved successfully.",
      data: startMappingData,
    });
  } catch (error) {
    console.error("Error saving mapping data:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while saving mapping data.",
      error: error.message,
    });
  }
};

// export const getListMaps = async (req, res) => {
//   try {
//     const { userId } = req.query;
//     console.log("user request query is:", req.query);

//     const query = {};
//     if (userId) {
//       if (mongoose.Types.ObjectId.isValid(userId)) {
//         query.userId = new mongoose.Types.ObjectId(userId);
//       } else {
//         query.userId = userId;
//       }
//     }
//     if (robotId) query.robotId = robotId;

//     console.log("query is", query);

//     const mappingData = await StartMappingData.find(query).exec();
//     console.log("mapping data,", mappingData);

//     if (!mappingData || mappingData.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No mapping data found.",
//       });
//     }
//     const MappingData = mappingData.map((data) => {
//       return {
//         ...data._doc,
//         map_image: `data:image/png;base64,${data.map_image}`,
//       };
//     });
//     return res.status(200).json({
//       success: true,
//       data: MappingData,
//     });
//   } catch (error) {
//     console.error("Error retrieving mapping data:", error.message);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while retrieving mapping data.",
//       error: error.message,
//     });
//   }
// };



export const getListMaps = async (req, res) => {
  try {
    const { robotId } = req.query;
    console.log("User request query is:", req.query);
    if (robotId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: robotId.",
      });
    }
    // Validate the robotId if it exists
    if (robotId && typeof robotId !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Invalid robotId format.",
      });
    }

    const query = {};

    // If robotId exists, add it to the query
    if (robotId) {
      query.robotId = robotId;
    }

    console.log("Query is", query);

    // Fetching the mapping data based on the modified query
    const mappingData = await StartMappingData.find(query).exec();
    console.log("Mapping data:", mappingData);

    if (!mappingData || mappingData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No mapping data found.",
      });
    }

    // Formatting the mapping data and preparing the response
    const formattedMappingData = mappingData.map((data) => {
      return {
        ...data._doc,
        map_image: `data:image/png;base64,${data.map_image}`,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedMappingData,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error retrieving mapping data:", error);

    // Differentiate between different error types
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided.",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving mapping data.",
      error: error.message,
    });
  }
};



export const getMapNames = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId parameter.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId format.",
      });
    }

    const uniqueMapNames = await StartMappingData.find(
      { userId: new mongoose.Types.ObjectId(userId) },
      { map_name: 1, _id: 0 }
    );

    return res.status(200).json({
      success: true,
      mapName: uniqueMapNames,
    });
  } catch (error) {
    console.error("Error retrieving unique map names:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving unique map names.",
      error: error.message,
    });
  }
};
