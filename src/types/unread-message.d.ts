import { UnreadMessageActionType as ActionType } from './enum';

export type UpdateUnreadMessages = {
  type: ActionType.UPDATE_UNREAD_MESSAGES;
  payload: { channelSid: string; unreadCount: number };
};
