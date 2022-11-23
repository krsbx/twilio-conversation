import { RootState } from '..';

export const getTypingIndicator = (state: RootState) => state.typingIndicator;

export const getTypingIndicatorByConversation = (conversationId: string) => (state: RootState) =>
  state.typingIndicator[conversationId];
