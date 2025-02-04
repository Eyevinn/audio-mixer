export const PanningLegend = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // className="panning_legend"
      className="absolute left-[2px]"
      version="2.0"
      height="50"
      width="80"
    >
      <line
        x1="5"
        y1="5"
        x2="5"
        y2="35"
        style={{ stroke: '#777', strokeWidth: 2 }}
      />
      <line
        x1="23"
        y1="8"
        x2="23"
        y2="32"
        style={{ stroke: '#777', strokeWidth: 2 }}
      />
      <line
        x1="40"
        y1="5"
        x2="40"
        y2="35"
        style={{ stroke: '#999', strokeWidth: 2 }}
      />
      <line
        x1="58"
        y1="8"
        x2="58"
        y2="32"
        style={{ stroke: '#777', strokeWidth: 2 }}
      />
      <line
        x1="75"
        y1="5"
        x2="75"
        y2="35"
        style={{ stroke: '#777', strokeWidth: 2 }}
      />
      <text
        x="2"
        y="46"
        /* className="legend_text" */ className="text-[10px] font-sans fill-[#777]"
      >
        L
      </text>
      <text
        x="72"
        y="46"
        /* className="legend_text" */ className="text-[10px] font-sans fill-[#777]"
      >
        R
      </text>
    </svg>
  );
};
