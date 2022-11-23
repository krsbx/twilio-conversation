import _ from 'lodash';
import { Participant, ParticipantUpdateReason } from '@twilio/conversations';
import store from '../../store';
import { updateParticipants } from '../../store/actions/participants';

export const transformParticipant = (participant: Participant): ChatTemplate.Chats.Participant =>
  _.pick(participant, ['sid', 'attributes', 'identity', 'type', 'lastReadMessageIndex']);

export const onParticipantLeft = async (participant: Participant) => {
  const { conversation } = participant;

  const participants = await conversation.getParticipants();
  updateParticipants(participants, conversation.sid)(store.dispatch);
};

export const onParticipantUpdate = ({
  participant,
}: {
  participant: Participant;
  updateReasons: ParticipantUpdateReason[];
}) => onParticipantLeft(participant);

export const onParticipantJoined = (participant: Participant) => onParticipantLeft(participant);
