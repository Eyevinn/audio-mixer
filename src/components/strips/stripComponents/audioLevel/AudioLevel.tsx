import React from 'react';

interface AudioLevelProps {
  isStereo: boolean;
  audioBarData?: {
    peak?: number;
    peak_left?: number;
    peak_right?: number;
  };
}

export const AudioLevel: React.FC<AudioLevelProps> = ({
  isStereo,
  audioBarData
}) => {
  // Convert audio level (in dB) to percentage
  const levelToPercent = (level: number | undefined): number => {
    const audioLevelFloor = -60.0; // Minimum level in dB
    if (level == null || level < audioLevelFloor) return 0;
    return 100.0 * (1.0 - level / audioLevelFloor);
  };

  // Calculate red and yellow borders (in percentage from top)
  const redBorder = 100.0 - levelToPercent(-9.0); // Red zone starts at -9dB
  const yellowBorder = 100.0 - levelToPercent(-20.0); // Yellow zone starts at -20dB

  return (
    <div className="flex space-x-1.5">
      <div className="relative w-[7px] h-[200px]">
        <div className="absolute inset-0 bg-meter-green">
          <div
            className="absolute top-0 left-0 right-0 bg-meter-red"
            style={{ height: `${redBorder}%` }}
          />
          <div
            className="absolute top-0 left-0 right-0 bg-meter-yellow"
            style={{
              top: `${redBorder}%`,
              height: `${yellowBorder - redBorder}%`
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 bg-[#444c] transition-all duration-100"
            style={{
              height: `${100 - levelToPercent(audioBarData?.peak_left ?? audioBarData?.peak ?? 0)}%`
            }}
          />
        </div>
      </div>
      <div
        className={`relative w-[7px] h-[200px] transition-opacity duration-200 ${
          isStereo ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-meter-green">
          <div
            className="absolute top-0 left-0 right-0 bg-meter-red"
            style={{ height: `${redBorder}%` }}
          />
          <div
            className="absolute top-0 left-0 right-0 bg-meter-yellow"
            style={{
              top: `${redBorder}%`,
              height: `${yellowBorder - redBorder}%`
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 bg-[#444c] transition-all duration-100"
            style={{
              height: `${100 - levelToPercent(audioBarData?.peak_right ?? audioBarData?.peak ?? 0)}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};
