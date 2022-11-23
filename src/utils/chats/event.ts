import { Client as ConversationClient, ConnectionState } from '@twilio/conversations';
import _ from 'lodash';
import { getNewChatToken as _getNewChatToken } from '../../store/actions';
import { isExpired } from '../jwt';
import cookieUtils from '../cookieUtils';
import { onConversationJoined, onConversationRemoved, onConversationUpdated } from './conversation';
import { onMessageAdded, onRemoveMessage } from './message';
import { onParticipantJoined, onParticipantLeft, onParticipantUpdate } from './participant';

export const onConnectionStateChanged = (state: ConnectionState) => {
  switch (state) {
    case 'connected':
      console.log('Conversation Connected Successfully!');
      break;

    case 'connecting':
      console.log('Connecting to Conversations...');
      break;

    case 'disconnected':
      console.log('Disconnected from the Conversation!');
      break;

    case 'disconnecting':
      console.log('Disconnecting from the Conversation...');
      break;

    case 'denied':
      console.log('Connection is Denied by the Server!');
      break;

    case 'error':
      console.log('An error occurs when connecting to Conversation!');
      break;

    default:
      break;
  }
};

export const handleChatEvent = async (
  conversationClient: React.MutableRefObject<ConversationClient | undefined>
) => {
  // Get the twilio token in the sessions
  let twilioToken = cookieUtils.getTwilioToken();
  const getNewChatToken = _getNewChatToken();

  // The token can be an empty string or having an undefined value
  // If it's an empty or an undefined value
  //  then the user twilio account is not activated
  if (_.isEmpty(twilioToken) || !twilioToken) return;

  // If the user twilio account activated by the token expired
  //  get the new token from the backend
  // We add this conditions since there is chances that the admin
  //  not log out from the systems after closing the tab then return to the page
  //  and want to chat somebody
  if (isExpired(twilioToken)) {
    twilioToken = await getNewChatToken();
  }

  if (!conversationClient.current) conversationClient.current = new ConversationClient(twilioToken);

  conversationClient.current.on('initialized', () => console.log('Conversation Initialized!'));
  conversationClient.current.on('connectionStateChanged', onConnectionStateChanged);

  // Handling conversation listener
  conversationClient.current.on('conversationJoined', onConversationJoined);
  conversationClient.current.on('conversationUpdated', onConversationUpdated);
  conversationClient.current.on('conversationRemoved', onConversationRemoved);

  // Handling participant listener
  conversationClient.current.on('participantJoined', onParticipantJoined);
  conversationClient.current.on('participantUpdated', onParticipantUpdate);
  conversationClient.current.on('participantLeft', onParticipantLeft);

  // Handling message listener
  conversationClient.current.on('messageAdded', onMessageAdded);
  conversationClient.current.on('messageUpdated', ({ message }) => {
    console.log(message);
  });
  conversationClient.current.on('messageRemoved', onRemoveMessage);

  conversationClient.current.on('tokenAboutToExpire', async () => {
    const token = await getNewChatToken();

    conversationClient.current?.removeAllListeners();
    conversationClient.current = await conversationClient.current?.updateToken(token);
  });
};
