import { CallToAction } from "../components/landing/CallToAction"
import { Navigation } from "../components/landing/Navigation"
import { useSession } from "next-auth/client";
import { FeedbackList } from "../components/feedback-list/FeedbackList";
import CreateFeedbackTeaser from "../components/feedback-list/CreateFeedbackTeaser";
import {
    Container,
    Box,
    Flex,
    Spinner
} from '@chakra-ui/react';
import { Feedback } from ".prisma/client";
import { userIdOfRequest } from "../helpers/authentication";
import { getFeedbacks } from "../domain/services/feedbackService";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/dist/client/router";

const SpinnerScreen = () => {
    return (
        <Container minH="100vh">
            <Flex flexFlow="column" justifyContent="center" alignItems="center" minH="100vh">
                <Box>
                    <Spinner size="xl" color="blue.500" emptyColor="gray.200" speed="1s" thickness="4px"/>
                </Box>
            </Flex>
        </Container>
    )
}


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


export default function LandingPage({ feedbacks }: InferGetServerSidePropsType<typeof getServerSideProps>){

    const router = useRouter()
    const editFeedback = (id: number) => {
        console.log('edit feedback: ', id)
        router.push(`/detail/${id}`)
    }

    const deleteFeedback = (id: number) => {
        console.log('delete feedback: ', id)
        fetch(`/api/feedback/${id}`, {method: 'DELETE'}).then(() => {router.push('/')})
    }


    const [session, loading] = useSession();

    if (loading) {
        return <SpinnerScreen />
    }


    if(!session) {
        return (
            <>
                <Navigation />
                <CallToAction />
            </>
        )
    } else {
        return (
            <>
                <Container maxW={'3xl'}>
                    <Navigation />
                    <Box m={5}>
                        <CreateFeedbackTeaser />
                    </Box>
                    <Box m={5}>
                        <FeedbackList feedbacks={feedbacks as Feedback[]} 
                        onDelete={(id) => deleteFeedback(id)} 
                        onEdit={(id) => editFeedback(id)} />
                    </Box>
                </Container>
            </>
        )
    }
}