import { ConversationTypingActionType as ActionType } from './enum';

export type StartTypingIndicator = {
  type: ActionType.TYPING_STARTED;
  payload: {
    channelSid: string;
    participant: string;
  };
};

export type EndTypingIndicator = {
  type: ActionType.TYPING_ENDED;
  payload: {
    channelSid: string;
    participant: string;
  };
};
