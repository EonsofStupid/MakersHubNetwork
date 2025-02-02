export const validateMaxCount = (currentCount: number, maxCount: number = 7): boolean => {
  return currentCount < maxCount;
};