import axios from "axios";

export const calibrateVideo = async (
  videoFile: File,
  calibrationMode: "vertical" | "horizontal",
) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append(
    "vertical",
    calibrationMode === "vertical" ? "true" : "false",
  ); // Add calibration parameter
  const response = await axios.post(`${apiUrl}/api/calibrate`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const getSpeedEstimate = async (videoFile: File, calibrationData: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("calibration_data", JSON.stringify(calibrationData));

  const response = await axios.post(`${apiUrl}/api/speed_estimate`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
