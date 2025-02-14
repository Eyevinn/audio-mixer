import React from 'react';
import Icons from '../../../assets/icons/Icons';
import { MainVolume } from '../../../components/strips/mainVolume/MainVolume';
import { PageHeader } from '../../../components/pageLayout/pageHeader/PageHeader';
import { useWebSocket } from '../../../context/WebSocketContext';

export const OutputMixesPage = () => {
  const { sendMessage } = useWebSocket();
  return (
    <div className="text-white text-2xl flex flex-col w-full">
      <PageHeader title="Output Mixes">
        <button className="w-[2rem] p-2">
          <Icons
            name="IconTrash"
            className="stroke-inherit hover:cursor-pointer rounded-xl hover:bg-light place-self-end"
          />
        </button>
      </PageHeader>

      {/* Output Mixes Container */}
      <div className="flex space-x-2 p-5">
        {/* Main Volume */}
        <MainVolume
          onVolumeChange={(volume) =>
            sendMessage({
              type: 'set',
              resource: '/audio/outputs/0/main_fader/volume',
              body: { value: volume }
            })
          }
          onMuteChange={(muted) =>
            sendMessage({
              type: 'set',
              resource: '/audio/outputs/0/main_fader/muted',
              body: { value: muted }
            })
          }
          onResetLUFS={() =>
            sendMessage({
              type: 'command',
              resource: '/audio/outputs/0/meters',
              body: { command: 'reset', parameters: {} }
            })
          }
        />
      </div>
    </div>
  );
};
