// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Feedback, FeedbackStep } from '.prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { FeedbackWithSteps } from '../../../domain/feedbackExtension';
import prisma from '../../../prisma/client';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<FeedbackWithSteps>
) {
    const { id } = req.query
    const idAsNumber = Number.parseInt(id as string) // TODO clean up this cast
    const userId = 1
    if (req.method === 'GET') {
        const feedback = await prisma.feedback.findUnique({ where: { id: idAsNumber }, include: { steps: {} } });
        if (feedback === null) {
            res.status(404)
        } else {
            res.status(200).json(feedback);
        }
    }

    if (req.method === 'PUT') {
        const newFeedback = req.body as FeedbackWithSteps
        if (newFeedback.steps.length != new Set(newFeedback.steps.map(step => step.type)).size) {
            console.log("Multiple steps with the same type found")
            res.status(400).end()
            return
        }
        if (idAsNumber !== newFeedback.id) {
            console.log("feedback id does not match id in request")
            res.status(400).end()
            return
        }
        if (newFeedback.steps.find(step => idAsNumber !== step.feedbackId)) {
            console.log("feedback id does not match steps feedback id")
            res.status(400).end()
            return
        }
        const stepUpdates = newFeedback.steps.map(step => {
            return prisma.feedbackStep.upsert({
                where: { feedbackId_type: { feedbackId: step.feedbackId, type: step.type } },
                create: step,
                update: step
            })
        })
        const feedbackUpdate = prisma.feedback.update({
            where: { id: idAsNumber },
            data: {
                description: newFeedback.description,
                tags: newFeedback.tags,
                title: newFeedback.title,
            },
            include: { steps: true }
        })
        const results = await prisma.$transaction([...stepUpdates, feedbackUpdate])
        res.status(200).json(results[results.length - 1] as FeedbackWithSteps)
    }


}
