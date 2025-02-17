import React from 'react';
import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { AudioStrip } from '../types/types';

interface GlobalStateContextType {
  strips: string[];
  savedStrips: AudioStrip[];
  setSavedStrips: React.Dispatch<React.SetStateAction<AudioStrip[]>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

export const GlobalStateProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [savedStrips, setSavedStrips] = useState<AudioStrip[]>([]);
  return (
    <GlobalStateContext.Provider
      value={{ strips: ['Hejj S&L'], savedStrips, setSavedStrips }}
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
