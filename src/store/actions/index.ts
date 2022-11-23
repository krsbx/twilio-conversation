import { Conversation, Participant } from '@twilio/conversations';

import axios from '../axios';
import cookieUtils from '../../utils/cookieUtils';

export const createConversation = (targetId: number) => async () => {
  const { data } = await axios.post<{
    conversation: Conversation;
    participants: { userParticipant: Participant; targetParticipant: Participant };
  }>(`/chats/create-conversation`, {
    targetId,
  });

  return data;
};

export const getNewChatToken = () => async () => {
  const {
    data: { twilioToken },
  } = await axios.get<{ twilioToken: string }>('/chat-token');

  cookieUtils.setTwilioToken(twilioToken);

  return twilioToken;
};

export const getAllUserChat =
  (query = '') =>
  async () => {
    const { data } = await axios.get<ChatTemplate.Resource.User[]>(`/users?${query}`);

    return data;
  };
