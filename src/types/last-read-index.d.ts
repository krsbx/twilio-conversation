import { LastReadIndexActionType as ActionType } from './enum';

export type SetLastReadIndex = {
  type: ActionType.CONVERSATION_LAST_READ_INDEX;
  payload: number;
};
