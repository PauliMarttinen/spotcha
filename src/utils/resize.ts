export const resize = (minOriginal: number, maxOriginal: number, valueOriginal: number, minTarget: number, maxTarget: number) => {
  const diffOriginal = maxOriginal-minOriginal;
  const valueDiff = valueOriginal-minOriginal;
  const percentage = diffOriginal === 0 ? 0 : valueDiff/diffOriginal;
  const diffTarget = maxTarget-minTarget;
  const valueTarget = diffTarget*percentage+minTarget;
  return valueTarget;
};