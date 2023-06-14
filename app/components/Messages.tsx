'use client'

import React, { useEffect, useState } from 'react'
import MessageItem from './MessageItem'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'

type Props = {
    user: User,
    friend: User,
    initialMessages: Message[],
    chatId: string
}

export default function Messages(props: Props) {
    const { user, friend, initialMessages, chatId } = props

    const [messages, setMessages] = useState<Message[]>(initialMessages)

    function handleNewMessage(newMessage: Message) {
        setMessages(prev => [newMessage, ...prev])
    }

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`))
        pusherClient.bind('incoming-message', handleNewMessage)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
            pusherClient.unbind('incoming-message', handleNewMessage)
        }
    }, [chatId])

    return (
        <div className='p-3 flex flex-col-reverse gap-2 overflow-scroll'>
            { messages.map(message => {
                return (
                    <MessageItem
                        fromMe={message.senderId === user.id}
                        text={message.text}
                        timestamp={message.timestamp}
                        image={message.senderId === user.id ? user.image : friend.image}
                        key={message.id}
                    />
                )
            }) }
        </div>
    )
}
