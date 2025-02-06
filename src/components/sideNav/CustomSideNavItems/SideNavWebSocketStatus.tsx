import { FC } from 'react';
import Icons from '../../../assets/icons/Icons';
import { SideNavTooltip } from '../SideNavTooltip';
import { useWebSocket } from '../../webSocket/WebSocketContext';

interface SideNavWebSocketStatus {
  isOpen: boolean;
}

const SideNavWebSocketStatus: FC<SideNavWebSocketStatus> = (props) => {
  const { isOpen } = props;

  const { wsUrl, isConnected } = useWebSocket();

  return (
    <div className="relative group">
      <div
        className={`flex p-4 rounded-xl mb-2 overflow-hidden h-24 w-full space-x-4 items-top`}
      >
        <Icons
          name={isConnected ? 'IconPlugConnected' : 'IconPlugConnectedX'}
          className={`min-w-8 min-h-8 ${isConnected ? 'text-green-500' : 'text-red-500'}`}
        />
        <div>
          <p className="text-white">WebSocket</p>
          <div className={`flex text-xs flex-col h-16 italic`}>
            <div
              className={`${isConnected ? 'text-green-500' : 'text-red-500'}`}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="text-gray-500">{wsUrl}</div>
          </div>
        </div>
      </div>
      <SideNavTooltip
        label={'WebSocket Connection'}
        isOpen={isOpen}
        className="top-[35%]"
      />
    </div>
  );
};

export default SideNavWebSocketStatus;
