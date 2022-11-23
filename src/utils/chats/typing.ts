import _ from 'lodash';
import { Conversation, Participant } from '@twilio/conversations';
import store, { AppDispatch } from '../../store';
import { endTyping, startTyping } from '../../store/actions/typingIndicator';
import cookieUtils from '../cookieUtils';

const updateTypingIndicator = (
  participant: Participant,
  sid: string,
  callback: (sid: string, user: string) => (dispatch: AppDispatch) => void
) => {
  const { identity, attributes } = participant;
  const { friendlyName } = attributes as { friendlyName?: string };

  if (participant.identity === cookieUtils.getUser()?.email) return;

  callback(sid, (!_.isEmpty(friendlyName) ? friendlyName : identity) ?? '')(store.dispatch);
};

export const onTypingStarted = (conversation: Conversation) => (participant: Participant) =>
  updateTypingIndicator(participant, conversation.sid, startTyping);
export const onTypingEnded = (conversation: Conversation) => (participant: Participant) =>
  updateTypingIndicator(participant, conversation.sid, endTyping);
