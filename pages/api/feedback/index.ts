// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Feedback, FeedbackStep } from '.prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/client';
import { FeedbackWithSteps } from '../../../domain/feedbackExtension'
import { getToken } from "next-auth/jwt"
import { withAuthentication, userIdOfRequest } from '../../../helpers/authentication'
import { getFeedbacks } from '../../../domain/services/feedbackService';
const secret = process.env.SECRET

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Feedback[] | Feedback>
) {
  const userId = await userIdOfRequest(req, res)
  if (!userId) {
    return
  }

  if (req.method === 'GET') {
    const feedbacks = await getFeedbacks(userId)
    res.status(200).json(feedbacks);
  }

  if (req.method === 'POST') {
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
