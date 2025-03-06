import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBody from '../../components/pageLayout/pageBody/pageBody';
import PageContainer from '../../components/pageLayout/pageContainer/PageContainer';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { ScrollableContainer } from '../../components/scrollableContainer/ScrollableContainer';
import { EffectsPanel } from '../../components/strips/stripComponents/audioFilters/EffectsPanel';
import {
  DeleteButton,
  PrimaryButton
} from '../../components/ui/buttons/Buttons';
import { ConfirmationModal } from '../../components/ui/modals/confirmationModal/ConfirmationModal';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { useNextAvailableIndex } from '../../hooks/useNextAvailableIndex';
import { useRemoveFromMixInputs } from '../../hooks/useRemoveFromMixInputs';
import { addMix, removeMix } from '../../utils/wsCommands';

export const MixesPage = () => {
  const [selectedMix, setSelectedMix] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteAllDisabled, setIsDeleteAllDisabled] = useState<boolean>(true);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const { sendMessage } = useWebSocket();
  const { mixes, setMixes } = useGlobalState();
  const { removeFromMixInputs } = useRemoveFromMixInputs();
  const nextMixIndex = useNextAvailableIndex(mixes);
  const isPFL = useMemo(() => mixes?.find((m) => m.stripId === 1000), [mixes]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFirstMount) return;

    setMixes((prevMixes) =>
      prevMixes.map((mix) => ({
        ...mix,
        selected: false
      }))
    );
    setSelectedMix(null);
    setIsFirstMount(false);
  }, [isFirstMount, setMixes]);

  useEffect(() => {
    setIsDeleteAllDisabled(
      mixes.length === 0 || (mixes.length === 1 && mixes[0].stripId === 1000)
    );
  }, [mixes]);

  useEffect(() => {
    if (isFirstMount) return;

    const isSelected = mixes.find((mix) => {
      return mix.selected === true;
    })?.stripId;

    if (isSelected) {
      setSelectedMix(isSelected);
    }
  }, [mixes, isFirstMount]);

  const handleAddMix = () => {
    addMix(sendMessage, nextMixIndex);
    navigate(`/mixes/${nextMixIndex}`);
  };

  const handleRemoveMix = (mixId: number) => {
    removeMix(mixId, sendMessage);
    removeFromMixInputs(mixId, 'mixes');

    if (selectedMix === mixId) {
      setSelectedMix(null);
    }
  };

  const handleRemoveAllMixes = () => {
    mixes.forEach((mix) => {
      if (mix.stripId !== 1000) {
        handleRemoveMix(mix.stripId);
      }
    });
  };

  const onModalOpen = () => {
    if (isDeleteAllDisabled) {
      return;
    }

    setIsModalOpen(!isModalOpen);
  };

  const handleMixSelection = (mixId: number | null) => {
    setSelectedMix(mixId);

    setMixes((prevMixes) =>
      prevMixes.map((mix) => ({
        ...mix,
        selected: mix.stripId === mixId || false
      }))
    );
  };

  return (
    <PageContainer>
      <PageHeader title="Audio Mixes">
        <div className="space-x-4">
          <DeleteButton disabled={isDeleteAllDisabled} onClick={onModalOpen}>
            Delete all mixes
          </DeleteButton>
          <PrimaryButton onClick={handleAddMix}>Create Mix</PrimaryButton>
        </div>
      </PageHeader>
      {/* Audio Strips Container */}
      <PageBody>
        <div className="p-4 w-full max-w-full h-full overflow-hidden">
          <ScrollableContainer
            mixStrips={mixes}
            isPFL={isPFL}
            handleRemoveStrip={handleRemoveMix}
            onStripSelect={handleMixSelection}
          />
        </div>

        {/* Effects Panel */}
        {selectedMix !== null && (
          <div className="p-4 h-full pb-6 pl-0">
            <EffectsPanel
              strip={mixes.find((m) => m.stripId === selectedMix)}
              type="mixes"
            />
          </div>
        )}
      </PageBody>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete all mixes"
        message="Are you sure you want to delete all mixes?"
        confirmText="Yes, delete all"
        onConfirm={handleRemoveAllMixes}
      />
    </PageContainer>
  );
};
