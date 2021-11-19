import {
    UnorderedList,
    ListItem,
    Text,
    Box,
    Button,
    Input,
    FormLabel,
    Textarea,
    Container,
    Link,
    Heading,
    Flex,
    Stack,
    Badge,
    useBreakpointValue,
    useColorModeValue
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { InferGetServerSidePropsType } from 'next';
import { getFeedbacks } from '../domain/services/feedbackService';
import { userIdOfRequest } from '../helpers/authentication';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FeedbackStepType, Feedback, FeedbackStep } from '.prisma/client';
import { NavigationPrivate } from '../components/landing/NavigationPrivate';
import { FeedbackWithSteps } from '../domain/feedbackExtension';
import { useRouter } from 'next/dist/client/router';
export const getServerSideProps = async (context: any) => {
    const userId = await userIdOfRequest(context.req, context.res);
    if (!userId) {
        throw new Error('Not authenticated');
    }
    const feedbacks = await getFeedbacks(userId);

    return {
        props: { feedbacks: feedbacks }, // will be passed to the page component as props
    };
};

type FormSteps = 'DETAILS' | FeedbackStepType | 'SUMMARY'

const stepConfig: Record<FeedbackStepType, { title: string, description: string, nextStep?: FormSteps, previousStep?: FormSteps }> = {
    'INTENTION': {
        title: 'Intention',
        description: `
                Communicating your intention before you give your feedback is crucial.
                It removes the need from your counterpart to make assumptions about why you are giving feedback.`,
        nextStep: 'OBSERVATION',
        previousStep: undefined

    },
    'OBSERVATION': {
        title: 'Observation',
        description: `
        Vague feedback that lacks context of the 'when' and 'where' of a situation may be misinterpreted as a personal assault or judgment.
        You should always convey the complete context, whether you're giving favorable feedback or delivering a harsher message with negative feedback. 
        
        Describe the specific behaviors that observed and wan't to address.
        Make no assumptions or subjective judgements about another person's behavior, as these might be incorrect, and they could impair your feedback.`,
        nextStep: 'IMPACT',
        previousStep: 'INTENTION'
    },
    'IMPACT': {
        title: 'Impact',
        description: `
        Use subjective statements to explain how the person's behavior have affected you, your team, or the company. To convey your argument, use the words "I" or "us."`,
        nextStep: 'PLEA',
        previousStep: 'OBSERVATION'
    },
    'PLEA': {
        title: 'Plea',
        description: `
        The previous phases assisted you in determining the goal and the facts around the problem.
        Now you provide your honest opinion and assessment of the situation.
        Your view might be based on facts or your personal perspective of the event; however, the most important aspect is to explain your assessment. 
        What could have been done differently? How could you assist in archiving an improvement?`,
        nextStep: 'SUMMARY',
        previousStep: 'IMPACT'
    },
}

interface IFormStepData {
    content: string;
    type: FeedbackStepType;
}
interface IFormData {
    title: string;
    id?: string;
    description: string;
    tags: string;
    steps: Record<FeedbackStepType, IFormStepData>;
}

const initalFeedbackState: IFormData = {
    title: '',
    description: '',
    tags: '',
    steps: {
        INTENTION: {
            content: '',
            type: 'INTENTION',
        },
        OBSERVATION: {
            content: '',
            type: 'OBSERVATION',
        },
        IMPACT: {
            content: '',
            type: 'IMPACT',
        },
        PLEA: {
            content: '',
            type: 'PLEA',
        },
    },
};


const createFeedbackRequest = (feedback: IFormData) => {
    const steps = feedback.steps
    const convertedFeedback = { title: feedback.title, description: feedback.description, tags: feedback.tags, steps: [steps.INTENTION, steps.OBSERVATION, steps.IMPACT, steps.PLEA] }
    return fetch('/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertedFeedback),
    });
};

export default function FeedbackFormWrapper() {
    const router = useRouter()
    const [currentStep, setStepper] = useState<FormSteps>('DETAILS')
    const [formState, setFormState] = useState<IFormData>(initalFeedbackState);

    const updateStep = (step: FeedbackStepType, content: string) => {
        setFormState({
            ...formState,
            steps: {
                ...formState.steps,
                [step]: {
                    content,
                    type: step,
                },
            },
        });
    }

    const createFeedback = () => {
        createFeedbackRequest(formState).then(() => router.push("/dashboard")
        )
    }


    return (
        <>
            <NavigationPrivate />
            <Container size={'3xl'}>
                {
                    currentStep === 'DETAILS' ? (
                        <DetailsForm
                            onSubmit={(title, tags) => {
                                setFormState({
                                    ...formState,
                                    title,
                                    tags
                                })
                                setStepper('INTENTION')
                            }}
                        />

                ) : null
            }
            {
                (currentStep === 'INTENTION' || currentStep === 'OBSERVATION' || currentStep === 'IMPACT' || currentStep === 'PLEA') ? (
                   <StepForm
                        title={stepConfig[currentStep].title}
                        description={stepConfig[currentStep].description}
                        onSubmit={(content) =>{
                            updateStep(currentStep, content)
                            const nextStep = stepConfig[currentStep].nextStep
                            if(!!nextStep) {
                                setStepper(nextStep)
                            }
                        }}
                   />
               ): null
            }
            {
                currentStep === 'SUMMARY' ? (
                        <Summary onSubmit={() => createFeedback()} formState={formState} />
                ): null
            }
        </Container>
        </>
    )
}

function DetailsForm({ onSubmit }: { onSubmit: (title: string, description: string) => void }) {
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(title, tags);
    }

    return (
        <>
            <StepExplanation title={"New Feedback"} />
            <form onSubmit={handleSubmit}>
                <Box py={2}>
                    <FormLabel htmlFor="title">
                        <Text>Title</Text>
                    </FormLabel>
                    <Input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Maxim behaviour during Codecamp"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </Box>

                <Box py={2}>
                    <FormLabel htmlFor="tags">
                        <Text>Tags</Text>
                    </FormLabel>
                    <Input
                        type="text"
                        name="tags"
                        id="tags"
                        placeholder="Dominik Work Fun"
                        value={tags}
                        onChange={(event) => setTags(event.target.value)}
                    />
                </Box>

                <Box mt={2}>
                    <Button type="submit" color="blue.600" width="100%">
                        Next
                    </Button>
                </Box>
            </form>
        </>
    )
}

function StepForm({ onSubmit, title, description }: { onSubmit: (content: string) => void, title: string, description: string }) {
    const [content, setContent] = useState('');
    const [id] = useState(Math.random().toString());

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(content);
        setContent('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <FormLabel htmlFor={id}>
                <StepExplanation
                    title={title}
                    description={description}
                />
            </FormLabel>
            <Textarea id={id} type="text" name="plea" value={content} onChange={(event) => setContent(event.target.value)} />

            <Box mt={2}>
                <Button type="submit" color="blue.600" width="100%">
                    Next
                </Button>
            </Box>
        </form>
    )
}

function Summary({ onSubmit, formState }: { onSubmit: () => void, formState: IFormData}) {
    const tags = formState.tags.split(' ').map((tag) => tag.replace(',', ''))
    console.log({
        raw: formState.tags,
        tags,
    })
    const displayTags = tags.length

    return (
        <div>
            <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                <Text
                    as={'span'}
                    position={'relative'}
                    _after={{
                        content: "''",
                        width: 'full',
                        height: useBreakpointValue({ base: '20%', md: '30%' }),
                        position: 'absolute',
                        bottom: 1,
                        left: 0,
                        bg: 'blue.400',
                        zIndex: -1,
                    }}>
                    {formState.title}
                </Text>
            </Heading>
            <Box py={2}>
                {
                    displayTags ? (
                        tags.map((tag) => (<Badge
                            px={2}
                            py={1}
                            m={1}
                            bg={useColorModeValue('blue.50', 'blue.800')}
                            fontWeight={'400'}
                        >
                            {tag}
                        </Badge>))
                    ) : null
                }
            </Box>
            <Box
                border={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                padding={3}
                borderRadius={4}
            >
                <Box py={2}>
                    <Text fontSize="2xl" fontWeight={300}>INTENTION</Text>
                    <Text color={'gray.500'}>
                        {formState.steps.INTENTION.content}
                    </Text>
                </Box>
                <Box py={2}>
                    <Text fontSize="2xl" fontWeight={300}>OBSERVATION</Text>
                    <Text color={'gray.500'}>
                        {formState.steps.OBSERVATION.content}
                    </Text>
                </Box>
                <Box py={2}>
                    <Text fontSize="2xl" fontWeight={300}>IMPACT</Text>
                    <Text color={'gray.500'}>
                        {formState.steps.IMPACT.content}
                    </Text>
                </Box>
                <Box py={2}>
                    <Text fontSize="2xl" fontWeight={300}>Plea</Text>
                    <Text color={'gray.500'}>
                        {formState.steps.PLEA.content}
                    </Text>
                </Box>
            </Box>
            <Box mt={2}>
                <Button onClick={onSubmit} width={"100%"}>Create</Button>
            </Box>
        </div>
    )
}


const StepExplanation = ({
    title,
    description,
}: {
    title: string;
    description?: string;
}) => {
    return (
        <Flex pt={8} pb={2} flex={1}>
            <Stack spacing={6} w={'full'} maxW={'lg'}>
                <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                    <Text color={'blue.400'} as={'span'}>
                        {title}
                    </Text>{' '}
                </Heading>
                {description ? (
                    <Text
                        fontSize={{ base: 'md', lg: 'lg' }}
                        color={'gray.500'}
                        marginTop={'0px'}
                    >
                        {description}
                    </Text>
                ) : null}
            </Stack>
        </Flex>
    );
};