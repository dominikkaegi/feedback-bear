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
        res.status(401).end();
        return
    }

    return session as Session;
};

export const userOfRequest = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await withAuthentication(req, res)
    if (!session) {
        console.log("User without session tried to access private method")
        res.status(401).end()
        return
    }
    const userEmail = session?.user?.email
    if (!userEmail) {
        console.log("User without email tried to access private method")
        res.status(401).end()
        return
    }
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) {
        console.log(`User with email ${userEmail} not found`)
        res.status(401).end()
        return
    }
    return user
}