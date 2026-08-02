import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import type { Dispatch, MouseEvent } from "react";

const ZOOM_SCALE = 3;
const LENS_SIZE = 276;

export const PreviewModal: React.FC<{
  isPreviewOpen: boolean;
  setIsPreviewOpen: Dispatch<React.SetStateAction<boolean>>;
  image: string | undefined;
}> = ({ isPreviewOpen, setIsPreviewOpen, image }) => {
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
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
  return (
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
  );
};
