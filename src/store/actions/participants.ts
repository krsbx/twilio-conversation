import { Participant } from '@twilio/conversations';
import { AppDispatch } from '..';
import { ParticipantsActionType as ActionType } from '../../types/enum';

export const updateParticipants =
  (participants: Participant[], sid: string) => (dispatch: AppDispatch) =>
    dispatch({
      type: ActionType.UPDATE_PARTICIPANTS,
      payload: { participants, sid },
    });
