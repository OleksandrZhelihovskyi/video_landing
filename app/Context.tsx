"use client";
import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect,
} from "react";
import { AnalysisSocketState } from "./interfaces";

export interface ContextInterface {
  activeStep: number;
  q: {
    active: number;
    waiting: number;
    max_concurrent: number;
    max_waiting: number;
    analysis?: AnalysisSocketState;
  };
  image?: string;
}

export interface AppContext {
  context: ContextInterface;
  setContext: Dispatch<SetStateAction<ContextInterface>>;
}

const DEFAULT_CONTEXT: ContextInterface = {
  activeStep: 0,
  q: {
    active: 0,
    waiting: 0,
    max_concurrent: 2,
    max_waiting: 3,
    analysis: { status: "idle" },
  },
};

const Context = createContext<AppContext | undefined>(undefined);

const getInitialContext = (): ContextInterface => {
  if (typeof window === "undefined") {
    return DEFAULT_CONTEXT;
  }

  const savedContext = localStorage.getItem("context");
  if (!savedContext) {
    return DEFAULT_CONTEXT;
  }

  try {
    const parsedContext = JSON.parse(savedContext);

    return {
      activeStep: parsedContext.activeStep ?? 0,
      q: {
        active: parsedContext.q?.active ?? 0,
        waiting: parsedContext.q?.waiting ?? 0,
        max_concurrent: parsedContext.q?.max_concurrent ?? 2,
        max_waiting: parsedContext.q?.max_waiting ?? 3,
        analysis: parsedContext.q?.analysis ?? { status: "idle" },
      },
      image: parsedContext.image ?? undefined,
    };
  } catch {
    localStorage.removeItem("context");
    return DEFAULT_CONTEXT;
  }
};

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [context, setContext] = useState(() => getInitialContext());

  useEffect(() => {
    localStorage.setItem("context", JSON.stringify(context));
  }, [context]);

  return (
    <Context.Provider
      value={{
        context,
        setContext,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
