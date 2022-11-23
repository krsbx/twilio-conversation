import { Conversation } from '@twilio/conversations';
import { AppDispatch } from '..';
import { ConversationsActionType as ActionType } from '../../types/enum';

export const addConversation = (conversation: Conversation) => (dispatch: AppDispatch) =>
  dispatch({
    type: ActionType.ADD_CONVERSATION,
    payload: conversation,
  });

export const updateConversation =
  (channelSid: string, parameters: Partial<Conversation>) => (dispatch: AppDispatch) =>
    dispatch({
      type: ActionType.UPDATE_CONVERSATION,
      payload: {
        channelSid,
        parameters,
      },
    });

export const removeConversation = (sid: string) => (dispatch: AppDispatch) =>
  dispatch({
    type: ActionType.REMOVE_CONVERSATION,
    payload: sid,
  });
