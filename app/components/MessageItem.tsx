import React, { FC } from 'react'

type Props = {
    fromMe: boolean,
    text: string,
    image?: string,
    timestamp: number
}

export default function MessageItem (props: Props) {
    const { fromMe, text, image, timestamp } = props

    if (!fromMe) {
        return (
            <div className='flex items-end'>
                <img src={image} className='rounded-full relative w-6 h-6 order-0 mr-2' />
                <div className='flex flex-col order-2 items-start px-4 py-2 rounded-lg inline-block bg-gray-200 text-gray-900 rounded-bl-none max-w-sm'>
                    <span className='w-full break-words'>{text}</span>
                    {/* <span>{timestamp}</span> */}
                </div>
            </div>
        )
    } else {
        return (
            <div className='flex items-end justify-end'>
                <div className='flex flex-col order-1 items-end px-4 py-2 rounded-lg inline-block bg-indigo-600 text-white rounded-br-none mr-2 max-w-sm'>
                    <span className='w-full break-words'>{text}</span>
                    {/* <span>{timestamp}</span> */}
                </div>
                <img src={image} className='rounded-full relative w-6 h-6 order-1' />
            </div>
        )
    }
}
