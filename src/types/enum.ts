export enum ConversationsActionType {
  ADD_CONVERSATION = 'add.conversation',
  UPDATE_CONVERSATION = 'update.conversation',
  REMOVE_CONVERSATION = 'remove.conversation',
}

export enum ParticipantsActionType {
  UPDATE_PARTICIPANTS = 'update.participants',
}

export enum MessagesActionType {
  ADD_MESSAGES = 'add.messages',
  PUSH_MESSAGES = 'push.messages',
  REMOVE_MESSAGES = 'remove.messages',
}

export enum UnreadMessageActionType {
  UPDATE_UNREAD_MESSAGES = 'update.unread-messages',
}

export enum CurrentConversationActionType {
  UPDATE_CURRENT_CONVERSATION = 'update.current-conversation',
}

export enum ConversationTypingActionType {
  TYPING_STARTED = 'typing.started',
  TYPING_ENDED = 'typing.ended',
}

export enum LastReadIndexActionType {
  CONVERSATION_LAST_READ_INDEX = 'conversation.last-read-index',
}
