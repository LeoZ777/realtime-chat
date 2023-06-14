import React from 'react'
import { getServerSession } from 'next-auth'
import authOptions from '@/lib/auth'
import InputBox from '@/app/components/InputBox'
import Messages from '@/app/components/Messages'
import { fetchRedis } from '@/lib/redis'

const getChatMessages = async (chatId: string): Promise<Message[] | undefined> => {
    try {
        const results: string[] = await fetchRedis(
            'zrange',
            `chat:${chatId}:messages`,
            0,
            -1
        )
        const messages: Message[] = results.map(item => JSON.parse(item))
        return messages
    } catch (err) {
        console.log(err)
    }
}

const getFriend = async (id: string): Promise<User> => {
    const friend: User = JSON.parse(await fetchRedis('get', `user:${id}`))
    return friend
}

export default async function page({ params }: { params: { chatId: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return null
    }

    const chatId = params.chatId
    const [userId1, userId2] = chatId.split('--')
    const friendId = session.user.id === userId1 ? userId2 : userId1

    const friend = await getFriend(friendId)
    let messages = await getChatMessages(chatId) as Message[]
    messages = messages.reverse()
    const user = session.user as User

    return (
        <div className='px-6 py-12 max-h-screen flex flex-col grow'>
            <div className='flex py-3 border-b-2 border-gray-200'>
                <img src={friend.image || ''} className='relative w-8 sm:w-12 h-8 sm:h-12 rounded-full mr-3' />
                <div>
                    <p>{ friend.name }</p>
                    <p>{ friend.email }</p>
                </div>
            </div>
            <Messages
                friend={friend}
                initialMessages={messages}
                user={user}
                chatId={chatId}
            />
            <InputBox chatId={chatId}></InputBox>
        </div>
    )
}
