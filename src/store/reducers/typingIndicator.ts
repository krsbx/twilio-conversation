import { uniq } from 'lodash';
import { ConversationTypingActionType as ActionType } from '../../types/enum';

export type TypingDataState = Record<string, string[]>;

const initialState: TypingDataState = {};

const reducer = (
  state = initialState,
  action:
    | ChatTemplate.TypingIndicator.StartTypingIndicator
    | ChatTemplate.TypingIndicator.EndTypingIndicator
): TypingDataState => {
  switch (action.type) {
    case ActionType.TYPING_STARTED: {
      const existedUsers = state[action.payload.channelSid] ?? [];
      existedUsers.push(action.payload.participant);

      return {
        ...state,
        [action.payload.channelSid]: uniq(existedUsers),
      };
    }

    case ActionType.TYPING_ENDED: {
      const currentParticipant = state[action.payload.channelSid] ?? [];

      const index = currentParticipant.findIndex((part) => part === action.payload.participant);

      if (index !== -1) currentParticipant.splice(index, 1);

      return {
        ...state,
        [action.payload.channelSid]: uniq(currentParticipant),
      };
    }

    default:
      return state;
  }
};

export default reducer;
