import { useMemo } from 'react';

export const useNextAvailableIndex = (items: { index: number }[]) => {
  return useMemo(() => {
    if (items.length === 0) {
      return 0;
    }

    const existingIndexes = items.map((item) => item.index);
    const sortedIndexes = [...existingIndexes].sort((a, b) => a - b);

    for (let i = 0; i < sortedIndexes.length; i++) {
      if (sortedIndexes[i] !== i) {
        return i;
      }
    }

    return sortedIndexes.length;
  }, [items]);
};
