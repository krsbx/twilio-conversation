import _ from 'lodash';
import { useMemo } from 'react';
import { Client as ConversationClient } from '@twilio/conversations';
import { connect, ConnectedProps } from 'react-redux';
import UserChatConversation from './UserChatConversation';
import { getLastMessage } from '../utils/chats/message';
import { RootState } from '../store';
import { getConversations } from '../store/selectors/conversations';
import { getMessages } from '../store/selectors/messages';
import { getConversationObject } from '../utils/chats/object';
import CreateUserChat from './CreateUserChat';
import { getTypingIndicator } from '../store/selectors/typingIndicator';

const ChatList = ({
  client,
  keyword,
  users,
  messages,
  conversations,
  typingIndicator,
  setKeyword,
}: Props) => {
  const searchedUserSids = _(users)
    .map((user) => user.twilioUserSid)
    .compact()
    .value();

  const useableConversations = useMemo(() => {
    const newConversation = conversations.filter(async (conversation) => {
      const participants = await Promise.all(
        _.map(searchedUserSids, (sid) =>
          getConversationObject(conversation).getParticipantBySid(sid)
        )
      );

      return _.compact(participants).length > 0;
    });

    return _.compact(newConversation);
  }, [searchedUserSids, keyword, conversations]);

  return (
    <>
      {_.map(users, (user) => (
        <CreateUserChat onClick={() => setKeyword('')} client={client} user={user} key={user.id} />
      ))}
      {_.map(useableConversations, (conversation) => (
        <UserChatConversation
          lastMessage={
            getLastMessage(
              messages?.[conversation.sid] ?? [],
              typingIndicator?.[conversation.sid] ?? []
            ) ?? ''
          }
          onClick={() => setKeyword('')}
          conversation={conversation}
          key={conversation.sid}
        />
      ))}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  conversations: getConversations(state),
  typingIndicator: getTypingIndicator(state),
  messages: getMessages(state),
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & {
  client: ConversationClient | undefined;
  setKeyword: ReactSetter<string>;
  keyword: string;
  users: ChatTemplate.Resource.User[];
};

export default connector(ChatList);
