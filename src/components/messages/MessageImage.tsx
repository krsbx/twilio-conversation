import { Image } from '@chakra-ui/react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { GoFileMedia } from 'react-icons/go';
import { mediasMap } from '../../utils/chats/object';

const MessageImage = ({ message }: Props) => {
  const [url, setUrl] = useState('');
  const media = message.attachedMedia?.[0];

  useEffect(() => {
    (async () => {
      if (!media) return;

      const mediaObject = mediasMap.get(media.sid);

      if (!mediaObject) return;

      const url = await mediaObject.getContentTemporaryUrl();

      if (!url) return;

      setUrl(url);
    })();
  }, []);

  if (!media || _.isEmpty(url)) return <GoFileMedia size={'60px'} />;

  return <Image src={url} alt={''} height={'60px'} />;
};

type Props = {
  message: ChatTemplate.Chats.Message;
};

export default MessageImage;
