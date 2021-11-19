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

const feedbacks: Array<Partial<Feedback>> = [
    {
        id: 1234,
        title: 'Dominiks Feedback',
        description: 'This is a description of the feedback',
        tags: ['tag1', 'tag2', 'tag3'],
    },
    {
        id: 1235,
        title: 'Jerome Feedback',
        description: 'This is a description of the feedback asdflkj asdlfkj asdflj asd flaskdfj alskdfj ',
        tags: ['tag1', 'tag2', 'tag3'],
    },
];



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


const LandingPage: React.FC = () => {
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
                        <FeedbackList feedbacks={feedbacks as Feedback[]} onDelete={(id) => console.log('delete item: ', id)} onEdit={(id) => console.log('go to edit page for: ', id)} />
                    </Box>
                </Container>
            </>
        )
    }
}

export default LandingPage