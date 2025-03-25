import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { TAudioStrip, TMixStrip, TOutput } from '../types/types';
import logger from '../utils/logger';

interface GlobalStateContextType {
  strips: TAudioStrip[];
  mixes: TMixStrip[];
  outputs: { [key: string]: TOutput };
  errorMessage: string;
  setStrips: React.Dispatch<React.SetStateAction<TAudioStrip[]>>;
  setMixes: React.Dispatch<React.SetStateAction<TMixStrip[]>>;
  setOutputs: React.Dispatch<React.SetStateAction<{ [key: string]: TOutput }>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

export const GlobalStateProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [strips, setStrips] = useState<TAudioStrip[]>([]);
  const [mixes, setMixes] = useState<TMixStrip[]>([]);
  const [outputs, setOutputs] = useState<{ [key: string]: TOutput }>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  return (
    <GlobalStateContext.Provider
      value={{
        strips,
        mixes,
        outputs,
        errorMessage,
        setStrips,
        setMixes,
        setOutputs,
        setErrorMessage
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error(
      'useGlobalContext must be used within a GlobalStateProvider'
    );
  }
  return context;
};
