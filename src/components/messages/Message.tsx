import { createRef, forwardRef } from 'react';
import moment from 'moment';
import { Flex, GridItem, Text } from '@chakra-ui/react';
import useWidthObserver from '../../hooks/useWidthObserver';

const Message = forwardRef<HTMLDivElement, Props>(
  ({ message, showTime = false, incoming }, ref) => {
    const timeRef = createRef<HTMLParagraphElement>();
    const width = useWidthObserver(timeRef);
    const alignment = incoming ? 'left' : 'right';
    const noneRadius = incoming ? 'borderTopLeftRadius' : 'borderTopRightRadius';
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

    return (
      <GridItem colSpan={4} id={message.sid} ref={ref}>
        <Flex width={'100%'} py={1} {...mainContainerStyle}>
          <Flex
            minWidth={'25%'}
            maxWidth={'50%'}
            overflowX={'visible'}
            position={'relative'}
            borderRadius={'lg'}
            p={2}
            {...containerStyle}
          >
            {showTime && (
              <Text fontSize={'12px'} position={'absolute'} bottom={0} ref={timeRef} {...timeStyle}>
                {moment(message.dateCreated).format('HH:mm')}
              </Text>
            )}
            <Text
              fontSize={'12px'}
              fontWeight="bold"
              fontFamily="Montserrat"
              whiteSpace={'initial'}
              width={'100%'}
            >
              {message.body}
            </Text>
          </Flex>
        </Flex>
      </GridItem>
    );
  }
);

Message.displayName = 'Message';

type Props = {
  message: ChatTemplate.Chats.Message;
  incoming: boolean;
  showTime?: boolean;
  id?: string;
};

export default Message;
