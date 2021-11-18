import { Feedback, FeedbackStep } from ".prisma/client";

export interface FeedbackWithSteps extends Feedback {
    steps: FeedbackStep[]
}
