import { Text } from '@chakra-ui/react';

const RoleBadge = ({ isDriver }: Props) => {
  return (
    <Text
      fontSize={'12px'}
      bg={isDriver ? 'black' : 'customGreen'}
      color={'white'}
      borderRadius={'md'}
      px={'6px'}
    >
      {isDriver ? 'Driver' : 'Rider'}
    </Text>
  );
};

type Props = {
  isDriver?: boolean;
};

export default RoleBadge;
