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

export default function LandingPage(){

    const router = useRouter()

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
        router.push("/dashboard")
        return (<div/>)
    }
}
