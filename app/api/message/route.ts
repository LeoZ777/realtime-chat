import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "@/lib/auth";
import { nanoid } from "nanoid";
import { fetchRedis } from "@/lib/redis";
import db from "@/lib/db"
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

// senderId, timestamp, id, text
export async function POST (request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        }
        const senderId: string = session.user.id
        const { text, chatId }: { text: string, chatId: string } = await request.json()
        const [userId1, userId2] = chatId.split('--')
        if (userId1 !== session.user.id && userId2 !== session.user.id) {
            return new Response('Unauthorized', { status: 401 })
        }

        const timestamp: number = Date.now()
        const score: number = timestamp
        const friendId = session.user.id === userId1 ? userId2 : userId1

        const message: Message = {
            id: nanoid(),
            senderId,
            text,
            timestamp
        }
        await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message)

        await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
            ...message,
            senderImg: session.user.image,
            senderName: session.user.name
        })

        await db.zadd(`chat:${chatId}:messages`, {
            score,
            member: JSON.stringify(message)
        })

        return NextResponse.json({ res: 999 })
    } catch (err) {
        console.log(err)
    }
}