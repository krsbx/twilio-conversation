import { Conversation } from '@twilio/conversations';
import { ConversationsActionType as ActionType } from './enum';

export type AddConversation = {
  type: ActionType.ADD_CONVERSATION;
  payload: Conversation;
};

export type UpdateConversation = {
  type: ActionType.UPDATE_CONVERSATION;
  payload: { channelSid: string; parameters: Partial<TimeDriver.Chats.Conversation> };
};

export type RemoveConversation = {
  type: ActionType.REMOVE_CONVERSATION;
  payload: string;
};
