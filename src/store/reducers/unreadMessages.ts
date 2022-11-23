import { UnreadMessageActionType as ActionType } from '../../types/enum';

const reducer = (
  state: Record<string, number> = {},
  action: ChatTemplate.UreadMessage.UpdateUnreadMessages
): Record<string, number> => {
  switch (action.type) {
    case ActionType.UPDATE_UNREAD_MESSAGES:
      return {
        ...state,
        [action.payload.channelSid]: action.payload.unreadCount,
      };

    default:
      return state;
  }
};

export default reducer;
