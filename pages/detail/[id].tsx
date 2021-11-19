import { OrderedList, ListItem, Text, Box, FormLabel, Input, Textarea, Button, Container, Flex } from '@chakra-ui/react';
import NextLink from 'next/link'
import prisma from '../../prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getFeedback } from '../../domain/services/feedbackService';
import { userIdOfRequest } from '../../helpers/authentication';
import { FeedbackStepType } from '.prisma/client';
import { useRouter } from 'next/dist/client/router';
import { NavigationPrivate } from '../../components/landing/NavigationPrivate';

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


const dashboardRoute = '/dashboard'

export default function getFeedbackList({ feedback }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const deleteFeedback = () => {
        fetch(`/api/feedback/${feedback?.id}`, { method: 'DELETE' }).then(() => { router.push(dashboardRoute)})
    }

    const onFormSubmit = (event: any) => {
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
                "tags": [
                    "Dominik", "fun"
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
        }).then(() => { router.push(dashboardRoute) })
    }

    const discard = () => {
        router.push(dashboardRoute)
    }
    
    return (
        <>
        <NavigationPrivate />
        <Container size="3xl">
            <Box textAlign="center" py={10} px={6}>
                <form onSubmit={onFormSubmit}>
                    <Input type="number" name="id" defaultValue={feedback?.id} visibility="hidden" />

                    <FormLabel  mt={2}>Title</FormLabel>
                    <Input type="text" name="title" defaultValue={feedback?.title} />
                    <FormLabel >Tags</FormLabel>
                    <Input type="text" name="tags" defaultValue={feedback?.tags} />


                    <FormLabel >Intention</FormLabel>
                    <Textarea type="text" name="intention" defaultValue={feedback?.steps.filter(step => step.type === FeedbackStepType.INTENTION)[0]?.content} />
                    <FormLabel >Observation</FormLabel>
                    <Textarea type="text" name="observation" defaultValue={feedback?.steps.filter(step => step.type === FeedbackStepType.OBSERVATION)[0]?.content} />
                    <FormLabel >Impact</FormLabel>
                    <Textarea type="text" name="impact" defaultValue={feedback?.steps.filter(step => step.type === FeedbackStepType.IMPACT)[0]?.content} />
                    <FormLabel >Plea</FormLabel>
                    <Textarea type="text" name="plea" defaultValue={feedback?.steps.filter(step => step.type === FeedbackStepType.PLEA)[0]?.content} />

                    <Box mt={3}>
                        <Flex justifyContent={'flex-end'}>
                            <Button variant={""}  type="button" mr={3} onClick={ deleteFeedback}>Delete</Button>
                                <Button variant={""} type="button" mr={3} onClick={discard}>Discard</Button>
                            <Button  type="submit" mr={3}>Update</Button>
                        </Flex>
                    </Box>
                </form>
            </Box>
        </Container>
        </>
    );
}
