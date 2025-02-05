export interface AudioStripProps {
  label: string;
  selected: boolean;
  slot: number;
  channel1: number;
  channel2: number;
  mode: 'mono' | 'stereo';
  panning: number;
  muted: boolean;
  pfl: boolean;
  volume: number;
  onLabelChange: (label: string) => void;
  onPanningChange: (panning: number) => void;
  onMuteChange: (muted: boolean) => void;
  onPflChange: (pfl: boolean) => void;
  onVolumeChange: (volume: number) => void;
}

export interface AudioLevelProps {
  isStereo: boolean;
  audioBarData?: {
    peak?: number;
    peak_left?: number;
    peak_right?: number;
  };
}

export interface EffectsPanelProps {
  label: string;
  stripId: number;
}

export interface Strip {
  id: number;
  label: string;
  selected: boolean;
  slot: number;
  channel1: number;
  channel2: number;
  mode: 'mono' | 'stereo';
  panning: number;
  muted: boolean;
  pfl: boolean;
  volume: number;
}
