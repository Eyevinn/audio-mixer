import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState
} from 'react';
import { TAudioStrip, TMixStrip } from '../types/types';

// TODO: Update to real output type
interface Output {
  [outputName: string]: {
    input: {
      index: number;
      origin: 'pre_fader' | 'post_fader';
      source: 'strip' | 'mix';
    };
    label: string;
    meters: {
      enable_ebu_meters: boolean;
    };
  };
}

interface GlobalStateContextType {
  savedStrips: TAudioStrip[];
  savedMixes: TMixStrip[];
  savedOutputs: Output[];
  errorMessage: string;
  setSavedStrips: React.Dispatch<React.SetStateAction<TAudioStrip[]>>;
  setSavedMixes: React.Dispatch<React.SetStateAction<TMixStrip[]>>;
  setSavedOutputs: React.Dispatch<React.SetStateAction<Output[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

export const GlobalStateProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [savedStrips, setSavedStrips] = useState<TAudioStrip[]>([]);
  const [savedMixes, setSavedMixes] = useState<TMixStrip[]>([]);
  const [savedOutputs, setSavedOutputs] = useState<Output[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  return (
    <GlobalStateContext.Provider
      value={{
        savedStrips,
        savedMixes,
        savedOutputs,
        errorMessage,
        setSavedStrips,
        setSavedMixes,
        setSavedOutputs,
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
