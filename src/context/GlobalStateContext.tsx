import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState
} from 'react';
import { Output, TAudioStrip, TMixStrip } from '../types/types';

interface GlobalStateContextType {
  savedStrips: TAudioStrip[];
  savedMixes: TMixStrip[];
  savedOutputs: { [key: string]: Output };
  errorMessage: string;
  setSavedStrips: React.Dispatch<React.SetStateAction<TAudioStrip[]>>;
  setSavedMixes: React.Dispatch<React.SetStateAction<TMixStrip[]>>;
  setSavedOutputs: React.Dispatch<
    React.SetStateAction<{ [key: string]: Output }>
  >;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

export const GlobalStateProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [savedStrips, setSavedStrips] = useState<TAudioStrip[]>([]);
  const [savedMixes, setSavedMixes] = useState<TMixStrip[]>([]);
  const [savedOutputs, setSavedOutputs] = useState<{ [key: string]: Output }>(
    {}
  );
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
