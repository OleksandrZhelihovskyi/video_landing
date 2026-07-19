import axios from "axios";

type AnalysisStats = {
  frames_processed?: number;
  vehicles_measured?: number;
  line1_crossings?: number;
  line2_crossings?: number;
  max_tracked_at_once?: number;
  speeds_kmh?: number[];
  avg_speed_kmh?: number;
  min_speed_kmh?: number;
  max_speed_kmh?: number;
};

export type AnalyzeVideoResponse = {
  videoUrl: string;
  stats: AnalysisStats | null;
};

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

export const analyzeVideo = async (
  videoFile: File,
  line1: number,
  line2: number,
  distance: number,
  night: boolean,
  calibrationMode: "vertical" | "horizontal",
): Promise<AnalyzeVideoResponse> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("line1", line1.toString());
  formData.append("line2", line2.toString());
  formData.append("distance", distance.toString());
  console.log("Night mode:", night);
  if (night) {
    formData.append("night", "true");
  }
  if (calibrationMode === "vertical") {
    formData.append("vertical", "true");
  } else {
    formData.append("vertical", "false");
  }

  const response = await axios.post(`${apiUrl}/api/analyze`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    responseType: "blob",
  });

  const contentType = String(
    response.headers["content-type"] ?? "",
  ).toLowerCase();
  if (!contentType.startsWith("video/")) {
    let backendError = "Analyze endpoint did not return video";

    try {
      const payload = JSON.parse(await (response.data as Blob).text()) as {
        error?: string;
      };
      if (payload.error) {
        backendError = payload.error;
      }
    } catch {
      // Keep generic error message if payload is not valid JSON.
    }

    throw new Error(backendError);
  }

  const statsHeader = response.headers["x-analysis-stats"];
  let stats: AnalysisStats | null = null;

  if (typeof statsHeader === "string") {
    try {
      stats = JSON.parse(statsHeader) as AnalysisStats;
    } catch {
      stats = null;
    }
  }
  return {
    videoUrl: URL.createObjectURL(
      new Blob([response.data], { type: contentType || "video/mp4" }),
    ),
    stats,
  };
};
