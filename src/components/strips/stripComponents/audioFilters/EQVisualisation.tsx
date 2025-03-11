import React, { useCallback, useEffect, useRef } from 'react';

interface EQVisualisationProps {
  bands: {
    [key: string]: {
      type: string;
      freq: number;
      q: number;
      gain: number;
    };
  };
  lowPass: {
    freq: number;
    q: number;
  };
  highPass: {
    freq: number;
    q: number;
  };
}

export const EQVisualisation = ({
  bands,
  lowPass,
  highPass
}: EQVisualisationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const height = 228;
  const width = 583;
  const sampleRate = 48000;

  const calculateFrequencies = (): Float32Array => {
    const frequencies = new Float32Array(width);
    const nyquist = sampleRate / 2;
    const minLog = Math.log10(20);
    const maxLog = Math.log10(nyquist);

    for (let x = 0; x < frequencies.length; x++) {
      const log = minLog + (x / frequencies.length) * (maxLog - minLog);
      frequencies[x] = Math.pow(10, log);
    }
    return frequencies;
  };

  const addFreqResponse = (
    freqArray: Float32Array,
    magDbArray: Float32Array,
    type: string,
    f0: number,
    Q: number,
    dbGain: number
  ) => {
    if (type === 'none') return;

    const f_s = 48000.0;
    const A = Math.pow(10, dbGain / 40);
    const w_0 = (2 * Math.PI * f0) / f_s;
    const alpha = Math.sin(w_0) / (2 * Q);

    let coeffs = {
      b0: 0,
      b1: 0,
      b2: 0,
      a0: 0,
      a1: 0,
      a2: 0
    };

    // Calculate filter coefficients based on type
    switch (type) {
      case 'peak':
        coeffs = {
          b0: 1 + alpha * A,
          b1: -2 * Math.cos(w_0),
          b2: 1 - alpha * A,
          a0: 1 + alpha / A,
          a1: -2 * Math.cos(w_0),
          a2: 1 - alpha / A
        };
        break;

      case 'notch':
        coeffs = {
          b0: 1,
          b1: -2 * Math.cos(w_0),
          b2: 1,
          a0: 1 + alpha,
          a1: -2 * Math.cos(w_0),
          a2: 1 - alpha
        };
        break;

      case 'low_shelf':
        coeffs = {
          b0: A * (A + 1 - (A - 1) * Math.cos(w_0) + 2 * Math.sqrt(A) * alpha),
          b1: 2 * A * (A - 1 - (A + 1) * Math.cos(w_0)),
          b2: A * (A + 1 - (A - 1) * Math.cos(w_0) - 2 * Math.sqrt(A) * alpha),
          a0: A + 1 + (A - 1) * Math.cos(w_0) + 2 * Math.sqrt(A) * alpha,
          a1: -2 * (A - 1 + (A + 1) * Math.cos(w_0)),
          a2: A + 1 + (A - 1) * Math.cos(w_0) - 2 * Math.sqrt(A) * alpha
        };
        break;

      case 'high_shelf':
        coeffs = {
          b0: A * (A + 1 + (A - 1) * Math.cos(w_0) + 2 * Math.sqrt(A) * alpha),
          b1: -2 * A * (A - 1 + (A + 1) * Math.cos(w_0)),
          b2: A * (A + 1 + (A - 1) * Math.cos(w_0) - 2 * Math.sqrt(A) * alpha),
          a0: A + 1 - (A - 1) * Math.cos(w_0) + 2 * Math.sqrt(A) * alpha,
          a1: 2 * (A - 1 - (A + 1) * Math.cos(w_0)),
          a2: A + 1 - (A - 1) * Math.cos(w_0) - 2 * Math.sqrt(A) * alpha
        };
        break;

      case 'low_pass':
        coeffs = {
          b0: (1 - Math.cos(w_0)) / 2,
          b1: 1 - Math.cos(w_0),
          b2: (1 - Math.cos(w_0)) / 2,
          a0: 1 + alpha,
          a1: -2 * Math.cos(w_0),
          a2: 1 - alpha
        };
        break;

      case 'high_pass':
        coeffs = {
          b0: (1 + Math.cos(w_0)) / 2,
          b1: -1 - Math.cos(w_0),
          b2: (1 + Math.cos(w_0)) / 2,
          a0: 1 + alpha,
          a1: -2 * Math.cos(w_0),
          a2: 1 - alpha
        };
        break;

      case 'band_pass':
        coeffs = {
          b0: alpha,
          b1: 0,
          b2: -alpha,
          a0: 1 + alpha,
          a1: -2 * Math.cos(w_0),
          a2: 1 - alpha
        };
        break;
    }

    // Calculate frequency response
    for (let i = 0; i < freqArray.length; i++) {
      const f = freqArray[i];
      const phi = Math.pow(Math.sin((Math.PI * f) / f_s), 2);

      const num =
        Math.pow(coeffs.b0 + coeffs.b1 + coeffs.b2, 2) -
        4 *
          (coeffs.b0 * coeffs.b1 +
            4 * coeffs.b0 * coeffs.b2 +
            coeffs.b1 * coeffs.b2) *
          phi +
        16 * coeffs.b0 * coeffs.b2 * Math.pow(phi, 2);

      const den =
        Math.pow(coeffs.a0 + coeffs.a1 + coeffs.a2, 2) -
        4 *
          (coeffs.a0 * coeffs.a1 +
            4 * coeffs.a0 * coeffs.a2 +
            coeffs.a1 * coeffs.a2) *
          phi +
        16 * coeffs.a0 * coeffs.a2 * Math.pow(phi, 2);

      const mag = 10 * (Math.log10(num) - Math.log10(den));
      magDbArray[i] += mag;
    }
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frequencies = calculateFrequencies();
    const frequencyResponse = new Float32Array(width).fill(0);

    // Add frequency response for each band
    Object.values(bands).forEach((band) => {
      addFreqResponse(
        frequencies,
        frequencyResponse,
        band.type,
        band.freq,
        band.q,
        band.gain
      );
    });

    // Add low pass and high pass responses
    if (lowPass.freq < 20000) {
      addFreqResponse(
        frequencies,
        frequencyResponse,
        'low_pass',
        lowPass.freq,
        lowPass.q,
        0
      );
    }
    if (highPass.freq > 20) {
      addFreqResponse(
        frequencies,
        frequencyResponse,
        'high_pass',
        highPass.freq,
        highPass.q,
        0
      );
    }

    // Draw the response
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const maxDb = 15;
    const minDb = -maxDb;

    for (let x = 0; x < frequencyResponse.length; x++) {
      const db = frequencyResponse[x];
      const y = height - ((db - minDb) / (maxDb - minDb)) * height;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;

    // Frequency grid lines
    [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].forEach((freq) => {
      const x = (Math.log10(freq / 20) / Math.log10(20000 / 20)) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    });

    // dB grid lines
    [-12, -6, 0, 6, 12].forEach((db) => {
      const y = height - ((db - minDb) / (maxDb - minDb)) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    });
  }, [bands, lowPass, highPass]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative h-[228px] w-[583px] bg-grid-bg">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Add frequency grid lines */}
        {/* Add dB grid lines */}
      </svg>
      <canvas
        ref={canvasRef}
        height={height}
        width={width}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};
