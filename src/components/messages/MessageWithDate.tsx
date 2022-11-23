import { forwardRef } from 'react';
import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import moment from 'moment';

const MessageWithDate = forwardRef<HTMLDivElement, Props>(({ message, children, id }, ref) => {
  return (
    <GridItem colSpan={4} id={id} ref={ref}>
      <Flex rowGap={1} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
        <Flex justifyContent={'center'} alignItems={'center'}>
          <Text py={1} px={2} fontSize={'12px'} bgColor={'gray.200'} borderRadius={'lg'}>
            {moment(message.dateCreated).format('DD/MM/YYYY')}
          </Text>
        </Flex>
        <Grid
          templateColumns={'repeat(4, 1fr)'}
          alignItems={'center'}
          p={'2px'}
          rounded={'xl'}
          width={'100%'}
        >
          {children}
        </Grid>
      </Flex>
    </GridItem>
  );
});

MessageWithDate.displayName = 'MessageWithDate';

type Props = {
  message: ChatTemplate.Chats.Message;
  children: React.ReactNode;
  id?: string;
};

export default MessageWithDate;
