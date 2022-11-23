import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Circle,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { connect, ConnectedProps } from 'react-redux';
import { Client as ConversationClient } from '@twilio/conversations';
import { FaTimes, FaSearch } from 'react-icons/fa';
import cookieUtils from '../utils/cookieUtils';
import ChatDetail from './ChatDetail';
import ChatList from './ChatList';
import { handleChatEvent } from '../utils/chats/event';
import useDebounce from '../hooks/useDebounce';
import { createNameFilter } from '../utils/query';
import { RootState } from '../store';
import { getCurrentConversation } from '../store/selectors/currentConversation';
import CloseChatButton from './CloseChatButton';
import { getAllUserChat as _getAllUser } from '../store/actions';
import { updateCurrentConversation as _updateCurrentConversation } from '../store/actions/currentConversation';
import { setLastReadIndex as _setLastReadIndex } from '../store/actions/lastRead';

const ChatModal = ({
  isOpen,
  currentConversation,
  onClose: _onClose,
  getAllUser,
  setLastReadIndex,
  updateCurrentConversation,
}: Props) => {
  const [keyword, setKeyword] = useState('');
  const userId = cookieUtils.getUserId();
  const [users, setUsers] = useState<ChatTemplate.Resource.User[]>([]);
  const conversationClient = useRef<ConversationClient>();
  const inConversation = useMemo(() => currentConversation.trim() !== '', [currentConversation]);

  const onClose = () => {
    updateCurrentConversation('');
    setLastReadIndex(-1);
    _onClose();
  };

  useEffect(() => {
    if (conversationClient.current) return;

    handleChatEvent(conversationClient);

    return () => {
      if (!conversationClient.current) return;

      conversationClient.current.removeAllListeners();
    };
  }, []);

  useDebounce(async () => {
    if (!isOpen) return;
    if (_.isEmpty(keyword)) {
      setUsers([]);
      return;
    }

    const nameFilter = createNameFilter(keyword);

    const filters = _.compact([
      userId && `id != ${userId}`,
      nameFilter && `(${createNameFilter(keyword)})`,
    ]).join(' and ');

    const query = _.compact([filters && `filters=${filters}`, 'includes=rider,driver']).join('&');

    setUsers(await getAllUser(query));
  }, [keyword]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="auto"
      closeOnOverlayClick
      allowPinchZoom
      isCentered
      closeOnEsc
    >
      <ModalOverlay />
      <ModalContent
        width={inConversation ? '1052px' : '357px'}
        transition={inConversation ? 'none' : 'all 0.15s ease-in-out'}
      >
        <ModalBody p={0}>
          <Stack direction={'row'} spacing={0} height={'567px'}>
            <Box width={'357px'} height={'100%'} border={'1px solid black'}>
              <Box height={'fit-content'}>
                <Flex
                  p={3}
                  width={'100%'}
                  height={'72px'}
                  alignItems={'center'}
                  bg={'lighterCustomGreen'}
                  borderBottom={'1px solid black'}
                >
                  <Text fontSize="24px" fontWeight="bold" fontFamily="MBFUltra">
                    Messages
                  </Text>
                  {!inConversation && <CloseChatButton onClose={onClose} />}
                </Flex>
                <InputGroup width={'100%'} borderBottom={'1px solid black'}>
                  <Input
                    variant={'tableInput'}
                    height={'45px'}
                    placeholder={'Search for a Time Driver or Time Rider...'}
                    onChange={(e) => setKeyword(e.target.value)}
                    value={keyword}
                  />
                  <InputRightElement color={'blackAlpha.400'}>
                    {keyword.length > 0 ? (
                      <Circle
                        cursor={'pointer'}
                        bg={'blackAlpha.300'}
                        borderRadius={'full'}
                        _hover={{
                          bg: 'blackAlpha.400',
                        }}
                        _focus={{
                          boxShadow: 'none',
                          bg: 'blackAlpha.400',
                        }}
                        color={'white'}
                        p={1}
                        onClick={() => setKeyword('')}
                      >
                        <FaTimes size={'10px'} />
                      </Circle>
                    ) : (
                      <FaSearch />
                    )}
                  </InputRightElement>
                </InputGroup>
              </Box>

              <Flex overflow={'auto'} height={`450px`} flexDirection={'column'}>
                <ChatList
                  client={conversationClient.current}
                  setKeyword={setKeyword}
                  keyword={keyword}
                  users={users}
                />
              </Flex>
            </Box>

            {inConversation && (
              <Box width={'695px'} border={'1px solid black'} borderLeft={'none'} height={'100%'}>
                <ChatDetail client={conversationClient.current} onClose={onClose} />
              </Box>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentConversation: getCurrentConversation(state),
});

const connector = connect(mapStateToProps, {
  updateCurrentConversation: _updateCurrentConversation,
  setLastReadIndex: _setLastReadIndex,
  getAllUser: _getAllUser,
});

type Props = ConnectedProps<typeof connector> & {
  isOpen: boolean;
  onClose: () => void;
};

export default connector(ChatModal);
