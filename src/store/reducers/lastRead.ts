import { LastReadIndexActionType as ActionType } from '../../types/enum';

const initialState = -1;

const reducer = (
  state: number = initialState,
  action: ChatTemplate.LastRead.SetLastReadIndex
): number => {
  switch (action.type) {
    case ActionType.CONVERSATION_LAST_READ_INDEX:
      return action.payload;

    default:
      return state;
  }
};

export default reducer;
