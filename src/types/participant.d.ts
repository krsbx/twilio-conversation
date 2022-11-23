import { Participant } from '@twilio/conversations';
import { ParticipantsActionType as ActionType } from './enum';

export type UpdateParticipants = {
  type: ActionType.UPDATE_PARTICIPANTS;
  payload: { participants: Participant[]; sid: string };
};
