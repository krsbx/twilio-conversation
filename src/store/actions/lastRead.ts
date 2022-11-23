import { AppDispatch } from '..';
import { LastReadIndexActionType as ActionType } from '../../types/enum';

export const setLastReadIndex = (index: number) => (dispatch: AppDispatch) =>
  dispatch({
    type: ActionType.CONVERSATION_LAST_READ_INDEX,
    payload: index,
  });
