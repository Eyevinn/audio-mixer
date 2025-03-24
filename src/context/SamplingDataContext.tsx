import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState
} from 'react';

interface PreFaderMeters {
  peak_left: number;
  peak_right: number;
}

export interface StripsSamplingData {
  [key: string]: {
    pre_fader_meter: PreFaderMeters;
  };
}

interface OutputMeters extends PreFaderMeters {
  enable_ebu_meter: boolean;
  ebu_i: number;
  ebu_m: number;
  ebu_s: number;
}

export interface OutputSamplingData {
  [key: string]: {
    meters: OutputMeters;
  };
}

interface SamplingDataContextType {
  stripsSamplingData: StripsSamplingData;
  mixesSamplingData: StripsSamplingData;
  outputsSamplingData: OutputSamplingData;
  setStripsSamplingData: React.Dispatch<
    React.SetStateAction<StripsSamplingData>
  >;
  setMixesSamplingData: React.Dispatch<
    React.SetStateAction<StripsSamplingData>
  >;
  setOutputsSamplingData: React.Dispatch<
    React.SetStateAction<OutputSamplingData>
  >;
}

const SamplingDataContext = createContext<SamplingDataContextType | null>(null);

export const SamplingDataProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [stripsSamplingData, setStripsSamplingData] =
    useState<StripsSamplingData>({});
  const [mixesSamplingData, setMixesSamplingData] =
    useState<StripsSamplingData>({});
  const [outputsSamplingData, setOutputsSamplingData] =
    useState<OutputSamplingData>({});

  return (
    <SamplingDataContext.Provider
      value={{
        stripsSamplingData,
        mixesSamplingData,
        outputsSamplingData,
        setStripsSamplingData,
        setMixesSamplingData,
        setOutputsSamplingData
      }}
    >
      {children}
    </SamplingDataContext.Provider>
  );
};

export const useSamplingData = () => {
  const context = useContext(SamplingDataContext);
  if (!context) {
    throw new Error(
      'useSamplingData must be used within a SamplingDataProvider'
    );
  }
  return context;
};
