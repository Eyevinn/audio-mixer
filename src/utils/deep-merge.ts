/* eslint-disable @typescript-eslint/no-explicit-any */
const deepMerge = (target: any, source: any): any => {
  if (typeof source !== 'object' || source === null) {
    return source;
  }
  if (typeof target !== 'object' || target === null) {
    return source;
  }

  // Handle arrays specially
  if (Array.isArray(source)) {
    if (!Array.isArray(target)) return source;
    return target.map((item, index) =>
      index < source.length ? deepMerge(item, source[index]) : item
    );
  }

  const result = { ...target };
  Object.keys(source).forEach((key) => {
    // Special handling for eq.bands - treat as an object with numeric keys
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (
        target[key] &&
        !Array.isArray(target[key]) &&
        !Array.isArray(source[key])
      ) {
        // If both are objects and not arrays, merge them
        result[key] = deepMerge(target[key], source[key]);
      } else {
        // If one is not an object or they're arrays, replace with source
        result[key] = source[key];
      }
    } else {
      result[key] = source[key];
    }
  });
  return result;
};

export default deepMerge;
