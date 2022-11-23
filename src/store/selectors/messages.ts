import { RootState } from '..';

export const getMessages = (state: RootState) => state.messages;

export const getMessagesByConversation = (conversationId: string) => (state: RootState) =>
  state.messages[conversationId];

export const getMessage = (conversationId: string, messageId: string) => (state: RootState) =>
  state.messages[conversationId]?.find((message) => message.sid === messageId);
