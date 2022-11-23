import { CurrentConversationActionType as ActionType } from '../../types/enum';

const reducer = (
  state = '',
  action: ChatTemplate.CurrentConversation.UpdateCurrentConversation
): string => {
  switch (action.type) {
    case ActionType.UPDATE_CURRENT_CONVERSATION:
      return action.payload;

    default:
      return state;
  }
};

export default reducer;
