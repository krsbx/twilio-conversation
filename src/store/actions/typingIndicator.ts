import { AppDispatch } from '..';
import { ConversationTypingActionType as ActionType } from '../../types/enum';

export const startTyping = (channelSid: string, participant: string) => (dispatch: AppDispatch) =>
  dispatch({
    type: ActionType.TYPING_STARTED,
    payload: { channelSid, participant },
  });

export const endTyping = (channelSid: string, participant: string) => (dispatch: AppDispatch) =>
  dispatch({
    type: ActionType.TYPING_ENDED,
    payload: { channelSid, participant },
  });
