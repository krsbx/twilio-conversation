import { RootState } from '..';

export const getConversations = (state: RootState) => state.conversations;

export const getConversationById = (conversationId: string) => (state: RootState) =>
  state.conversations.find((conversation) => conversation.sid === conversationId);
