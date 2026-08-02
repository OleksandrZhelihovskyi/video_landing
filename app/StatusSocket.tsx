import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { QueueSocketState } from "./interfaces";
import { Context } from "./Context";

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
};

const toNumberOr = (value: unknown, fallback: number): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return fallback;
};

const mergeQueueSnapshot = (
  prev: QueueSocketState,
  payload: unknown,
): QueueSocketState => {
  const source = asRecord(payload);
  if (!source) {
    return prev;
  }

  const queueSource = asRecord(source.queue);

  return {
    ...prev,
    active: toNumberOr(source.active ?? queueSource?.active, prev.active),
    waiting: toNumberOr(source.waiting ?? queueSource?.waiting, prev.waiting),
    max_concurrent: toNumberOr(
      source.max_concurrent ?? queueSource?.max_concurrent,
      prev.max_concurrent,
    ),
    max_waiting: toNumberOr(
      source.max_waiting ?? queueSource?.max_waiting,
      prev.max_waiting,
    ),
    updated_at: toNumberOr(source.updated_at, prev.updated_at ?? 0),

    analysis: {
      ...(prev.analysis || {}),
      ...(asRecord(source.analysis) || {}),
    },
  };
};

const mergeAnalyzeProgress = (
  prev: QueueSocketState,
  payload: unknown,
): QueueSocketState => {
  const source = asRecord(payload);
  if (!source) {
    return prev;
  }

  return {
    ...prev,
    analysis: {
      ...(prev.analysis || {}),
      ...source,
    },
  };
};

export const StatusSocket: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isOpen, setIsOpen }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const contextData = useContext(Context);
  if (!contextData) {
    throw new Error("Context is not available");
  }
  const { context, setContext } = contextData;
  const { q } = context;

  useEffect(() => {
    const socketBaseUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    ).replace(/\/api\/?$/, "");

    const s = io(`${socketBaseUrl}/ws/status`, {
      path: "/socket.io",
      transports: ["websocket", "polling"], // only polling
      rememberUpgrade: false, // disable ws upgrade memory
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    const requestSnapshot = () => {
      s.emit("get_queue_status");
    };

    s.on("connect", () => {
      setSocketConnected(true);
      requestSnapshot();
    });

    s.on("reconnect", () => {
      setSocketConnected(true);
      requestSnapshot();
    });

    s.on("disconnect", () => {
      setSocketConnected(false);
    });

    s.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
      setSocketConnected(false);
    });

    s.on("queue_status", (payload) => {
      setContext((prev) => ({
        ...prev,
        q: mergeQueueSnapshot(prev.q, payload),
      }));
    });

    s.on("dashboard_status", (payload) => {
      setContext((prev) => ({
        ...prev,
        q: mergeQueueSnapshot(prev.q, payload),
      }));
    });

    s.on("analyze_progress", (payload) => {
      setContext((prev) => ({
        ...prev,
        q: mergeAnalyzeProgress(prev.q, payload),
      }));
    });

    return () => {
      s.off("queue_status");
      s.off("dashboard_status");
      s.off("analyze_progress");
      s.off("connect");
      s.off("reconnect");
      s.off("disconnect");
      s.off("connect_error");
      s.disconnect();
    };
  }, [setContext]);
  return (
    <div className="fixed right-3 top-3 z-50 flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-slate-950/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-200 shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-amber-300/70 hover:bg-slate-900/90"
        aria-expanded={isOpen}
        aria-controls="queue-status-panel"
      >
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            socketConnected ? "bg-emerald-300" : "bg-red-300",
          ].join(" ")}
        />
        Status
      </button>

      {isOpen && (
        <aside
          id="queue-status-panel"
          className="pointer-events-auto w-[min(260px,calc(100vw-1.5rem))] rounded-xl border border-white/15 bg-slate-950/88 p-2.5 text-white shadow-[0_16px_34px_rgba(0,0,0,0.4)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-amber-300">
              Queue status
            </p>
            <span
              className={[
                "inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.08em]",
                socketConnected ? "text-emerald-300" : "text-red-300",
              ].join(" ")}
            >
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  socketConnected ? "bg-emerald-300" : "bg-red-300",
                ].join(" ")}
              />
              {socketConnected ? "Live" : "Offline"}
            </span>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <p className="text-[8px] uppercase tracking-[0.12em] text-white/55">
                Active
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {q.active}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <p className="text-[8px] uppercase tracking-[0.12em] text-white/55">
                Waiting
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {q.waiting}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <p className="text-[8px] uppercase tracking-[0.12em] text-white/55">
                Max conc.
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {q.max_concurrent}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <p className="text-[8px] uppercase tracking-[0.12em] text-white/55">
                Max wait
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {q.max_waiting}
              </p>
            </div>
          </div>

          {q.analysis && (
            <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <p className="text-[8px] uppercase tracking-[0.12em] text-white/55">
                Analysis
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-white">
                {q.analysis.status || "idle"}
                {typeof q.analysis.progress_percent === "number"
                  ? ` · ${Math.round(q.analysis.progress_percent)}%`
                  : ""}
              </p>
              {typeof q.analysis.frame === "number" &&
                typeof q.analysis.total_frames === "number" && (
                  <p className="text-[10px] text-white/60">
                    {q.analysis.frame}/{q.analysis.total_frames} frames
                  </p>
                )}
              {q.analysis.message && (
                <p className="text-[10px] text-white/60">
                  {q.analysis.message}
                </p>
              )}
            </div>
          )}
        </aside>
      )}
    </div>
  );
};
