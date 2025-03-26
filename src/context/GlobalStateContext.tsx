/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState
} from 'react';
import { TAudioStrip, TMixStrip, TOutput } from '../types/types';
import { merge } from 'lodash';

interface GlobalStateContextType {
  strips: TAudioStrip[];
  mixes: TMixStrip[];
  outputs: { [key: string]: TOutput };
  errorMessage: string;
  setStrips: React.Dispatch<React.SetStateAction<TAudioStrip[]>>;
  setMixes: React.Dispatch<React.SetStateAction<TMixStrip[]>>;
  updateStrip: (type: 'strips' | 'mixes', id: number, object: any) => void;
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

  const updateState = (
    updateFunc: React.Dispatch<React.SetStateAction<any>>,
    id: number,
    object: any
  ) => {
    updateFunc((prevState: any) =>
      prevState.map((state: TAudioStrip | TMixStrip) => {
        if (state.stripId !== id) return state;
        return merge(state, object);
      })
    );
  };

  const updateStrip = (type: 'strips' | 'mixes', id: number, object: any) => {
    const updateFunc = type === 'strips' ? setStrips : setMixes;
    updateState(updateFunc, id, object);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        strips,
        mixes,
        outputs,
        errorMessage,
        setStrips,
        setMixes,
        updateStrip,
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
