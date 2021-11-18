import { Container } from "@chakra-ui/layout"
import { FeedbackList } from "../components/feedback-list/FeedbackList"

const DashboardPage: React.FC = () => {
    return (
        <Container maxW={'3xl'}>
            <h1>Dashbaord</h1>
            <FeedbackList />
        </Container>
    )
}

export default DashboardPage