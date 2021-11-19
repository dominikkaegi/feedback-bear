import { Feedback } from '.prisma/client';
import { EditIcon, CloseIcon } from '@chakra-ui/icons';
import { Badge } from '@chakra-ui/layout';
import {
  Flex,
  IconButton,
  useColorModeValue,
  Text,
  Box,
} from '@chakra-ui/react';
import {
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from '@chakra-ui/table';

const FeedbackListItem: React.VFC<{
  feedback: Feedback;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ feedback, onDelete, onEdit }) => {
  return (
    <Tr>
      <Td>{feedback.title}</Td>
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
        <Flex>
          <IconButton
            onClick={onEdit}
            size="sm"
            colorScheme="blue"
            aria-label="edit"
            fontSize="10px"
            icon={<EditIcon />}
            mr={2}
          />
          <IconButton
            onClick={onDelete}
            size="sm"
            variant="outline"
            colorScheme="blue"
            aria-label="delete"
            fontSize="10px"
            icon={<CloseIcon />}
          />
        </Flex>
      </Td>
    </Tr>
  );
};

export const FeedbackList: React.VFC<{
  feedbacks: Feedback[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}> = ({ feedbacks, onDelete, onEdit }) => {
  return (
    <Box borderRadius="md" border="1px" borderColor="gray.200" padding="10px">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Tags</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {feedbacks.map((feedback) => (
            <FeedbackListItem
              key={feedback.id}
              feedback={feedback as Feedback}
              onDelete={() => onDelete(feedback.id)}
              onEdit={() => onEdit(feedback.id)}
            />
          ))}
        </Tbody>
      </Table>
      {feedbacks.length === 0 ? (
        <Box pt="30px" pb="30px">
          <Text textAlign="center">No feedbacks yet ☠️</Text>
        </Box>
      ) : null}
    </Box>
  );
};
