import _ from 'lodash';
import { Conversation, Message } from '@twilio/conversations';
import store from '../../store';
import { addMessages, removeMessages } from '../../store/actions/messages';
import { getConversationObject } from './object';
import { updateUnreadMessages } from '../../store/actions/unreadMessages';
import cookieUtils from '../cookieUtils';

export const transformMessage = (
  message: Message | ChatTemplate.Chats.Message
): ChatTemplate.Chats.Message => ({
  ..._.pick(message, [
    'sid',
    'index',
    'body',
    'author',
    'participantSid',
    'attributes',
    'dateCreated',
  ]),
  aggregatedDeliveryReceipt: message.aggregatedDeliveryReceipt
    ? _.pick(message.aggregatedDeliveryReceipt, [
        'total',
        'sent',
        'delivered',
        'read',
        'undelivered',
        'failed',
      ])
    : null,
  attachedMedia:
    message.attachedMedia?.map((media) =>
      _.pick(media, 'sid', 'filename', 'contentType', 'size', 'category')
    ) ?? null,
});

export const getTypingMessage = (typingData: string[]): string =>
  typingData.length > 1
    ? `${typingData.length + ' participants are typing...'}`
    : `${typingData[0] + ' is typing...'}`;

export const getLastMessage = (messages: ChatTemplate.Chats.Message[], typingData: string[]) => {
  if (messages === undefined || messages === null) {
    return 'Loading...';
  }

  if (typingData.length) {
    return getTypingMessage(typingData);
  }

  if (messages.length === 0) {
    return 'No messages';
  }

  return messages[messages.length - 1].body || 'Media message';
};

export const loadUnreadMessagesCount = async (conversation: Conversation) => {
  return {
    unreadCount: await conversation.getUnreadMessagesCount(),
    messageCount: await conversation.getMessagesCount(),
  };
};

export const onMessageAdded = async (message: Message) => {
  addMessages(message.conversation.sid, [message])(store.dispatch);

  const { messageCount, unreadCount } = await loadUnreadMessagesCount(message.conversation);

  if (message.author === cookieUtils.getUser()?.email) return;

  updateUnreadMessages(message.conversation.sid, unreadCount ?? messageCount)(store.dispatch);
};

export const onRemoveMessage = (message: Message) =>
  removeMessages(message.conversation.sid, [message])(store.dispatch);

export const loadMessages = async (
  conversation: ChatTemplate.Chats.Conversation,
  currentMessages: ChatTemplate.Chats.Message[] = []
) => {
  const convoSid: string = conversation.sid;
  const sidExists = !!currentMessages.filter(({ sid }) => sid === convoSid).length;

  if (sidExists) return;

  const { items: messages } = await getConversationObject(conversation).getMessages();

  addMessages(conversation.sid, messages)(store.dispatch);
};
