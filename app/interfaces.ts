export type UploadFormValues = {
  video: FileList;
  calibrationMode: CalibrationMode;
  line1: number;
  line2: number;
  distance: number;
  night: boolean;
};

export type CalibrationMode = "vertical" | "horizontal";

export type CalibrationVariables = {
  videoFile: File;
  calibrationMode: CalibrationMode;
};

export type AnalyzeVariables = {
  videoFile: File;
  line1: number;
  line2: number;
  distance: number;
  night: boolean;
  calibrationMode: CalibrationMode;
};

export type AnalysisSocketState = {
  status?: "idle" | "running" | "completed" | "failed" | string;
  message?: string;
  progress_percent?: number;
  frame?: number;
  total_frames?: number;
};

export type QueueSocketState = {
  active: number;
  waiting: number;
  max_concurrent: number;
  max_waiting: number;
  updated_at?: number;
  analysis?: AnalysisSocketState;
  queue?: Partial<
    Pick<
      QueueSocketState,
      "active" | "waiting" | "max_concurrent" | "max_waiting"
    >
  >;
};