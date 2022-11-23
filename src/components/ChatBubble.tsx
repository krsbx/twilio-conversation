import _ from 'lodash';
import { Circle, Flex, useDisclosure } from '@chakra-ui/react';
import { BsChatQuote } from 'react-icons/bs';
import ChatModal from './ChatModal';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { getUnreadMessages } from '../store/selectors/unreadMessages';

const ChatBubble = ({ unreadCount }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        position={'fixed'}
        bottom={15}
        right={5}
        width={'56px'}
        height={'56px'}
        justifyContent={'center'}
        alignItems={'center'}
        borderRadius={'full'}
        bg={'customGreen'}
        cursor={'pointer'}
        color={'blackAlpha.600'}
        _hover={{
          color: 'black',
          bg: 'brightCustomGreen',
        }}
        transition={'all 0.2s ease-in-out'}
        onClick={onOpen}
      >
        {unreadCount > 0 && (
          <Circle
            position={'absolute'}
            zIndex={2}
            color={'white'}
            fontWeight={'bold'}
            top={-1}
            right={-1}
            bgColor={'red.300'}
            padding={'0.6rem'}
            fontSize={unreadCount > 99 ? '10px' : '14px'}
            size={'1.4rem'}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Circle>
        )}
        <BsChatQuote size={20} />
      </Flex>
      <ChatModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  unreadCount: _.reduce(getUnreadMessages(state), (prev, curr) => prev + curr, 0),
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(ChatBubble);
