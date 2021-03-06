import prisma from "../../prisma/client";

export async function getFeedbacks(userId: string) {
    const feedbacks = await prisma.feedback.findMany({ where: { authorId: userId }, include: { steps: {} } })
    return feedbacks
}

export async function getFeedback(userId: string, feedbackId: number) {

    const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId }, include: { steps: {} } });
    if (feedback === null || feedback.authorId !== userId) {
        return null
    } else {
        return feedback
    }
}