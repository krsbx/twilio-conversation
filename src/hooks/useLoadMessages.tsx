import { useEffect, useMemo, useState } from 'react';
import { Message, Paginator } from '@twilio/conversations';
import { useDispatch } from 'react-redux';
import { CONVERSATION_PAGE_SIZE } from '../utils/constant';
import { addMessages } from '../store/actions/messages';
import { getConversationObject } from '../utils/chats/object';

const useLoadMessages = ({ messages, conversation }: Props) => {
  const dispatch = useDispatch();

  const [isReady, setIsReady] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(messages.length === CONVERSATION_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [paginator, setPaginator] = useState<Paginator<Message> | null>(null);

  const conversationObject = useMemo(() => {
    if (!conversation) return;

    return getConversationObject(conversation);
  }, [conversation?.sid]);

  useEffect(() => {
    let readyRef: NodeJS.Timer;

    (async () => {
      if (!conversationObject) return;

      const paginator = await conversationObject.getMessages(CONVERSATION_PAGE_SIZE);

      setHasNextPage(paginator.hasPrevPage);
      setPaginator(paginator);

      readyRef = setTimeout(() => {
        setIsReady(true);
      }, 3000);
    })();

    return () => {
      clearTimeout(readyRef);
    };
  }, [conversation]);

  const onLoadMore = async () => {
    if (!paginator || !conversation) return;

    const result = await paginator.prevPage();

    setIsLoading(true);
    setPaginator(result);
    setHasNextPage(result.hasPrevPage);
    addMessages(conversation.sid, result.items)(dispatch);
  };

  return {
    hasNextPage,
    setHasNextPage,
    isLoading,
    isReady,
    paginator,
    setPaginator,
    onLoadMore,
    conversationObject,
  };
};

type Props = {
  messages: ChatTemplate.Chats.Message[];
  conversation: ChatTemplate.Chats.Conversation | undefined;
};

export default useLoadMessages;
