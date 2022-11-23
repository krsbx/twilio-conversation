import moment from 'moment';
import { mediasMap } from './object';

type DateTimeParams = {
  index: number;
  messages: ChatTemplate.Chats.Message[];
};

export const isShouldShowTime = ({ index, messages }: DateTimeParams) => {
  const message = messages[index];
  const prevMessage = messages[index - 1];
  const nextMessage = messages[index + 1];

  if (index === messages.length - 1) return true;

  if (prevMessage && nextMessage) {
    const isPrevSameAuthor = prevMessage.author === message.author;
    const isNextSameAuthor = nextMessage.author === message.author;
    const isPrevSameDate = moment(prevMessage.dateCreated).isSame(message.dateCreated, 'D');
    const isNextSameDate = moment(nextMessage.dateCreated).isSame(message.dateCreated, 'D');

    if (isNextSameDate) {
      if (isPrevSameAuthor && isNextSameAuthor) return false;
      if (!isPrevSameAuthor && isNextSameAuthor) return false;
      if (isPrevSameAuthor && !isNextSameAuthor) return true;
    }

    if (isPrevSameDate) {
      if (!isPrevSameAuthor && isNextSameAuthor) return true;
      if (isPrevSameAuthor && isNextSameAuthor) return true;
    }

    if (!isPrevSameAuthor && isNextSameAuthor) return false;
    if (isPrevSameAuthor && !isNextSameAuthor) return true;
    return true;
  }

  if (prevMessage) {
    const isPrevSameAuthor = prevMessage.author === message.author;

    return isPrevSameAuthor;
  }

  if (nextMessage) {
    const isNextSameAuthor = nextMessage.author === message.author;

    return !isNextSameAuthor;
  }
};

export const isShouldShowDate = ({ index, messages }: DateTimeParams) => {
  const message = messages[index];
  const prevMessage = messages[index - 1];
  const nextMessage = messages[index + 1];

  if (index === messages.length - 1) {
    if (prevMessage) {
      const isPrevSameDate = moment(prevMessage.dateCreated).isSame(message.dateCreated, 'D');

      return !isPrevSameDate;
    }

    return false;
  }

  if (prevMessage && nextMessage) {
    const isPrevSameDate = moment(prevMessage.dateCreated).isSame(message.dateCreated, 'D');
    const isNextSameDate = moment(nextMessage.dateCreated).isSame(message.dateCreated, 'D');

    if (isPrevSameDate && isNextSameDate) {
      return false;
    }

    if (isPrevSameDate && !isNextSameDate) {
      return false;
    }

    if (!isPrevSameDate && isNextSameDate) {
      return true;
    }

    return false;
  }

  if (prevMessage) {
    const isPrevSameDate = moment(prevMessage.dateCreated).isSame(message.dateCreated, 'D');

    return !isPrevSameDate;
  }

  if (nextMessage) {
    const isNextSameDate = moment(nextMessage.dateCreated).isSame(message.dateCreated, 'D');

    return isNextSameDate;
  }
};

export const getMediaUrl = async (media: ChatTemplate.Chats.Media | undefined) => {
  if (!media) return;

  const mediaObject = mediasMap.get(media.sid);

  if (!mediaObject) return;

  const url = await mediaObject.getContentTemporaryUrl();

  return url;
};
