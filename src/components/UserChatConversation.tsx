import _ from 'lodash';
import { createRef, useEffect, useState } from 'react';
import { Avatar, Circle, Button, Flex, Stack, Text } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../store';
import { getCurrentConversation } from '../store/selectors/currentConversation';
import { getParticipantsByConversation } from '../store/selectors/participants';
import { getUnreadMessageByConversation } from '../store/selectors/unreadMessages';
import { getAllUserChat as _getAllUser } from '../store/actions';
import { setLastReadIndex as _setLastReadIndex } from '../store/actions/lastRead';
import { updateCurrentConversation as _updateCurrentConversation } from '../store/actions/currentConversation';
import { updateUnreadMessages as _updateUnreadMessages } from '../store/actions/unreadMessages';
import RoleBadge from './RoleBadge';
import { createFullName } from '../utils/createFullName';
import useWatchCookie from '../hooks/useWatchCookie';

const UserChatConversation = ({
  conversation,
  currentConversation,
  lastMessage,
  participant,
  unreadMessageCount,
  onClick: _onClick,
  getAllUser,
  updateCurrentConversation,
  updateUnreadMessage,
  setLastReadIndex,
}: Props) => {
  const { value: currentUser } = useWatchCookie<ChatTemplate.Resource.User>('userData');
  const buttonRef = createRef<HTMLButtonElement>();
  const [user, setUser] = useState<ChatTemplate.Resource.User>();
  const isSelected = conversation.sid === currentConversation;
  const hasUnreadMessage = unreadMessageCount > 0;

  useEffect(() => {
    if (!currentUser) return;
    if (!conversation) return;
    if (_.isEmpty(participant)) return;

    (async () => {
      const userSids = participant.filter((part) => part.identity !== currentUser?.email);
      const filters = _.compact([userSids[0] && `email = "${userSids[0].identity}"`]).join('&');

      if (_.isEmpty(filters)) return;

      const [user] = await getAllUser(`filters=${filters}`);

      if (!user) return;
      setUser(user);
    })();
  }, [currentUser, conversation, participant]);

  const onClick = () => {
    if (isSelected) {
      updateCurrentConversation('');
    } else {
      updateUnreadMessage(conversation.sid, 0);
      setLastReadIndex(-1);
      updateCurrentConversation(conversation.sid);
    }

    _onClick?.();

    if (!buttonRef.current) return;

    buttonRef.current.blur();
  };

  return (
    <Button
      borderBottom={'1px solid black'}
      bg={isSelected ? '#07B89E19' : 'white'}
      alignItems={'center'}
      onClick={onClick}
      cursor={'pointer'}
      _hover={{
        bg: 'blackAlpha.50',
      }}
      _focus={{
        boxShadow: 'none',
        bg: 'blackAlpha.50',
      }}
      height={'max-content'}
      borderRadius={'none'}
      variant={'unstyled'}
      ref={buttonRef}
      p={3}
    >
      <Stack direction={'row'} spacing={1}>
        <Avatar
          size="sm"
          boxShadow="none"
          border="1px solid black"
          filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5))"
          src={
            user?.profilePictureId
              ? `${import.meta.env.NEXT_PUBLIC_API_URL}/users/${user?.id}/profile-pictures/file`
              : undefined
          }
        />
        <Flex rowGap={1} px={2} position={'relative'} width={'90%'} flexDirection={'column'}>
          <Stack alignItems={'center'} direction={'row'} spacing={1} width={'100%'}>
            <Text
              fontSize={'14px'}
              fontWeight={hasUnreadMessage ? 'bold' : 'semibold'}
              maxWidth={'65%'}
              overflow={'hidden'}
              textOverflow={'ellipsis'}
            >
              {user ? createFullName(user) : ''}
            </Text>
            <RoleBadge isDriver={!!user?.driver} />
          </Stack>
          <Text
            fontSize={'12px'}
            fontWeight={hasUnreadMessage ? 'bold' : 'semibold'}
            textAlign={'left'}
            width={'90%'}
            overflow={'hidden'}
            textOverflow={'ellipsis'}
          >
            {lastMessage ?? ''}
          </Text>
          {hasUnreadMessage && (
            <Circle
              zIndex={3}
              size={'0.7rem'}
              padding={'0.75rem'}
              position={'absolute'}
              right={'-1.25rem'}
              top={'50%'}
              transform={'translate(-50%, -50%)'}
              bgColor={'customGreen'}
            >
              <Text
                fontSize={unreadMessageCount > 99 ? '10px' : '12px'}
                fontWeight={'semibold'}
                textAlign={'center'}
                color={'white'}
              >
                {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
              </Text>
            </Circle>
          )}
        </Flex>
      </Stack>
    </Button>
  );
};

const mapStateToProps = (
  state: RootState,
  { conversation }: { conversation: ChatTemplate.Chats.Conversation }
) => ({
  participant: getParticipantsByConversation(conversation.sid)(state) ?? [],
  unreadMessageCount: getUnreadMessageByConversation(conversation.sid)(state),
  currentConversation: getCurrentConversation(state),
});

const connector = connect(mapStateToProps, {
  updateCurrentConversation: _updateCurrentConversation,
  updateUnreadMessage: _updateUnreadMessages,
  setLastReadIndex: _setLastReadIndex,
  getAllUser: _getAllUser,
});

type Props = ConnectedProps<typeof connector> & {
  lastMessage: string;
  conversation: ChatTemplate.Chats.Conversation;
  onClick?: () => void;
};

export default connector(UserChatConversation);
