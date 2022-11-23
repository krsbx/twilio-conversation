import { AppDispatch } from '..';
import { CurrentConversationActionType as ActionType } from '../../types/enum';

export const updateCurrentConversation = (sid: string) => (dispatch: AppDispatch) =>
  dispatch({
    type: ActionType.UPDATE_CURRENT_CONVERSATION,
    payload: sid,
  });
