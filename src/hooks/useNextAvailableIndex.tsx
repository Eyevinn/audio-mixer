import { useMemo } from 'react';

export const useNextAvailableIndex = (items: { stripId: number }[]) => {
  return useMemo(() => {
    if (items.length === 0) {
      return 1;
    }

    const sortedIndexes = [...items]
      .map((item) => item.stripId)
      .sort((a, b) => a - b);

    // Check if 1 is available
    if (sortedIndexes[0] > 1) {
      return 1;
    }

    // Find first gap in sequence
    for (let i = 0; i < sortedIndexes.length - 1; i++) {
      if (sortedIndexes[i + 1] - sortedIndexes[i] > 1) {
        return sortedIndexes[i] + 1;
      }
    }

    // If no gaps found, return next number after the last one
    return sortedIndexes[sortedIndexes.length - 1] + 1;
  }, [items]);
};
