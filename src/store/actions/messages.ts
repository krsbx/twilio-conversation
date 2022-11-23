import { Message } from '@twilio/conversations';
import { AppDispatch } from '..';
import { MessagesActionType as ActionType } from '../../types/enum';

export const addMessages =
  (channelSid: string, messages: (Message | ChatTemplate.Chats.Message)[]) =>
  (dispatch: AppDispatch) =>
    dispatch({
      type: ActionType.ADD_MESSAGES,
      payload: { channelSid, messages },
    });

export const pushMessages = (channelSid: string, messages: Message[]) => (dispatch: AppDispatch) =>
  dispatch({
    type: ActionType.PUSH_MESSAGES,
    payload: { channelSid, messages },
  });

export const removeMessages =
  (channelSid: string, messages: Message[]) => (dispatch: AppDispatch) =>
    dispatch({
      type: ActionType.REMOVE_MESSAGES,
      payload: { channelSid, messages },
    });
