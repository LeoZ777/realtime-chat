import React from 'react'

type RecentChatItemProps = {
    name: string,
    image?: string,
    message: string,
    fromMe: boolean
}

export default function RecentChatItem(Props: RecentChatItemProps) {
    const { name, image, message, fromMe } = Props
    return (
        <div className='flex border rounded-md relative p-3 bg-zinc-50'>
            <img src={image} className='relative h-6 w-6 rounded-full mr-4' />
            <div>
                <h4>{name}</h4>
                <p className='max-w-md break-words'>{fromMe ? 'You:' : ''}{message}</p>
            </div>
            <div className='absolute flex items-center h-full right-2 top-0'>{ '>' }</div>
        </div>
    )
}
