import StartMappingData from "../Models/startMapping.js";
import { Buffer } from "buffer";
import mongoose from 'mongoose';
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

    console.log("request body:", req.body);

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
    const imageBase64 = Buffer.from(map_image, "base64").toString("base64");
    console.log("base64:", imageBase64);

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
    console.log("saved in backend:", startMappingData);

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

export const getListMaps = async (req, res) => {
  try {
    const { userId, robotId } = req.query;
    //console.log("user request query is:", req.query);

    const query = {};
    if (userId) {
      
      if (mongoose.Types.ObjectId.isValid(userId)) {
        query.userId = new mongoose.Types.ObjectId(userId);
      } else {
       
        query.userId = userId;
      }
    }
    if (robotId) query.robotId = robotId;
    
    //console.log("query is", query);

    const mappingData = await StartMappingData.find(query).exec();
    //console.log("mapping data,", mappingData);

    if (!mappingData || mappingData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No mapping data found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: mappingData,
    });
  } catch (error) {
    //console.error("Error retrieving mapping data:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving mapping data.",
      error: error.message,
    });
  }
};