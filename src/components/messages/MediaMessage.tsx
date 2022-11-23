import { createRef, forwardRef, useCallback, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { IoMdDocument } from 'react-icons/io';
import { ImCloudDownload } from 'react-icons/im';
import { Box, Circle, Flex, GridItem, Text } from '@chakra-ui/react';
import useWidthObserver from '../../hooks/useWidthObserver';
import MessageImage from './MessageImage';
import { downloadBlob, saveFile } from '../../utils/common';
import { getMediaUrl } from '../../utils/chats/helper';

const MediaMessage = forwardRef<HTMLDivElement, Props>(
  ({ message, showTime = false, incoming, onOpen, setImageUrl, onDownloadCb }, ref) => {
    const timeRef = createRef<HTMLParagraphElement>();
    const width = useWidthObserver(timeRef);
    const media = message.attachedMedia?.[0];
    const filename = media?.filename ?? '';
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const alignment = incoming ? 'left' : 'right';
    const noneRadius = incoming ? 'borderTopLeftRadius' : 'borderTopRightRadius';
    const isImage = media?.contentType.includes('image') ?? false;
    const mainContainerStyle = {
      justifyContent: alignment,
      [incoming ? 'pl' : 'pr']: 3,
    };
    const containerStyle = {
      bgColor: incoming ? 'gray.200' : 'lighterCustomGreen',
      justifyContent: alignment,
      [noneRadius]: 'none',
    };
    const timeStyle = {
      fontFamily: 'Montserrat',
      [incoming ? 'right' : 'left']: `calc(calc(${width}px + 5px) * -1)`,
    };

    const onDownload = useCallback(async () => {
      try {
        const url = await getMediaUrl(media);

        if (!url) return;

        setIsDownloading(true);

        const blob = await downloadBlob(url, {
          onDownloadProgress: (event) => {
            if (_.isNil(event.total)) return;

            setDownloadProgress(Math.round((event.loaded * 100) / event.total));
          },
        });

        saveFile(blob, filename);
        setIsDownloading(false);
      } finally {
        setIsDownloading(false);
        setDownloadProgress(0);
      }
    }, []);

    const onImageDownload = useCallback(async () => {
      const url = await getMediaUrl(media);

      if (!url) return;

      const blob = await downloadBlob(url, {
        onDownloadProgress: (event) => {
          if (_.isNil(event.total)) return;

          setDownloadProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      saveFile(blob, filename);
    }, []);

    const onClick = useCallback(async () => {
      if (!isImage) return onDownload();

      const url = await getMediaUrl(media);

      if (!url) return;

      setImageUrl(url);

      onDownloadCb.current = async () => onImageDownload();

      onOpen();
    }, [isImage]);

    return (
      <GridItem colSpan={4} id={message.sid} ref={ref}>
        <Flex width={'100%'} py={1} {...mainContainerStyle}>
          <Box
            width={'min(30%, 50%)'}
            overflowX={'visible'}
            position={'relative'}
            borderRadius={'lg'}
            p={2}
            {...containerStyle}
          >
            <Flex justifyContent={'center'} mb={2}>
              <Flex
                cursor={'pointer'}
                _hover={{
                  color: 'blackAlpha.600',
                }}
                transition={'all 0.2s ease-in-out'}
                onClick={onClick}
                position={'relative'}
              >
                {isImage ? <MessageImage message={message} /> : <IoMdDocument size={'60px'} />}

                {!isDownloading ? (
                  !isImage && (
                    <Circle
                      position={'absolute'}
                      right={1}
                      bottom={-1}
                      size={'20px'}
                      backgroundColor={containerStyle.bgColor}
                    >
                      <ImCloudDownload color={'black'} />
                    </Circle>
                  )
                ) : (
                  <Flex
                    position={'absolute'}
                    bottom={0}
                    left={0}
                    borderWidth={'3px'}
                    borderRadius={'lg'}
                    borderColor={!incoming ? 'gray.200' : 'lighterCustomGreen'}
                    width={`${downloadProgress}%`}
                    transition={'all 0.2 ease-in-out'}
                  />
                )}
              </Flex>
            </Flex>
            <Flex>
              {showTime && (
                <Text
                  fontSize={'12px'}
                  position={'absolute'}
                  bottom={0}
                  ref={timeRef}
                  {...timeStyle}
                >
                  {moment(message.dateCreated).format('HH:mm')}
                </Text>
              )}
              {!isImage && (
                <Text
                  fontSize={'12px'}
                  fontWeight="bold"
                  fontFamily="Montserrat"
                  fontStyle={'italic'}
                  mb={_.isEmpty(message.body) ? 0 : 1}
                >
                  {message.attachedMedia?.[0]?.filename}
                </Text>
              )}
            </Flex>
            <Text fontSize={'12px'} fontWeight="bold" fontFamily="Montserrat">
              {message.body}
            </Text>
          </Box>
        </Flex>
      </GridItem>
    );
  }
);

MediaMessage.displayName = 'MediaMessage';

type Props = {
  message: ChatTemplate.Chats.Message;
  incoming: boolean;
  showTime?: boolean;
  id?: string;
  onOpen: () => void;
  setImageUrl: ReactSetter<string>;
  onDownloadCb: React.MutableRefObject<() => Promise<void> | void>;
};

export default MediaMessage;
