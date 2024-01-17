import ICBASData from "@/interfaces/cbas/ICBASData";
import React, { ReactNode, useState } from "react";

interface CBASContextInterface {
  isError: boolean | null;
  errorMessage: string | null;
  errorHandler: (state: boolean, message: string | null) => void;
  cbasData: ICBASData | null;
  cbasDataHandler: (data: ICBASData) => void;
}

const CBASContext = React.createContext<CBASContextInterface>({
  isError: null,
  errorMessage: null,
  errorHandler: (state, message) => {},
  cbasData: null,
  cbasDataHandler: (data) => {},
});

export default CBASContext;

export const CBASContextProvider: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [isError, setIsError] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cbasData, setCbasData] = useState<ICBASData | null>(null);

  const errorHandler = (state: boolean, message: string | null) => {
    setIsError(state);
    setErrorMessage(message);
  };

  const cbasDataHandler = (data: ICBASData) => {
    setCbasData(data);
  };

  return (
    <CBASContext.Provider
      value={{
        isError,
        errorMessage,
        cbasData,
        errorHandler,
        cbasDataHandler,
      }}
    >
      {children}
    </CBASContext.Provider>
  );
};
