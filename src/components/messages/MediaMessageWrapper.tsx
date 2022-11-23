import _ from 'lodash';
import { createRef, useEffect } from 'react';
import MessageWithDate from './MessageWithDate';
import useIsInViewport from '../../hooks/useIsInViewport';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store';
import { getLastReadIndex } from '../../store/selectors/lastRead';
import { setLastReadIndex as _setLastReadIndex } from '../../store/actions/lastRead';
import MediaMessage from './MediaMessage';
import { getMessagesByConversation } from '../../store/selectors/messages';
import { getCurrentConversation } from '../../store/selectors/currentConversation';
import { updateUnreadMessages as _updateUnreadMessages } from '../../store/actions/unreadMessages';
import { getUnreadMessageByConversation } from '../../store/selectors/unreadMessages';

const MediaMessageWrapper = ({
  message,
  messages,
  showTime = false,
  showDate = false,
  incoming = false,
  lastReadIndex,
  currentConversation,
  unreadMessage,
  setLastReadIndex,
  onOpen,
  setImageUrl,
  updateUnreadMessages,
  onDownloadCb,
}: Props) => {
  const ref = createRef<HTMLDivElement>();
  const isInView = useIsInViewport(ref);

  const callback = _.debounce(() => {
    const currentIndex = messages.findIndex((msg) => msg.sid === message.sid);

    if (currentIndex === -1 || currentIndex !== messages.length - 1) return;

    document.getElementById(message.sid)?.scrollIntoView({
      behavior: 'smooth',
    });
  }, 1000);

  useEffect(() => {
    if (!isInView) return;

    if (lastReadIndex > message.index) return;

    setLastReadIndex(message.index);
    updateUnreadMessages(currentConversation, _.min([unreadMessage - 1, 0]) ?? 0);
  }, [isInView]);

  useEffect(() => {
    callback();
  }, []);

  if (showDate) {
    return (
      <MessageWithDate message={message} id={message.sid} ref={ref}>
        <MediaMessage
          message={message}
          showTime={showTime}
          incoming={incoming}
          onOpen={onOpen}
          setImageUrl={setImageUrl}
          onDownloadCb={onDownloadCb}
        />
      </MessageWithDate>
    );
  }

  return (
    <MediaMessage
      message={message}
      showTime={showTime}
      incoming={incoming}
      id={message.sid}
      onOpen={onOpen}
      setImageUrl={setImageUrl}
      onDownloadCb={onDownloadCb}
      ref={ref}
    />
  );
};

const mapStateToProps = (state: RootState) => {
  const currentConversation = getCurrentConversation(state);

  return {
    messages: getMessagesByConversation(currentConversation)(state),
    lastReadIndex: getLastReadIndex(state),
    unreadMessage: getUnreadMessageByConversation(currentConversation)(state),
    currentConversation,
  };
};

const connector = connect(mapStateToProps, {
  updateUnreadMessages: _updateUnreadMessages,
  setLastReadIndex: _setLastReadIndex,
});

type Props = ConnectedProps<typeof connector> & {
  message: ChatTemplate.Chats.Message;
  incoming?: boolean;
  showTime?: boolean;
  showDate?: boolean;
  id?: string;
  onOpen: () => void;
  setImageUrl: ReactSetter<string>;
  onDownloadCb: React.MutableRefObject<() => Promise<void> | void>;
};

export default connector(MediaMessageWrapper);
