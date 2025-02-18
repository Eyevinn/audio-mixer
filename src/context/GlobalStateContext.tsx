import React from 'react';
import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { TAudioStrip, TMixStrip } from '../types/types';

interface GlobalStateContextType {
  strips: string[];
  savedStrips: TAudioStrip[];
  setSavedStrips: React.Dispatch<React.SetStateAction<TAudioStrip[]>>;
  savedMixes: TMixStrip[];
  setSavedMixes: React.Dispatch<React.SetStateAction<TMixStrip[]>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

export const GlobalStateProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [savedStrips, setSavedStrips] = useState<TAudioStrip[]>([]);
  const [savedMixes, setSavedMixes] = useState<TMixStrip[]>([]);
  return (
    <GlobalStateContext.Provider
      value={{
        strips: ['Hejj S&L'],
        savedStrips,
        savedMixes,
        setSavedStrips,
        setSavedMixes
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
