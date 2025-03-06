import { useEffect, useMemo, useState } from 'react';
import PageBody from '../../components/pageLayout/pageBody/pageBody';
import PageContainer from '../../components/pageLayout/pageContainer/PageContainer';
import { PageHeader } from '../../components/pageLayout/pageHeader/PageHeader';
import { ScrollableContainer } from '../../components/scrollableContainer/ScrollableContainer';
import { EffectsPanel } from '../../components/strips/stripComponents/audioFilters/EffectsPanel';
import { useGlobalState } from '../../context/GlobalStateContext';

export const OutputMappingPage = () => {
  const [selectedStrip, setSelectedStrip] = useState<{
    id: number;
    type: 'mixes' | 'strips';
  } | null>(null);
  const [isFirstMount, setIsFirstMount] = useState<boolean>(true);
  const { strips, mixes, outputs, setStrips, setMixes } = useGlobalState();
  const isPFL = useMemo(() => mixes?.find((m) => m.stripId === 1000), [mixes]);

  useEffect(() => {
    if (!isFirstMount) return;

    setStrips((prevStrips) =>
      prevStrips.map((strip) => ({
        ...strip,
        selected: false
      }))
    );

    setMixes((prevMixes) =>
      prevMixes.map((mix) => ({
        ...mix,
        selected: false
      }))
    );

    setSelectedStrip(null);
    setIsFirstMount(false);
  }, [isFirstMount, setMixes, setStrips]);

  useEffect(() => {
    if (isFirstMount) return;

    const selStrip = strips.find((strip) => strip.selected === true);
    const selMix = mixes.find((mix) => mix.selected === true);

    if (selStrip) {
      setSelectedStrip({ id: selStrip.stripId, type: 'strips' });
    } else if (selMix) {
      setSelectedStrip({ id: selMix.stripId, type: 'mixes' });
    }
  }, [isFirstMount, mixes, strips]);

  const handleSelection = (
    stripId: number | null,
    type: 'mixes' | 'strips'
  ) => {
    setSelectedStrip(stripId ? { id: stripId, type: type } : null);

    setMixes((prevMixes) =>
      prevMixes.map((mix) => ({
        ...mix,
        selected: (stripId === mix.stripId && type === 'mixes') || false
      }))
    );

    setStrips((prevStrips) =>
      prevStrips.map((strip) => ({
        ...strip,
        selected: (stripId === strip.stripId && type === 'strips') || false
      }))
    );
  };

  return (
    <PageContainer>
      <PageHeader title="Outputs" />

      <PageBody>
        <div className="px-4 overflow-x-hidden">
          <ScrollableContainer
            outputStrips={outputs}
            isPFL={isPFL}
            onStripSelect={handleSelection}
            isOutputPage={true}
          />
        </div>

        {selectedStrip !== null && (
          <EffectsPanel
            strip={
              selectedStrip.type === 'mixes'
                ? mixes.find((mix) => mix.stripId === selectedStrip.id)
                : strips.find((strip) => strip.stripId === selectedStrip.id)
            }
            type={selectedStrip.type}
          />
        )}
      </PageBody>
    </PageContainer>
  );
};
