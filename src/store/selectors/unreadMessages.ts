import { RootState } from '..';

export const getUnreadMessages = (state: RootState) => state.unreadMessages;

export const getUnreadMessageByConversation = (conversationId: string) => (state: RootState) =>
  state.unreadMessages[conversationId] ?? 0;
