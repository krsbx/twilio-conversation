export type Conversation = {
  sid: string;
  friendlyName: string | null;
  dateUpdated: Date | null;
  notificationLevel: 'default' | 'muted';
  lastReadMessageIndex: number | null;
  lastMessage?: {
    index?: number;
    dateCreated?: Date;
  };
};

export type Participant = {
  sid: string;
  attributes: JSONValue;
  identity: string | null;
  type: ParticipantType;
  lastReadMessageIndex: number | null;
};

export type ParticipantRecord = Record<string, TimeDriver.Chats.Participant[]>;

export enum MessageStatus {
  Sending = 'Sending',
  Sent = 'Sent',
  Delivered = 'Delivered',
  Failed = 'Failed',
  None = 'none (incoming)',
  Read = 'Read',
}

export type Media = {
  sid: string;
  filename: string | null;
  contentType: string;
  size: number;
  category: 'media' | 'body' | 'history';
};

export type Message = {
  sid: string;
  index: number;
  body: string | null;
  author: string | null;
  attributes: JSONValue;
  participantSid: string | null;
  dateCreated: Date | null;
  attachedMedia: Media[] | null;
  aggregatedDeliveryReceipt: {
    total: number;
    sent: DeliveryAmount;
    delivered: DeliveryAmount;
    read: DeliveryAmount;
    undelivered: DeliveryAmount;
    failed: DeliveryAmount;
  } | null;
};

export type MessageRecord = Record<string, TimeDriver.Chats.Message[]>;
