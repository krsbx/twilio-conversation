import { Button } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';

const CloseChatButton = ({ onClose }: Props) => {
  return (
    <Button
      variant={'solid'}
      position={'absolute'}
      top={'18px'}
      right={'15px'}
      color={'white'}
      cursor={'pointer'}
      bg={'blackAlpha.300'}
      borderRadius={'full'}
      _hover={{
        bg: 'blackAlpha.400',
      }}
      _focus={{
        boxShadow: 'none',
        bg: 'blackAlpha.400',
      }}
      p={3}
      onClick={onClose}
    >
      <FaTimes />
    </Button>
  );
};

type Props = {
  onClose: () => void;
};

export default CloseChatButton;
