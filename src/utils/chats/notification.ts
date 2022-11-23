import { PushNotification } from '@twilio/conversations';
import store from '../../store';
import { getCurrentConversation } from '../../store/selectors/currentConversation';
import { getUnreadMessageByConversation } from '../../store/selectors/unreadMessages';
import { updateUnreadMessages } from '../../store/actions/unreadMessages';

export const onPushNotification = (event: PushNotification) => {
  if (event.type != 'twilio.conversations.new_message') return;

  const { conversationSid } = event.data;

  if (!conversationSid) return;

  const state = store.getState();

  const currentConversation = getCurrentConversation(state);

  if (currentConversation === conversationSid) return;

  const unreadCount = getUnreadMessageByConversation(conversationSid)(state) ?? 0;

  updateUnreadMessages(conversationSid, unreadCount + 1);
};
