"use client";

import { MouseEvent, useContext, useEffect, useState } from "react";
import { Context } from "./Context";
import { Stepper } from "react-form-stepper";
import { useForm } from "react-hook-form";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMutation } from "@tanstack/react-query";
import { calibrateVideo } from "./api";

type UploadFormValues = {
  video: FileList;
  calibrationMode: CalibrationMode;
};

type CalibrationMode = "vertical" | "horizontal";

type CalibrationVariables = {
  videoFile: File;
  calibrationMode: CalibrationMode;
};

const ZOOM_SCALE = 3;
const LENS_SIZE = 276;

const CustomStepper = () => {
  const contextData = useContext(Context);

  if (!contextData) {
    throw new Error("Context is not available");
  }

  const { context, setContext } = contextData;
  const { activeStep } = context;
  const [image, setImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UploadFormValues>();

  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  useEffect(() => {
    setSelectedVideo(watch("video")?.[0] ?? null);
  }, [watch("video")?.[0]]);
  const calibrationMode = watch("calibrationMode") ?? "vertical";

  const submit = (data: UploadFormValues) => {
    console.log("Form submitted with data:", data);
    setContext({
      ...context,
      activeStep: 1,
    });
  };

  const goToUploadStep = () => {
    setContext({
      ...context,
      activeStep: 0,
    });
    setSelectedVideo(null);
  };

  const runCalibration = () => {
    if (!selectedVideo) {
      return;
    }

    calibrate.mutate({
      videoFile: selectedVideo,
      calibrationMode,
    });
  };

  const handleZoomMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    setZoomPosition({
      x: Math.min(bounds.width, Math.max(0, x)),
      y: Math.min(bounds.height, Math.max(0, y)),
      width: bounds.width,
      height: bounds.height,
    });
  };

  const calibrate = useMutation({
    mutationFn: ({ videoFile, calibrationMode }: CalibrationVariables) =>
      calibrateVideo(videoFile, calibrationMode),
    onError: (error) => {
      console.error("Calibration failed:", error);
    },
    onSuccess: (data) => {
      console.log("Calibration successful:", data);
      setImage(data.preview_image);
      setContext({
        ...context,
        activeStep: 2,
      });
    },
  });

  return (
    <>
      <Stepper
        className="animate-fade-in-up delay-100 text-white"
        steps={[
          { label: "Upload Video" },
          { label: "Calibration" },
          { label: "Get Speed Estimate" },
        ]}
        activeStep={activeStep}
      />

      {activeStep === 0 && (
        <form
          onSubmit={handleSubmit(submit)}
          className="mx-auto mt-8 w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm"
        >
          <div className="border-b border-white/10 bg-gradient-to-r from-amber-400/12 via-transparent to-transparent px-6 py-5 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
              Step 0{activeStep + 1}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Upload your accident footage
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
              Add the source video for analysis. MP4, MOV, AVI and other common
              formats are supported.
            </p>
          </div>

          <div className="space-y-5 px-6 py-6 md:px-8 md:py-8">
            <label
              htmlFor="video"
              className={[
                "group block cursor-pointer rounded-[24px] border border-dashed px-6 py-10 text-center transition-colors",
                errors.video
                  ? "border-red-400/70 bg-red-500/10"
                  : "border-white/15 bg-slate-950/50 hover:border-amber-300/70 hover:bg-amber-300/5",
              ].join(" ")}
            >
              <input
                id="video"
                type="file"
                accept="video/*"
                className="sr-only"
                {...register("video", { required: true })}
              />

              <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-2xl bg-amber-300 text-slate-950 shadow-[0_12px_30px_rgba(250,204,21,0.22)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-8 w-8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16V4m0 0-4 4m4-4 4 4M5 16v1a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-1"
                  />
                </svg>
              </div>

              <p className="mt-5 text-lg font-semibold text-white">
                {selectedVideo ? selectedVideo.name : "Choose a video file"}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Drag and drop here or click to browse your device.
              </p>
            </label>

            {errors.video && (
              <p className="rounded-2xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
                Video is required before continuing.
              </p>
            )}

            <div className="flex flex-col gap-4 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
              <p className="text-sm leading-6 text-white/50">
                Best results come from stable footage where the vehicle and road
                markings are clearly visible.
              </p>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-amber-300 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-amber-200"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      )}

      {(activeStep === 1 || activeStep === 2) && (
        <div className="mx-auto mt-8 w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="border-b border-white/10 bg-gradient-to-r from-amber-400/12 via-transparent to-transparent px-6 py-5 md:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
              Step 0{activeStep + 1}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              {activeStep === 1
                ? "Calibration step"
                : "Get speed estimate step"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
              {activeStep === 1
                ? "Calibrate the video to ensure accurate speed estimation. This step is crucial for reliable results."
                : "After calibration, proceed to get the speed estimate based on the calibrated video."}
            </p>
          </div>

          {activeStep === 1 && (
            <div className="px-6 pt-2 md:px-8">
              <div className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300/90">
                  Calibration mode
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="group block cursor-pointer">
                    <input
                      id="vertical"
                      type="radio"
                      value="vertical"
                      defaultChecked
                      className="peer sr-only"
                      {...register("calibrationMode")}
                    />
                    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-white transition-all duration-200 hover:border-amber-300/40 hover:bg-amber-300/5 peer-checked:border-amber-300/60 peer-checked:bg-amber-300/10">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors group-has-[:checked]:border-amber-300 group-has-[:checked]:bg-amber-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent transition-colors group-has-[:checked]:bg-slate-950" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold leading-5">
                          Vertical Calibration
                        </div>
                        <div className="mt-1 text-xs leading-5 text-white/55">
                          Best for upright reference lines.
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="group block cursor-pointer">
                    <input
                      id="horizontal"
                      type="radio"
                      value="horizontal"
                      className="peer sr-only"
                      {...register("calibrationMode")}
                    />
                    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-white transition-all duration-200 hover:border-amber-300/40 hover:bg-amber-300/5 peer-checked:border-amber-300/60 peer-checked:bg-amber-300/10">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors group-has-[:checked]:border-amber-300 group-has-[:checked]:bg-amber-300">
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent transition-colors group-has-[:checked]:bg-slate-950" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold leading-5">
                          Horizontal Calibration
                        </div>
                        <div className="mt-1 text-xs leading-5 text-white/55">
                          Use this for horizontal references.
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 pt-6 md:px-8">
            {image && activeStep === 2 && (
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="group relative block w-full overflow-hidden rounded-[20px] border border-white/10 bg-slate-950/40 text-left shadow-[0_18px_40px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:-translate-y-1"
              >
                <img
                  src={image || "/placeholder.png"}
                  alt="Calibration Preview"
                  className="w-full rounded-[20px]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 py-4 text-sm text-white">
                  <span className="font-medium">Calibration preview</span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-200 transition-colors group-hover:border-amber-300/40 group-hover:bg-amber-300/10">
                    Open fullscreen
                  </span>
                </div>
              </button>
            )}

            {calibrate.isPending && (
              <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-100 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
                <Spinner
                  animation="border"
                  size="sm"
                  variant="warning"
                  role="status"
                  aria-hidden="true"
                />
                <span>Calibrating video...</span>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-6 py-6 md:px-8 md:py-8">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                variant="outline-warning"
                disabled={calibrate.isPending}
                className="rounded-2xl border-amber-300/50 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em]"
                onClick={goToUploadStep}
              >
                Back
              </Button>
              <Button
                variant="warning"
                disabled={!selectedVideo || calibrate.isPending}
                className="rounded-2xl px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] shadow-[0_12px_24px_rgba(245,158,11,0.35)]"
                onClick={activeStep === 1 ? runCalibration : ()=>console.log(selectedVideo)}
              >
                {activeStep === 1 ? "Run Calibration" : "Get Speed Estimate"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={isPreviewOpen}
        onHide={() => setIsPreviewOpen(false)}
        centered
        size="xl"
        contentClassName="border border-white/10 bg-slate-950/95 text-white rounded-[28px] overflow-hidden"
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-white/10 bg-white/[0.03]"
        >
          <Modal.Title className="text-lg font-semibold text-white">
            Calibration Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-slate-950/95 p-3 md:p-5">
          {image && (
            <div className="space-y-4">
              <div
                className="relative overflow-hidden rounded-[20px] border border-white/10 bg-black/30"
                onMouseEnter={() => setIsZoomVisible(true)}
                onMouseLeave={() => setIsZoomVisible(false)}
                onMouseMove={handleZoomMove}
              >
                <img
                  src={image}
                  alt="Calibration Preview Fullscreen"
                  className="max-h-[80vh] w-full rounded-[20px] object-contain"
                />

                {isZoomVisible && (
                  <div
                    className="pointer-events-none absolute hidden h-44 w-44 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-amber-300/70 bg-slate-950 shadow-[0_0_0_3px_rgba(15,23,42,0.45),0_20px_45px_rgba(0,0,0,0.35)] md:block"
                    style={{
                      left: `${zoomPosition.x}px`,
                      top: `${zoomPosition.y}px`,
                      backgroundImage: `url(${image})`,
                      backgroundPosition: `${-zoomPosition.x * ZOOM_SCALE + LENS_SIZE / 2}px ${-zoomPosition.y * ZOOM_SCALE + LENS_SIZE / 2}px`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${zoomPosition.width * ZOOM_SCALE}px ${zoomPosition.height * ZOOM_SCALE}px`,
                    }}
                  />
                )}
              </div>

              <p className="text-sm text-white/55">
                Hover over the image to inspect details with 300% zoom.
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomStepper;
