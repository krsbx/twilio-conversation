import { Client as ConversationClient } from '@twilio/conversations';
import { Avatar, Stack, Text } from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { createFullName } from '../utils/createFullName';
import RoleBadge from './RoleBadge';
import { createConversation as _createConversation } from '../store/actions';
import { addConversation as _addConversation } from '../store/actions/conversations';
import { updateCurrentConversation as _updateCurrentConversation } from '../store/actions/currentConversation';
import { updateParticipants as _updateParticipants } from '../store/actions/participants';

const CreateUserChat = ({
  isSelected,
  user,
  client,
  addConversation,
  createConversation,
  updateCurrentConversation,
  updateParticipants,
  onClick: _onClick,
}: Props) => {
  const onClick = async () => {
    if (!client) return;

    const { conversation: newConversation } = await createConversation(user.id);
    const conversationInstance = await client.getConversationBySid(newConversation.sid);

    addConversation(conversationInstance);
    updateCurrentConversation(conversationInstance.sid);
    updateParticipants(await conversationInstance.getParticipants(), conversationInstance.sid);

    _onClick?.();
  };

  return (
    <Stack
      borderBottom={'1px solid black'}
      bg={isSelected ? '#07B89E19' : 'white'}
      alignItems={'center'}
      direction={'row'}
      onClick={onClick}
      spacing={1}
      p={3}
    >
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
      <Stack spacing={1} px={1}>
        <Stack alignItems={'center'} direction={'row'} spacing={1}>
          <Text fontSize={'14px'} fontWeight={'semibold'}>
            {user ? createFullName(user) : ''}
          </Text>
          <RoleBadge isDriver={!!user.driver} />
        </Stack>
      </Stack>
    </Stack>
  );
};

const connector = connect(null, {
  addConversation: _addConversation,
  createConversation: _createConversation,
  updateCurrentConversation: _updateCurrentConversation,
  updateParticipants: _updateParticipants,
});

type Props = ConnectedProps<typeof connector> & {
  onClick?: () => void;
  client: ConversationClient | undefined;
  user: ChatTemplate.Resource.User;
  isSelected?: boolean;
};

export default connector(CreateUserChat);
