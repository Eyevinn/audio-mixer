import { createContext, FC, ReactNode, useContext } from 'react';

interface GlobalStateContextType {
  strips: string[];
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

export const GlobalStateProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <GlobalStateContext.Provider value={{ strips: ['Hejj S&L'] }}>
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
