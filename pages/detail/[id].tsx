import { OrderedList, ListItem, Text, Box } from '@chakra-ui/react';
import NextLink from 'next/link'
import prisma from '../../prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getFeedback } from '../../domain/services/feedbackService';

export const getServerSideProps = async (context) => {
    console.log(context.params)
    const userId = 1
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