import { OrderedList, ListItem, Text, Box } from '@chakra-ui/react';
import NextLink from 'next/link'
import prisma from '../prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getFeedbacks } from '../domain/services/feedbackService';

export const getServerSideProps = async () => {
    const userId = 1
    const feedbacks = await getFeedbacks(userId)

    return {
        props: { x: 1, feedbacks: feedbacks }, // will be passed to the page component as props
    }
}


export default function getFeedbackList({ x, feedbacks }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <Box textAlign="center" py={10} px={6}>

            <Text fontSize="18px" mt={3} mb={2}>
                {x}
            </Text>

            <OrderedList>
                {feedbacks.map(feedback => { return <ListItem>{feedback.title} - {feedback.description}</ListItem> })}
            </OrderedList>
        </Box>
    );
}