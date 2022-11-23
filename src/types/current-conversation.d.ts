import { CurrentConversationActionType as ActionType } from './enum';

export type UpdateCurrentConversation = {
  type: ActionType.UPDATE_CURRENT_CONVERSATION;
  payload: string;
};
