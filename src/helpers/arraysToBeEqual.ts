export const arraysToBeEqual = (arr: string[], arr2: string[]): boolean => {
  if (!arr.length || !arr2.length || arr.length !== arr2.length) return false;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== arr2[i]) return false;
  }

  return true;
};
