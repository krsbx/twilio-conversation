import _ from 'lodash';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { createRef, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useMergeRefs,
} from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { connect, ConnectedProps } from 'react-redux';
import { Client as ConversationClient } from '@twilio/conversations';
import RoleBadge from './RoleBadge';
import { RootState } from '../store';
import { getAllUserChat as _getAllUser } from '../store/actions';
import { getCurrentConversation } from '../store/selectors/currentConversation';
import { getConversationById } from '../store/selectors/conversations';
import { getConversationObject } from '../utils/chats/object';
import CloseChatButton from './CloseChatButton';
import { getParticipantsByConversation } from '../store/selectors/participants';
import useWatchCookie from '../hooks/useWatchCookie';
import { createFullName } from '../utils/createFullName';
import { reassignRegisterControl } from '../utils/assign';
import { chakraSpace } from '../utils/customTheme';
import ChatMessageList from './ChatMessageList';

const ChatDetail = ({ onClose, conversation, participant, getAllUser }: Props) => {
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const fileRef = createRef<HTMLInputElement>();
  const messageRef = createRef<HTMLInputElement>();
  const fieldRef = createRef<HTMLDivElement>();
  const [user, setUser] = useState<ChatTemplate.Resource.User>();
  const { value: currentUser } = useWatchCookie<ChatTemplate.Resource.User>('userData');

  const conversationObject = useMemo(() => {
    if (!conversation) return;

    return getConversationObject(conversation);
  }, [conversation?.sid]);

  const {
    register: _register,
    formState: { isSubmitting },
    handleSubmit,
    setValue,
    watch,
    control,
  } = useForm<{ message: string; file: File }>({
    mode: 'onChange',
    defaultValues: {
      file: {} as File,
      message: '',
    },
  });

  const watchFile = watch('file');
  const watchMessage = watch('message');

  const register = reassignRegisterControl(_register, control, () => {
    if (!conversationObject) return;

    conversationObject.typing();
  });

  const registerMessage = register('message');
  const refs = useMergeRefs(registerMessage.ref, messageRef);

  const onSubmit = async (value: { message: string; file: File }) => {
    if (!conversationObject) return;

    const { message, file } = value;

    if (_.isEmpty(message) && _.isEmpty(file)) return;

    const newMessageBuilder = conversationObject.prepareMessage();

    if (!_.isEmpty(message)) newMessageBuilder.setBody(message);

    if (!_.isEmpty(file)) {
      const fileData = new FormData();

      fileData.set(file.name, file, file.name);
      newMessageBuilder.addMedia(fileData);
    }

    const messageIndex = await newMessageBuilder.build().send();

    try {
      await conversationObject.updateLastReadMessageIndex(messageIndex);

      setValue('message', '');
      setValue('file', {} as File);
    } catch {
      return Promise.reject('Something went wrong. Please try again.');
    }
  };

  const onPaperClipClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    file.preview = URL.createObjectURL(file);

    setValue('file', file);
  };

  const onEmojiClick = ({ emoji }: EmojiClickData) => {
    let selectionStart = -1;
    let selectionEnd = -1;

    if (messageRef.current) {
      const { selectionStart: _selectionStart, selectionEnd: _selectionEnd } = messageRef.current;

      if (!_.isNil(_selectionStart)) selectionStart = _selectionStart;
      if (!_.isNil(_selectionEnd)) selectionEnd = _selectionEnd;
    }

    let value = '';

    if (selectionStart === -1 && selectionEnd === -1) {
      value = `${watchMessage.trim()}${emoji}`;
    } else {
      value = watchMessage.slice(0, selectionStart) + emoji + watchMessage.slice(selectionEnd);
    }

    setValue('message', value);
  };

  useEffect(() => {
    if (!currentUser) return;
    if (!conversationObject) return;

    (async () => {
      const userSids = participant.filter((part) => part.identity !== currentUser.email);
      const filters = _.compact([userSids[0] && `email = "${userSids[0].identity}"`]).join('&');

      if (_.isEmpty(filters)) return;

      const [user] = await getAllUser(`filters=${filters}`);

      if (!user) return;
      setUser(user);
    })();
  }, [conversationObject, currentUser]);

  return (
    <Stack spacing={1} height={'100%'} position={'relative'}>
      <Stack
        borderBottom={'1px solid black'}
        bg={'lighterCustomGreen'}
        position={'relative'}
        alignItems={'center'}
        direction={'row'}
        height={'72px'}
        width={'100%'}
        p={3}
      >
        <Avatar
          size="sm"
          boxShadow="none"
          border="1px solid black"
          filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5))"
          src={
            user?.profilePictureId
              ? `${import.meta.env.NEXT_PUBLIC_API_URL}/users/${user?.id}/profile-pictures/file`
              : undefined
          }
        />
        <Text fontSize="16px" fontWeight="bold" fontFamily="Montserrat">
          {user ? createFullName(user) : ''}
        </Text>
        <RoleBadge isDriver />
        <CloseChatButton onClose={onClose} />
      </Stack>

      <ChatMessageList user={user} />

      {watchFile?.name ? (
        <Flex
          px={3}
          width={'100%'}
          borderTop={'1px solid black'}
          py={1}
          alignItems={'center'}
          position={'relative'}
        >
          <Text
            fontSize={'12px'}
            fontWeight="bold"
            fontFamily="Montserrat"
            whiteSpace={'nowrap'}
            width={`calc(100% - ${chakraSpace(6)})`}
            overflow={'hidden'}
            textOverflow={'ellipsis'}
            m={0}
            p={0}
          >
            {watchFile?.name ?? ''}
          </Text>
          <Box
            position={'absolute'}
            right={3}
            cursor={'pointer'}
            onClick={() => setValue('file', {} as File)}
          >
            <FaTimes size="16px" />
          </Box>
        </Flex>
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          templateColumns={'repeat(10, 1fr)'}
          alignItems={'center'}
          borderTop={'1px solid black'}
          ref={fieldRef}
        >
          <GridItem colSpan={9}>
            <Input
              variant={'tableInput'}
              height={'45px'}
              placeholder={'Write a message...'}
              {..._.omit(registerMessage, ['ref'])}
              ref={refs}
            />
          </GridItem>
          <GridItem>
            <Stack
              spacing={'0.25px'}
              direction={'row'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Popover
                returnFocusOnClose={false}
                onOpen={() => setIsEmojiOpen(true)}
                onClose={() => setIsEmojiOpen(false)}
              >
                <PopoverTrigger>
                  <Button
                    variant={'none'}
                    type={'button'}
                    _focus={{}}
                    color={isEmojiOpen ? 'customGreen' : 'black'}
                    _hover={{ color: 'customGreen' }}
                    px={2}
                  >
                    <HiOutlineEmojiHappy size={'26px'} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  backgroundColor={'transparent'}
                  width={'9.8rem'}
                  border={'none'}
                  _focus={{}}
                >
                  <Flex
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    position={'relative'}
                    overflow={'visible'}
                  >
                    <EmojiPicker
                      width={'300px'}
                      height={'300px'}
                      onEmojiClick={onEmojiClick}
                      emojiStyle={EmojiStyle.APPLE}
                      previewConfig={{
                        showPreview: false,
                      }}
                      skinTonesDisabled
                      lazyLoadEmojis
                    />
                  </Flex>
                </PopoverContent>
              </Popover>

              <Button
                _focus={{}}
                variant={'none'}
                px={2}
                type={'button'}
                onClick={() => fileRef.current?.click()}
                _hover={{ color: 'customGreen' }}
              >
                <AiOutlinePaperClip size={'25px'} />
              </Button>
              <Input ref={fileRef} type="file" display={'none'} onChange={onPaperClipClick} />
              <Button
                _focus={{}}
                variant={'none'}
                px={2}
                type={'submit'}
                isLoading={isSubmitting}
                color={'customGreen'}
              >
                <IoMdSend size={'25px'} />
              </Button>
            </Stack>
          </GridItem>
        </Grid>
      </form>
    </Stack>
  );
};

const mapStateToProps = (state: RootState) => {
  const conversationSid = getCurrentConversation(state);

  return {
    participant: getParticipantsByConversation(conversationSid)(state) ?? [],
    conversation: getConversationById(conversationSid)(state),
  };
};

const connector = connect(mapStateToProps, {
  getAllUser: _getAllUser,
});

type Props = ConnectedProps<typeof connector> & {
  onClose: () => void;
  client: ConversationClient | undefined;
};

export default connector(ChatDetail);
