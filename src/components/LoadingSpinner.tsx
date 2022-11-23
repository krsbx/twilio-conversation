import { forwardRef } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

const LoadingSpinner = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Flex justifyContent={'center'}>
      <Spinner color="gray.500" size={'lg'} ref={ref} />
    </Flex>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
