import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import prisma from "../prisma/client";

export const withAuthentication = async (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const session = await getSession({ req });
    if (!session) {
        throw new Error('Not authenticated')
    }

    return session as Session;
};

export const userIdOfRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await withAuthentication(req, res)
    return session?.userId
}