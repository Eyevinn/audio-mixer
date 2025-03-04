import { useEffect, useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';

interface Item {
  stripId: number;
  label?: string;
}

export function useCheckOutputUsage<T extends Item>(
  items: T[] | T,
  sourceType: 'mix' | 'strip'
) {
  const { outputs } = useGlobalState();
  const [warningText, setWarningText] = useState<string | string[]>('');

  useEffect(() => {
    if (Array.isArray(items)) {
      const newWarningTexts: string[] = [];

      items.forEach((item) => {
        const usedOutputKeys = Object.entries(outputs)
          .filter(
            ([, output]) =>
              output.input.source === sourceType &&
              output.input.index === item.stripId
          )
          .map(([key]) => key);

        if (usedOutputKeys.length > 0) {
          newWarningTexts.push(
            `${sourceType.charAt(0).toUpperCase() + sourceType.slice(1)} ${
              item.label || item.stripId
            } is used in output${usedOutputKeys.length > 1 ? 's' : ''}: ${usedOutputKeys.join(', ')}.\n`
          );
        }
      });

      setWarningText(newWarningTexts.join(''));
    } else {
      const usedOutputKeys = Object.entries(outputs)
        .filter(
          ([, output]) =>
            output.input.source === sourceType &&
            output.input.index === items.stripId
        )
        .map(([key]) => key);

      setWarningText(
        usedOutputKeys.length > 0
          ? `${sourceType.charAt(0).toUpperCase() + sourceType.slice(1)} ${
              items.label || items.stripId
            } is used in output${usedOutputKeys.length > 1 ? 's' : ''}: ${usedOutputKeys.join(', ')}.\n`
          : ''
      );
    }
  }, [items, outputs, sourceType]);

  return warningText;
}
