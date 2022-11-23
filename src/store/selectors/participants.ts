import { RootState } from '..';

export const getParticipants = (state: RootState) => state.participants;

export const getParticipantsByConversation = (conversationId: string) => (state: RootState) =>
  state.participants[conversationId];

export const getParticipant =
  (conversationId: string, participantId: string) => (state: RootState) =>
    state.participants[conversationId].find((participant) => participant.sid === participantId);
