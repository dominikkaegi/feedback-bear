// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Feedback, FeedbackStep } from '.prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/client';
import { FeedbackWithSteps } from '../../../domain/feedbackExtension'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Feedback[] | Feedback>
) {

  const userId = 1
  if (req.method === 'GET') {
    const feedbacks = await prisma.feedback.findMany({ where: { authorId: userId }, include: { steps: {} } });
    res.status(200).json(feedbacks);
  }

  if (req.method === 'POST') {
    console.log(req.body)
    const newFeedback = req.body as FeedbackWithSteps
    newFeedback.authorId = userId

    const createdFeedback = await prisma.feedback.create({
      data: {
        description: newFeedback.description,
        title: newFeedback.title,
        authorId: userId,
        tags: newFeedback.tags, 
        steps: { create: newFeedback.steps }
      }, include: { steps: true }
    })
    res.status(201).json(createdFeedback)
  }
}
