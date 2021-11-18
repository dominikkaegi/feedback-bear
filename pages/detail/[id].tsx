import { OrderedList, ListItem, Text, Box, FormLabel, Input, Textarea, Button } from '@chakra-ui/react';
import NextLink from 'next/link'
import prisma from '../../prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getFeedback } from '../../domain/services/feedbackService';
import { userIdOfRequest } from '../../helpers/authentication';
import { FeedbackStepType } from '.prisma/client';

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



            <form onSubmit={onFormSubmit}>
                <Input type="number" name="id" defaultValue={feedback?.id} visibility="hidden" />
                <FormLabel>Title</FormLabel>
                <Input type="text" name="title" defaultValue={feedback?.title} />
                <FormLabel>Description</FormLabel>
                <Input type="text" name="description" defaultValue={feedback?.description} />


                <FormLabel>Intention</FormLabel>
                <Textarea type="text" name="intention" defaultValue={feedback?.steps.filter(step => step.type === FeedbackStepType.INTENTION)[0].content} />
                <FormLabel>Observation</FormLabel>
                <Textarea type="text" name="observation" defaultValue={feedback?.steps.filter(step => step.type === FeedbackStepType.OBSERVATION)[0].content} />
                <FormLabel>Impact</FormLabel>
                <Textarea type="text" name="impact" defaultValue={feedback?.steps.filter(step => step.type === FeedbackStepType.IMPACT)[0].content} />
                <FormLabel>Plea</FormLabel>
                <Textarea type="text" name="plea" defaultValue={feedback?.steps.filter(step => step.type === FeedbackStepType.PLEA)[0].content} />
                <Button type="submit">Submit</Button>

            </form>
        </Box>
    );
}


const onFormSubmit = (event) => {
    event.preventDefault()
    const feedbackId = event.target['id'].value
    fetch(`/api/feedback/${feedbackId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: `{
            "id": ${feedbackId},
            "title": "${event.target['title'].value}",
            "description": "${event.target['description'].value}",
            "tags": [
                "dominik",
                "codecamp"
            ],
            "steps": [
                {
                    "content": "${event.target['intention'].value}",
                    "type": "INTENTION",
                    "feedbackId": ${feedbackId}
                },
                {
                    "content": "${event.target['observation'].value}",
                    "type": "OBSERVATION",
                    "feedbackId": ${feedbackId}
                },
                {
                    "content": "${event.target['impact'].value}",
                    "type": "IMPACT",
                    "feedbackId": ${feedbackId}
                },
                {
                    "content": "${event.target['plea'].value}",
                    "type": "PLEA",
                    "feedbackId": ${feedbackId}
                }
            ]
        }`,
    })
}