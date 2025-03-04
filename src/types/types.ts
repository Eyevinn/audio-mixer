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

export interface TOutput {
  input: {
    index: number;
    origin: 'pre_fader' | 'post_fader';
    source: 'strip' | 'mix';
  };
  label: string;
  meters: {
    enable_ebu_meters: boolean;
    ebu_i: number;
    ebu_m: number;
    ebu_s: number;
    peak_left: number;
    peak_right: number;
  };
}

export interface TBaseStrip {
  [key: string]: unknown;
  stripId: number;
  label: string;
  selected?: boolean;
  pfl?: boolean;
  fader?: {
    muted: boolean;
    volume: number;
  };
  filters?: Filters;
  input_meter?: {
    peak?: number;
    peak_left?: number;
    peak_right?: number;
  };
  post_fader_meter?: {
    peak_left: number;
    peak_right: number;
  };
  pre_fader_meter?: {
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
      [id: number]: {
        muted: boolean;
        volume: number;
        origin: 'pre_fader' | 'post_fader';
      };
    };
    strips: {
      [id: number]: {
        muted: boolean;
        volume: number;
        origin: 'pre_fader' | 'post_fader';
      };
    };
  };
}

export interface AudioState {
  body: {
    mixes: { [key: string]: TMixStrip };
    strips: { [key: string]: TAudioStrip };
    outputs: { [key: string]: TOutput };
  };
}

export interface TOutputStrip
  extends Omit<
    TBaseStrip,
    'input_meter' | 'post_fader_meter' | 'pre_fader_meter'
  > {
  input: {
    index: number;
    origin: 'pre_fader' | 'post_fader';
    source: 'strip' | 'mix';
  };
  label: string;
  meters: {
    enable_ebu_meters: boolean;
    ebu_i: number;
    ebu_m: number;
    ebu_s: number;
    peak_left: number;
    peak_right: number;
  };
}
