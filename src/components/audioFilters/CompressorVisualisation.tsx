import React, { useEffect, useRef } from 'react';

interface CompressorVisualisationProps {
  threshold: number;
  ratio: number;
  kneeWidth: number;
  makeUpGain: number;
}

export const CompressorVisualisation: React.FC<
  CompressorVisualisationProps
> = ({ threshold, ratio, kneeWidth, makeUpGain }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const height = 250;
  const width = 250;

  const calcGain = (x: number): number => {
    const T = threshold;
    const W = kneeWidth;
    const R = ratio;
    const M = makeUpGain;

    if (2 * (x - T) < -W) {
      return x + M;
    } else if (2 * Math.abs(x - T) <= W) {
      return x + ((1 / R - 1) * Math.pow(x - T + W / 2, 2)) / (2 * W) + M;
    } else {
      return T + (x - T) / R + M;
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
      const xGain = (x / width) * 40 - 40;
      const yGain = calcGain(xGain);
      const y = height - ((yGain + 40) / 40) * height;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [threshold, ratio, kneeWidth, makeUpGain]);

  return (
    <div className="relative h-[250px] w-[250px] bg-strip-bg">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 40 40"
        preserveAspectRatio="none"
      >
        {[0, 5, 10, 15, 20, 25, 30, 35, 40].map((pos) => (
          <React.Fragment key={pos}>
            <line
              className="stroke-[#333] stroke-[1px]"
              x1={pos}
              y1="0"
              x2={pos}
              y2="40"
              vectorEffect="non-scaling-stroke"
            />
            <line
              className="stroke-[#333] stroke-[1px]"
              x1="0"
              y1={pos}
              x2="40"
              y2={pos}
              vectorEffect="non-scaling-stroke"
            />
          </React.Fragment>
        ))}
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
