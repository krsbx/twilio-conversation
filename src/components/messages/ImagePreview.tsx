import { Box, Button, Image, Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ImCloudDownload } from 'react-icons/im';

const ImagePreview = ({ isOpen, onClose, imageUrl, onDownloadCb }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

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
      <ModalContent width={'55vw'} position={'relative'}>
        <ModalBody display={'flex'} justifyContent={'center'} alignItems={'center'} p={1}>
          <Box
            position={'fixed'}
            top={0}
            width={'100vw'}
            display={'flex'}
            justifyContent={'flex-end'}
            p={2}
          >
            <Button
              backgroundColor={'whiteAlpha.900'}
              _hover={{ backgroundColor: 'whiteAlpha.800' }}
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await onDownloadCb();
                } finally {
                  setIsLoading(false);
                }
              }}
              isLoading={isLoading}
            >
              <ImCloudDownload color={'black'} />
            </Button>
            )
            <Button
              backgroundColor={'whiteAlpha.900'}
              _hover={{ backgroundColor: 'whiteAlpha.800' }}
              onClick={onClose}
            >
              <FaTimes color={'black'} />
            </Button>
          </Box>
          <Image src={imageUrl} alt={''} width={'55vw'} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onDownloadCb: () => Promise<void> | void;
};

export default ImagePreview;
