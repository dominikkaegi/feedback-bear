import { OrderedList, ListItem, Text, Box } from '@chakra-ui/react';
import { InferGetServerSidePropsType } from 'next'
import { getFeedback } from '../../domain/services/feedbackService';
import { userIdOfRequest } from '../../helpers/authentication';

export const getServerSideProps = async (context: any) => {
    const userId = await userIdOfRequest(context.req, context.res)
    if (!userId) {
      throw new Error('Not authenticated')
    }
    const feedback = await getFeedback(userId, Number.parseInt(context.params.id))

    return {
        props: { feedback: feedback }, // will be passed to the page component as props
    }
}


export default function getFeedbackList({ feedback }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <Box textAlign="center" py={10} px={6}>
            <Text>{feedback?.title}</Text>
            <Text>{feedback?.description}</Text>
            <OrderedList>
                {feedback?.steps.map(step => { return <ListItem>{step.type} - {step.content}</ListItem> })}
            </OrderedList>
        </Box>
    );
}