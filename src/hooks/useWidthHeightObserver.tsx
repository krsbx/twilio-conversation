import { useEffect, useState } from 'react';

const useWidthHeightObserver = (
  ref: React.RefObject<HTMLElement> | React.MutableRefObject<HTMLElement>,
  type: 'height' | 'width',
  cb?: (widthHeight: number) => void
) => {
  const [value, setValue] = useState(0);

  // Effect to listen changing width/height on a component
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const value = entry.contentRect[type];

      setValue(value);
      cb?.(value);
    });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return value;
};

export default useWidthHeightObserver;
