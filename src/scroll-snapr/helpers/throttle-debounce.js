export const debounce = (func, delay, immediate) => {
  let timerId;
  return (...args) => {
    const boundFunc = func.bind(this, ...args);
    clearTimeout(timerId);
    if (immediate && !timerId) {
      boundFunc();
    }
    const calleeFunc = immediate
      ? () => {
          timerId = null;
        }
      : boundFunc;
    timerId = setTimeout(calleeFunc, delay);
  };
};

export const throttle = (func, delay, immediate) => {
  let timerId;
  return (...args) => {
    const boundFunc = func.bind(this, ...args);
    if (timerId) {
      return;
    }
    if (immediate && !timerId) {
      boundFunc();
    }
    timerId = setTimeout(() => {
      if (!immediate) {
        boundFunc();
      }
      timerId = null; // reset the timer so next call will be excuted
    }, delay);
  };
};
