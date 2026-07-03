"use client";
import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

export interface ContextInterface {
  activeStep: number;
}

export interface AppContext {
  context: {
    activeStep: number;
  };
  setContext: (context: ContextInterface) => void;
}

const Context = createContext<AppContext | undefined>(undefined);

const getInitialContext = () => {
  if (typeof window === "undefined") {
    return { activeStep: 0 };
  }

  const savedContext = localStorage.getItem("context");
  if (!savedContext) {
    return { activeStep: 0 };
  }
  const parsedContext = JSON.parse(savedContext);

  return {
    activeStep: parsedContext.activeStep ?? 0,
  };
};

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [context, setContext] = useState(() => getInitialContext());
  const setNewContext = (context: ContextInterface) => {
    localStorage.setItem("context", JSON.stringify(context));
    setContext(context);
  };
  return (
    <Context.Provider value={{ context, setContext: setNewContext }}>
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
