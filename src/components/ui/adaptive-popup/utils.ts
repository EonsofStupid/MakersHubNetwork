export const throttle = (fn: Function, delay: number) => {
  let lastTime = 0;
  return (...args: any) => {
    const now = new Date().getTime();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn(...args);
    }
  };
};
