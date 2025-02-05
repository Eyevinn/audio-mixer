import React from 'react';

interface ControlButtonsProps {
  removeMode: boolean;
  onAddStrip: () => void;
  onToggleRemoveMode: () => void;
  onRemoveAllStrips: () => void;
  onResync: () => void;
  onLoadConfig: (file: File) => void;
  onSaveConfig: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  removeMode,
  onAddStrip,
  onToggleRemoveMode,
  onRemoveAllStrips,
  onResync,
  onLoadConfig,
  onSaveConfig
}) => {
  return (
    <div className="ml-4 flex flex-col space-y-4">
      {/* Add/Remove Controls */}
      <div className="flex space-x-2">
        <button
          onClick={onAddStrip}
          className="p-2 bg-green-600 rounded hover:bg-green-700"
        >
          <img src="/add.png" alt="Add" className="w-8 h-8" />
        </button>
        <button
          onClick={onToggleRemoveMode}
          className={`p-2 rounded ${
            removeMode
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          <img src="/trash.png" alt="Remove" className="w-8 h-8" />
        </button>
        <button
          onClick={onRemoveAllStrips}
          className="p-2 bg-red-600 rounded hover:bg-red-700"
        >
          <img src="/remove.png" alt="Remove All" className="w-8 h-8" />
        </button>
        <button
          onClick={onResync}
          className="p-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          <img src="/resync.png" alt="Resync" className="w-8 h-8" />
        </button>
      </div>

      {/* Load/Save Controls */}
      <div className="flex space-x-2">
        <label className="p-2 bg-blue-600 rounded hover:bg-blue-700 cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && onLoadConfig(e.target.files[0])
            }
          />
          <img src="/load.png" alt="Load" className="w-8 h-8" />
        </label>
        <button
          onClick={onSaveConfig}
          className="p-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          <img src="/save.png" alt="Save" className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
