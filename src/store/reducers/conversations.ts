import _ from 'lodash';
import { ConversationsActionType as ActionType } from '../../types/enum';
import { conversationSorter } from '../../utils/chats/conversation';
import { conversationsMap } from '../../utils/chats/object';

const reducer = (
  state: ChatTemplate.Chats.Conversation[] = [],
  action:
    | ChatTemplate.Conversation.AddConversation
    | ChatTemplate.Conversation.UpdateConversation
    | ChatTemplate.Conversation.RemoveConversation
): ChatTemplate.Chats.Conversation[] => {
  let index = -1;

  switch (action.type) {
    case ActionType.ADD_CONVERSATION: {
      // Update the conversations map with the new conversation object
      conversationsMap.set(action.payload.sid, action.payload);

      return [
        ...state.filter((value) => value.sid !== action.payload.sid),
        {
          ..._.pick(action.payload, [
            'sid',
            'friendlyName',
            'dateUpdated',
            'notificationLevel',
            'lastReadMessageIndex',
          ]),
          lastMessage: {
            ...action.payload.lastMessage,
          },
        },
      ].sort(conversationSorter);
    }

    case ActionType.UPDATE_CONVERSATION: {
      index = state.findIndex((conversation) => conversation.sid === action.payload.channelSid);

      if (index === -1) return state;

      state[index] = {
        ...state[index],
        ...action.payload.parameters,
      };

      return state;
    }

    case ActionType.REMOVE_CONVERSATION: {
      conversationsMap.delete(action.payload);

      index = state.findIndex((conversation) => conversation.sid === action.payload);

      if (index !== -1) state.splice(index, 1);

      return state;
    }

    default:
      return state;
  }
};

export default reducer;
