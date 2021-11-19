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
    useBreakpointValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { InferGetServerSidePropsType } from 'next';
import { getFeedbacks } from '../domain/services/feedbackService';
import { userIdOfRequest } from '../helpers/authentication';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FeedbackStepType } from '.prisma/client';
import { NavigationPrivate } from '../components/landing/NavigationPrivate';

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

const stepConfig: Record<FeedbackStepType, { title: string, description: string, nextStep?: FormSteps, previousStep?: FormSteps  }> = {
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
                Communicating your intention before you give your feedback is crucial.
                It removes the need from your counterpart to make assumptions about why you are giving feedback.`,
        nextStep: 'IMPACT',
        previousStep: 'INTENTION'
    },
    'IMPACT': {
        title: 'Impact',
        description: `
                Communicating your intention before you give your feedback is crucial.
                It removes the need from your counterpart to make assumptions about why you are giving feedback.`,
        nextStep: 'PLEA',
        previousStep: 'OBSERVATION'
    },
    'PLEA': {
        title: 'Plea',
        description: `
                Communicating your intention before you give your feedback is crucial.
                It removes the need from your counterpart to make assumptions about why you are giving feedback.`,
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
            type: 'INTENTION',
        },
        PLEA: {
            content: '',
            type: 'INTENTION',
        },
    },
};


const createFeedbackRequest = async (feedback: IFormData) => {
    return fetch('/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
    });
};

export default function FeedbackFormWrapper () {
    const [currentStep, setStepper] = useState<FormSteps>('DETAILS')
    const [formState, setFormState] = useState<IFormData>(initalFeedbackState);
    console.log(formState)

    const updateStep = (step: FeedbackStepType, content: string)  => {
        setFormState({
            ...formState,
            steps: {
                ...formState.steps,
                [FeedbackStepType.INTENTION]: {
                    content,
                    type: step,
                },
            },
        });
    }

    const createFeedback = () => {
        console.log('map the feedback to the backend value and send it')
    }
    

    return (
        <>
        <NavigationPrivate />
        <Container size={'3xl'}>
            {
                currentStep === 'DETAILS' ? (
                    <DetailsForm
                        onSubmit={(title, description) => {
                            setFormState({
                                ...formState,
                                title,
                                description
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
                    <Summary onSubmit={() => createFeedback()} />
                ): null
            }
        </Container>
        </>
    )
}

function DetailsForm ({onSubmit}:{onSubmit: (title: string, description: string) => void}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(title, description);
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
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
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

function StepForm ({onSubmit, title, description}: {onSubmit: (content: string) => void, title: string, description: string}) {
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

function Summary({onSubmit}: {onSubmit: () => void}) {
    return (
        <div>
            <StepExplanation title={'Summary'} />
            <Button>Create</Button>
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
                ): null}
            </Stack>
        </Flex>
    );
};
