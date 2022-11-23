import useWidthHeightObserver from './useWidthHeightObserver';

const useWidthObserver = (
  ref: React.RefObject<HTMLElement> | React.MutableRefObject<HTMLElement>,
  cb?: (width: number) => void
) => {
  const width = useWidthHeightObserver(ref, 'width', cb);

  return width;
};

export default useWidthObserver;
