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

export interface Compressor {
  attack: number;
  gain: number;
  knee: number;
  ratio: number;
  release: number;
  threshold: number;
}

export interface Filters {
  compressor: Compressor;
  eq: {
    bands: {
      frequency: number;
      gain: number;
      q: number;
      type:
        | 'none'
        | 'low_pass'
        | 'high_pass'
        | 'band_pass'
        | 'low_shelf'
        | 'high_shelf'
        | 'peak'
        | 'notch';
    }[];
  };
  gain: {
    value: number;
  };
  mid_side: {
    enabled: boolean;
    // left right stereo or mid side stereo, mono input will always be bypassed
    input_format: 'lr_stereo' | 'ms_stereo';
    invert_polarity: boolean;
    mid_amount: number;
    side_amount: number;
  };
  pan: {
    value: number;
  };
}

export interface Compressor {
  attack: number;
  gain: number;
  knee: number;
  ratio: number;
  release: number;
  threshold: number;
}

export interface Filters {
  compressor: Compressor;
  eq: {
    bands: {
      frequency: number;
      gain: number;
      q: number;
      type:
        | 'none'
        | 'low_pass'
        | 'high_pass'
        | 'band_pass'
        | 'low_shelf'
        | 'high_shelf'
        | 'peak'
        | 'notch';
    }[];
  };
  gain: {
    value: number;
  };
  mid_side: {
    enabled: boolean;
    // left right stereo or mid side stereo, mono input will always be bypassed
    input_format: 'lr_stereo' | 'ms_stereo';
    invert_polarity: boolean;
    mid_amount: number;
    side_amount: number;
  };
  pan: {
    value: number;
  };
}

interface TBaseStrip {
  [key: string]: unknown;
  stripId: number;
  label: string;
  selected: boolean;
  pfl: boolean;
  fader: {
    muted: boolean;
    volume: number;
  };
  filters: Filters;
  input_meter: {
    peak?: number;
    peak_left?: number;
    peak_right?: number;
  };
  post_fader_meter: {
    peak_left: number;
    peak_right: number;
  };
  pre_fader_meter: {
    peak_left: number;
    peak_right: number;
  };
}

export interface TAudioStrip extends TBaseStrip {
  input: {
    first_channel: number;
    input_slot: number;
    is_stereo: boolean;
    second_channel: number;
  };
}

export interface TMixStrip extends TBaseStrip {
  inputs: {
    mixes: {
      stripId: number;
      muted: boolean;
      volume: number;
      origin: 'pre_fader' | 'post_fader';
    }[];
    strips: {
      stripId: number;
      muted: boolean;
      volume: number;
      origin: 'pre_fader' | 'post_fader';
    }[];
  };
}
