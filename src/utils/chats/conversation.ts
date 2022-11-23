import { Conversation, ConversationUpdateReason } from '@twilio/conversations';
import store from '../../store';
import {
  addConversation,
  removeConversation,
  updateConversation,
} from '../../store/actions/conversations';
import { addMessages } from '../../store/actions/messages';
import { updateParticipants } from '../../store/actions/participants';
import { updateCurrentConversation } from '../../store/actions/currentConversation';
import { updateUnreadMessages } from '../../store/actions/unreadMessages';
import { loadUnreadMessagesCount } from './message';
import { onTypingEnded, onTypingStarted } from './typing';

export const conversationSorter = (
  a: ChatTemplate.Chats.Conversation,
  b: ChatTemplate.Chats.Conversation
) =>
  (b.lastMessage?.dateCreated?.getTime() ?? b.dateUpdated?.getTime() ?? 0) -
  (a.lastMessage?.dateCreated?.getTime() ?? a.dateUpdated?.getTime() ?? 0);

export const onConversationJoined = async (conversation: Conversation) => {
  addConversation(conversation)(store.dispatch);

  conversation.on('typingStarted', onTypingStarted(conversation));
  conversation.on('typingEnded', onTypingEnded(conversation));

  if (conversation.status !== 'joined') return;

  const [participants, { items: messages }, { messageCount, unreadCount }] = await Promise.all([
    conversation.getParticipants(),
    conversation.getMessages(),
    loadUnreadMessagesCount(conversation),
  ]);

  updateParticipants(participants, conversation.sid)(store.dispatch);
  addMessages(conversation.sid, messages)(store.dispatch);
  updateUnreadMessages(conversation.sid, unreadCount ?? messageCount)(store.dispatch);
};

export const onConversationUpdated = ({
  conversation,
}: {
  conversation: Conversation;
  updateReasons: ConversationUpdateReason[];
}) => {
  updateConversation(conversation.sid, conversation)(store.dispatch);
};

export const onConversationRemoved = (conversation: Conversation) => {
  removeConversation(conversation.sid)(store.dispatch);
  updateParticipants([], conversation.sid)(store.dispatch);
  updateCurrentConversation('')(store.dispatch);
};
