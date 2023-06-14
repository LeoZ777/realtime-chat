'use client'

import React, { useEffect, useState } from 'react'
import { fetchRedis } from '@/lib/redis'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey, chatHrefConstructor } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
    friends: User[],
    userId: string
}

type SenderAndMessage = Message & {
    senderName: string,
    senderImg: string
}

export default function SideBarChatList(props: Props) {
    const { friends, userId } = props
    const [unreadMessages, setUnreadMessages] = useState<SenderAndMessage[]>([])
    const path = usePathname()

    function handleNewMessage (senderAndMessage: SenderAndMessage) {
        console.log(`/dashboard/chat/${chatHrefConstructor(senderAndMessage.senderId, userId)}`, path)
        if (`/dashboard/chat/${chatHrefConstructor(senderAndMessage.senderId, userId)}` !== path) {
            console.log('handle')
            setUnreadMessages(prev => [...prev, senderAndMessage])
        }
    }

    function UnreadDot ({ friendId }: { friendId: string }) {
        const unreadMessagesById = unreadMessages.filter(msg => msg.senderId === friendId)
        // const needNotify = `/dashboard/chat/${chatHrefConstructor(friendId, userId)}` !== path

        return (
            (unreadMessagesById.length > 0)
            ? <span className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>{unreadMessagesById.length}</span>
            : null
        )
    }

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${userId}:chats`))
        pusherClient.bind('new_message', handleNewMessage)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${userId}:chats`))
            pusherClient.unbind('new_message', handleNewMessage)
        }
    }, [path])

    useEffect(() => {
        setUnreadMessages(prev => prev.filter(msg => `/dashboard/chat/${chatHrefConstructor(msg.senderId, userId)}` !== path))
    }, [path])
    
    return (
        <div>
            <p className='my-5 text-xs font-semibold leading-6 text-gray-400'>Your Chats</p>
            { friends.map(friend => {
                return (
                    <Link href={`/dashboard/chat/${chatHrefConstructor(friend.id, userId)}`} key={friend.id}>
                        <div className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                            <span>{friend.name}</span>
                            <UnreadDot friendId={friend.id} />
                        </div>
                    </Link>
                )
            }) }
        </div>
    )
}
