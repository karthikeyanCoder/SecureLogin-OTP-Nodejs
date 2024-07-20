// src/Controllers/mapController.js
import MapData from  "../Models/Mapping.js"

export const startMapping = async (req, res) => {
  try {
    // Initiating the mapping process with the robot
    // Add logic to start the robot mapping process here
    return res.json({ message: "Mapping started successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const saveMappingData = async (req, res) => {
  try {
    const {
      mode,
      feedback,
      linear_velocity,
      angular_velocity,
      current_position,
      current_orientation,
      map_image,
      completion_command
    } = req.body;

    const mapData = new MapData({
      mode,
      feedback,
      linear_velocity,
      angular_velocity,
      current_position,
      current_orientation,
      map_image,
      completion_command
    });

    await mapData.save();

    return res.json({ message: "Mapping data saved successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


