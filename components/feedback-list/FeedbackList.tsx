import { Feedback } from '.prisma/client';
import { Button } from '@chakra-ui/button';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { Badge } from '@chakra-ui/layout';
import {
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Tfoot,
} from '@chakra-ui/table';

const feedbacks: Array<Partial<Feedback>> = [
  {
    id: 1234,
    title: 'Dominiks Feedback',
    description: 'This is a description of the feedback',
    tags: ['tag1', 'tag2', 'tag3'],
  },
  {
    id: 1235,
    title: 'Jerome Feedback',
    description: 'This is a description of the feedback',
    tags: ['tag1', 'tag2', 'tag3'],
  },
];

const FeedbackListItem: React.VFC<{ feedback: Feedback }> = ({ feedback }) => {
  return (
    <Tr>
      <Td>{feedback.title}</Td>
      <Td>{feedback.description}</Td>
      <Td>
        {feedback.tags.map((tag) => (
          <Badge
            px={2}
            py={1}
            m={1}
            bg={useColorModeValue('blue.50', 'blue.800')}
            fontWeight={'400'}
          >
            {tag}
          </Badge>
        ))}
      </Td>
      <Td>
        <Button>Edit</Button>
      </Td>
    </Tr>
  );
};

export const FeedbackListW: React.VFC<{ feedbacks: Feedback[] }> = ({
  feedbacks,
}) => {
  return (
    <Table
      variant="simple"
      borderTopRadius="md"
      border="1px"
      borderColor="gray.200"
    >
      <TableCaption>Your Feedbacks</TableCaption>
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Description</Th>
          <Th>Tags</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {feedbacks.map((feedback) => (
          <FeedbackListItem key={feedback.id} feedback={feedback as Feedback} />
        ))}
      </Tbody>
    </Table>
  );
};

export const FeedbackList = () => {
  return <FeedbackListW feedbacks={feedbacks as Feedback[]} />;
};
