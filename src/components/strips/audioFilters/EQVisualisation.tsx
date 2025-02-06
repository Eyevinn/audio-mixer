import React, { useEffect, useRef } from 'react';

interface EQBand {
  type: string;
  freq: number;
  gain: number;
  q: number;
}

interface EQVisualisationProps {
  bands: {
    band0: EQBand;
    band1: EQBand;
    band2: EQBand;
    band3: EQBand;
    band4: EQBand;
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

export const EQVisualisation: React.FC<EQVisualisationProps> = ({
  bands,
  lowPass,
  highPass
}) => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dbGain: number
  ) => {
    if (type === 'none') return;

    const w0 = (2 * Math.PI * f0) / sampleRate;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const alpha = Math.sin(w0) / (2 * Q);

    for (let i = 0; i < freqArray.length; i++) {
      // const freq = freqArray[i];
      // const w = (2 * Math.PI * freq) / sampleRate;
      const magnitude = 0;

      // Calculate magnitude based on filter type
      switch (type) {
        case 'peak':
          // Add peak filter calculation
          break;
        case 'low_pass':
          // Add low pass filter calculation
          break;
        // Add other filter type calculations
      }

      magDbArray[i] += magnitude;
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frequencies = calculateFrequencies();
    const frequencyResponse = new Float32Array(width);

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
  };

  useEffect(() => {
    draw();
  }, [bands, lowPass, highPass]);

  return (
    <div className="relative h-[228px] w-[583px] bg-strip-bg">
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
