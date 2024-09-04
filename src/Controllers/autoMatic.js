import AutomatedDisinfectantData from "../Models/automatedDisinfectant.js";
 

export const saveAutomatedDisinfectantData = async (req, res) => {
  try {
    const {
      userId,
      feedback,
      position,
      orientation,
       map_image,
      object_image_name, // like table or  human
      object_feedback,
    } = req.body;
     
    console.log("Request body:", req.body);
    

    if (
      !userId ||
      !feedback ||
      !position ||
      !orientation ||
      !map_image.length||
      !object_image_name ||
      !object_feedback
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or invalid data types for Automated Disinfectant mode.",
      });
    }

     

    const disinfectantData = new AutomatedDisinfectantData({
      userId,
      feedback,
      position,
      orientation,
      map_image,
      object_image_name,
      object_feedback,
    });

    await disinfectantData.save();
    console.log("Saved data:", disinfectantData);

    return res.status(201).json({
      success: true,
      message: "Automated Disinfectant data saved successfully.",
      data: disinfectantData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while saving Automated Disinfectant data.",
      error: error.message,
    });
  }
};
export const getAutomatedDisinfectantData = async (req, res) => {
    try {
      const disinfectantData = await AutomatedDisinfectantData.find();
  
      if (!disinfectantData) {
        return res.status(404).json({
          success: false,
          message: "Data not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: disinfectantData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          "An error occurred while retrieving Automated Disinfectant data.",
        error: error.message,
      });
    }
  };
  