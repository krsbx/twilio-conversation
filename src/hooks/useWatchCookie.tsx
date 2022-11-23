import Cookies from 'js-cookie';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

const getCookie = (key: string) => {
  const value = Cookies.get(key);

  if (value === undefined) return;
  if (value === null) return null;

  return JSON.parse(value);
};

const useWatchCookie = <T,>(key: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const [prevValue, _setPrevValue] = useState<T | undefined>();
  const [value, _setValue] = useState<T | undefined>(getCookie(key));

  const remove = useCallback(() => {
    Cookies.remove(key);
    _setValue(undefined);
  }, []);

  const setValue = useCallback((value: any) => {
    Cookies.set(key, JSON.stringify(value));
    _setValue(value);
  }, []);

  // Watch any changes in cookies
  useEffect(() => {
    if (isLoaded) return;

    intervalRef.current = setInterval(() => {
      const temp = getCookie(key);

      if (!_.isEqual(value, temp)) {
        _setPrevValue(value);
        _setValue(temp);
      }
    }, 100);

    setIsLoaded(true);

    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    value,
    prevValue,
    setValue,
    remove,
  };
};

export default useWatchCookie;
