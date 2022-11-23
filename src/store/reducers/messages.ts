import { Message } from '@twilio/conversations';
import { MessagesActionType as ActionType } from '../../types/enum';
import { transformMessage } from '../../utils/chats/message';
import { mediasMap, messagesMap } from '../../utils/chats/object';

const reducer = (
  state: ChatTemplate.Chats.MessageRecord = {},
  action:
    | ChatTemplate.Message.AddMessages
    | ChatTemplate.Message.PushMessages
    | ChatTemplate.Message.RemoveMessages
): ChatTemplate.Chats.MessageRecord => {
  let existingMessages: ChatTemplate.Chats.Message[] = [];

  switch (action.type) {
    case ActionType.ADD_MESSAGES: {
      // Get existing messages for the conversation
      existingMessages = state[action.payload.channelSid] ?? [];

      const filteredExistingMessages = existingMessages.filter(
        (message: ChatTemplate.Chats.Message) =>
          !action.payload.messages.find(
            (value) =>
              value.body === message.body &&
              value.author === message.author &&
              (message.index === -1 || value.index === message.index)
          )
      );

      // Add new messages to exisiting, ignore duplicates
      const messagesUnique = [
        ...filteredExistingMessages,
        ...action.payload.messages.map(transformMessage),
      ].sort((a, b) => a.index - b.index);

      for (const message of action.payload.messages) {
        if (message instanceof Message) {
          messagesMap.set(message.sid, message);

          if (message.attachedMedia) {
            message.attachedMedia.forEach((media) => {
              mediasMap.set(media.sid, media);
            });
          }
        }
      }

      return {
        ...state,
        [action.payload.channelSid]: messagesUnique,
      };
    }

    case ActionType.PUSH_MESSAGES: {
      existingMessages = state[action.payload.channelSid] ?? [];

      for (const message of action.payload.messages) {
        messagesMap.set(message.sid, message);
        if (message.attachedMedia) {
          message.attachedMedia.forEach((media) => {
            mediasMap.set(media.sid, media);
          });
        }
      }

      return {
        ...state,
        [action.payload.channelSid]: existingMessages.concat(
          action.payload.messages.map(transformMessage)
        ),
      };
    }

    case ActionType.REMOVE_MESSAGES: {
      // Get existing messages for the conversation
      existingMessages = state[action.payload.channelSid] ?? [];

      const messages = existingMessages.filter(
        ({ index }) =>
          !action.payload.messages.find(({ index: messageIndex }) => messageIndex === index)
      );

      for (const message of action.payload.messages) {
        messagesMap.delete(message.sid);

        if (message.attachedMedia) {
          message.attachedMedia.forEach((media) => {
            mediasMap.delete(media.sid);
          });
        }
      }

      return {
        ...state,
        [action.payload.channelSid]: messages,
      };
    }

    default:
      return state;
  }
};

export default reducer;
