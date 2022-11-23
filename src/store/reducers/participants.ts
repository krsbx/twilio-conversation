import { ParticipantsActionType as ActionType } from '../../types/enum';
import { participantsMap } from '../../utils/chats/object';
import { transformParticipant } from '../../utils/chats/participant';

const reducer = (
  state: ChatTemplate.Chats.ParticipantRecord = {},
  action: ChatTemplate.Participant.UpdateParticipants
): ChatTemplate.Chats.ParticipantRecord => {
  switch (action.type) {
    case ActionType.UPDATE_PARTICIPANTS: {
      // Update the participantes map with the new participant object
      for (const participant of action.payload.participants) {
        participantsMap.set(action.payload.sid, participant);
      }

      return {
        ...state,
        [action.payload.sid]: action.payload.participants.map(transformParticipant),
      };
    }

    default:
      return state;
  }
};

export default reducer;
