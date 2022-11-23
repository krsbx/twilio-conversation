import _ from 'lodash';
import { Box, Flex, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import { createRef, useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useWatchCookie from '../../hooks/useWatchCookie';
import { RootState } from '../../store';
import { getCurrentConversation } from '../../store/selectors/currentConversation';
import { getMessagesByConversation } from '../../store/selectors/messages';
import { getConversationById } from '../../store/selectors/conversations';
import { loadMessages } from '../../utils/chats/message';
import { isShouldShowDate, isShouldShowTime } from '../../utils/chats/helper';
import { getLastReadIndex } from '../../store/selectors/lastRead';
import { setLastReadIndex as _setLastReadIndex } from '../../store/actions/lastRead';
import MediaMessageWrapper from './MediaMessageWrapper';
import MessageWrapper from './MessageWrapper';
import ImagePreview from './ImagePreview';
import useLoadMessages from '../../hooks/useLoadMessages';
import LoadingSpinner from '../LoadingSpinner';

const MessageList = ({ conversation, messages, lastReadIndex, setLastReadIndex }: Props) => {
  const listRef = createRef<HTMLDivElement>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onDownloadCb = useRef<() => Promise<void> | void>(() => {});
  const [imageUrl, setImageUrl] = useState('');
  const { value: userData } = useWatchCookie<ChatTemplate.Resource.User>('userData');

  const { hasNextPage, isLoading, isReady, conversationObject, onLoadMore } = useLoadMessages({
    messages,
    conversation,
  });

  const [sentryRef] = useInfiniteScroll({
    disabled: !hasNextPage,
    loading: isLoading,
    hasNextPage,
    onLoadMore,
  });

  useEffect(() => {
    if (!_.isEmpty(messages)) return;
    if (!conversation) return;

    loadMessages(conversation);
  }, []);

  useEffect(() => {
    if (!conversationObject || !messages || !messages.length) return;

    if (messages[messages.length - 1].index === -1) return;

    conversationObject.updateLastReadMessageIndex(messages[messages.length - 1].index);
  }, [messages, conversationObject]);

  useEffect(() => {
    if (!conversationObject || !messages || !messages.length) return;

    (async () => {
      const lastMessage = messages[messages.length - 1];
      const lastReadInChat = lastMessage.index;

      if (lastReadInChat === lastReadIndex) return;

      setLastReadIndex(lastReadInChat);
    })();
  }, [messages, conversationObject]);

  return (
    <>
      <Box flex={1} overflow={'auto'}>
        <Flex flexDirection={'column'} width={'100%'} height={'100%'} id="scrollable">
          <Box ref={listRef} overflow={'auto'}>
            <Grid
              templateColumns={'repeat(4, 1fr)'}
              alignItems={'center'}
              p={'2px'}
              rounded={'xl'}
              height={'100%'}
            >
              {!isLoading && hasNextPage && isReady && (
                <GridItem colSpan={4} ref={sentryRef}>
                  <LoadingSpinner />
                </GridItem>
              )}
              {_.map(messages, (message, index) => {
                const showTime = isShouldShowTime({ messages, index });
                const showDate = isShouldShowDate({ messages, index });
                const isMedia = message.attachedMedia?.length;
                const isOutgoing = message.author === userData?.email;

                if (isMedia) {
                  return (
                    <MediaMessageWrapper
                      message={message}
                      key={message.sid}
                      setImageUrl={setImageUrl}
                      showTime={showTime}
                      showDate={showDate}
                      incoming={!isOutgoing}
                      onDownloadCb={onDownloadCb}
                      onOpen={onOpen}
                    />
                  );
                }

                return (
                  <MessageWrapper
                    message={message}
                    key={message.sid}
                    showTime={showTime}
                    showDate={showDate}
                    incoming={!isOutgoing}
                  />
                );
              })}
            </Grid>
          </Box>
        </Flex>
      </Box>
      <ImagePreview
        isOpen={isOpen}
        onClose={onClose}
        imageUrl={imageUrl}
        onDownloadCb={onDownloadCb.current}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  const conversationSid = getCurrentConversation(state);

  return {
    messages: getMessagesByConversation(conversationSid)(state),
    conversation: getConversationById(conversationSid)(state),
    lastReadIndex: getLastReadIndex(state),
    conversationSid,
  };
};

const connector = connect(mapStateToProps, {
  setLastReadIndex: _setLastReadIndex,
});

type Props = ConnectedProps<typeof connector>;

export default connector(MessageList);
