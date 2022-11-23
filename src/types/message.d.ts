import { Message } from '@twilio/conversations';
import { MessagesActionType as ActionType } from './enum';

export type AddMessages = {
  type: ActionType.ADD_MESSAGES;
  payload: { channelSid: string; messages: (Message | TimeDriver.Chats.Message)[] };
};

export type PushMessages = {
  type: ActionType.PUSH_MESSAGES;
  payload: { channelSid: string; messages: Message[] };
};

export type RemoveMessages = {
  type: ActionType.REMOVE_MESSAGES;
  payload: { channelSid: string; messages: Message[] };
};
