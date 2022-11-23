import { useEffect } from 'react';
import useTimeout from './useTimeout';

/**
 * Call a callback after a certain delay when dependencies change.
 * @param { callback } callback - The callback to call.
 * @param { any[] } dependencies - The dependencies to watch.
 * @param { number } delay - The delay to react in seconds.
 */
const useDebounce = (callback: () => void, dependencies: any[], delay = 300) => {
  const { reset, clear } = useTimeout(callback, delay);

  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, []);
};

export default useDebounce;
