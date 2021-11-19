import { UnorderedList, ListItem, Text, Box, Button, Input, FormLabel, Textarea, Container, Link, Heading } from '@chakra-ui/react';
import NextLink from 'next/link'
import prisma from '../prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
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
    const onFormSubmit = (event) => {
        event.preventDefault()
        fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: `{
                "title": "${event.target['title'].value}",
                "description": "${event.target['description'].value}",
                "tags": [
                    "dominik",
                    "codecamp"
                ],
                "steps": [
                    {
                        "content": "${event.target['intention'].value}",
                        "type": "INTENTION"
                    },
                    {
                        "content": "${event.target['observation'].value}",
                        "type": "OBSERVATION"
                    },
                    {
                        "content": "${event.target['impact'].value}",
                        "type": "IMPACT"
                    },
                    {
                        "content": "${event.target['plea'].value}",
                        "type": "PLEA"
                    }
                ]
            }`,
        })
    }

    return (
        <Container maxW="full" centerContent overflow="hidden" >
            <Box textAlign="center">

                <UnorderedList>
                    {feedbacks?.map(feedback => {
                        return <ListItem>
                            <Text>
                                {feedback.title} - {feedback.description} - {feedback.id}
                            </Text>
                            <NextLink href={`/detail/${feedback.id}`} passHref>                 
                              <Link>Details</Link>
                            </NextLink>
                        </ListItem>
                    }
                    )
                    }
                </UnorderedList>

                <Heading>Add new Feedback</Heading>

                <form onSubmit={onFormSubmit}>
                    <FormLabel>Title</FormLabel>
                    <Input type="text" name="title" />
                    <FormLabel>Description</FormLabel>
                    <Input type="text" name="description" />


                    <FormLabel>Intention</FormLabel>
                    <Textarea type="text" name="intention" />
                    <FormLabel>Observation</FormLabel>
                    <Textarea type="text" name="observation" />
                    <FormLabel>Impact</FormLabel>
                    <Textarea type="text" name="impact" />
                    <FormLabel>Plea</FormLabel>
                    <Textarea type="text" name="plea" />
                    <Button type="submit">Save</Button>

                </form>
            </Box>
        </Container>
    );
}

