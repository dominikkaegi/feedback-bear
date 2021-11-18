import { OrderedList, ListItem, Text, Box } from '@chakra-ui/react';
import { InferGetServerSidePropsType } from 'next'
import { getFeedbacks } from '../domain/services/feedbackService';
import { userIdOfRequest } from '../helpers/authentication';

export const getServerSideProps = async (context: any) => {
    const userId = await userIdOfRequest(context.req, context.res)
    if (!userId) {
      throw new Error('Not authenticated')
    }
    const feedbacks = await getFeedbacks(userId)

    return {
        props: { feedbacks: feedbacks }, // will be passed to the page component as props
    }
}


export default function getFeedbackList({ feedbacks }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <Box textAlign="center" py={10} px={6}>

            <OrderedList>
                {feedbacks.map(feedback => { return <ListItem>{feedback.title} - {feedback.description}</ListItem> })}
            </OrderedList>
        </Box>
    );
}