import { Flex, Text } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { getCurrentConversation } from '../store/selectors/currentConversation';
import { getMessagesByConversation } from '../store/selectors/messages';
import { createFullName } from '../utils/createFullName';
import MessageList from './messages/MessageList';

const ChatMessageList = ({ messages, user }: Props) => {
  return (
    <>
      {messages.length > 0 ? (
        <MessageList />
      ) : (
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          fontSize={'12px'}
          fontWeight="semibold"
          fontFamily="Montserrat"
          color={'blackAlpha.500'}
          flex={1}
        >
          <Text p={0} m={0}>
            This is your first chat with{' '}
            {createFullName(user ?? ({} as ChatTemplate.Resource.User))}.
          </Text>
          <Text p={0} m={0}>
            Send your first message.
          </Text>
        </Flex>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  const conversationSid = getCurrentConversation(state);

  return {
    messages: getMessagesByConversation(conversationSid)(state) ?? [],
  };
};

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & {
  user: ChatTemplate.Resource.User | undefined;
};

export default connector(ChatMessageList);
