import { AppDispatch } from '..';
import { UnreadMessageActionType as ActionType } from '../../types/enum';

export const updateUnreadMessages =
  (channelSid: string, unreadCount: number) => (dispatch: AppDispatch) =>
    dispatch({
      type: ActionType.UPDATE_UNREAD_MESSAGES,
      payload: { channelSid, unreadCount },
    });
