import _ from 'lodash';
import { Conversation, Media, Message, Participant } from '@twilio/conversations';

export const conversationsMap = new Map<string, Conversation>();
export const participantsMap = new Map<string, Participant>();
export const messagesMap = new Map<string, Message>();
export const mediasMap = new Map<string, Media>();

const getObject = <T>(
  objectMap: Map<string, T>,
  sid: string,
  type: 'conversation' | 'message' | 'media' | 'participant'
): T => {
  const sdkObject = objectMap.get(sid);

  if (!sdkObject) {
    throw new Error(`${_.capitalize(type)} with SID ${sid} was not found.`);
  }

  return sdkObject;
};

export const getConversationObject = (conversation: ChatTemplate.Chats.Conversation) =>
  getObject(conversationsMap, conversation.sid, 'conversation');

export const getParticipantObject = (participant: ChatTemplate.Chats.Participant) =>
  getObject(participantsMap, participant.sid, 'participant');

export const getMessageObject = (message: ChatTemplate.Chats.Message) =>
  getObject(messagesMap, message.sid, 'message');

export const getMediaObject = (media: ChatTemplate.Chats.Media) =>
  getObject(mediasMap, media.sid, 'media');
