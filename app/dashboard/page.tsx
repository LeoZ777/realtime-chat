import React from 'react'
import RecentChatItem from '../components/RecentChatItem'
import { getFriendsByUserId } from '@/lib/fetchFriends'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/auth'
import { chatHrefConstructor } from '@/lib/utils'
import { fetchRedis } from '@/lib/redis'
import Link from 'next/link'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return null
    }
    const getChatsWithLastMessage = async () => {
        const friends = await getFriendsByUserId(session.user.id)
        const friendsWithLastMessage = await Promise.all(friends.map(async friend => {
            const [lastMessageRaw] = await fetchRedis(
                'zrange',
                `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
                -1,
                -1
            )
            const lastMessage = JSON.parse(lastMessageRaw)
            return {
                ...friend,
                lastMessage
            }
        }))
        return friendsWithLastMessage
    }
    const friendsWithLastMessage = await getChatsWithLastMessage()

    return (
        <div className='grow px-6 py-12'>
            <h2 className='font-bold text-5xl mb-8'>Recent Chats</h2>
            { friendsWithLastMessage.map((item) => {
                return (
                    <Link href={`/dashboard/chat/${chatHrefConstructor(item.id, session.user.id)}`} key={item.id}>
                        <RecentChatItem 
                            name={item.name} 
                            image={item.image}
                            message={item.lastMessage.text}
                            fromMe={session.user.id === item.lastMessage.senderId}
                        />
                    </Link>
                )
            }) }
        </div>
    )
}
