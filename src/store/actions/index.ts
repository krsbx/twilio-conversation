import axios from '../axios';
import cookieUtils from '../../utils/cookieUtils';

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
    const { data } = await axios.get<unknown[]>(`/users?${query}`);

    return data;
  };
