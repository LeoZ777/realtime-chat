'use client'

import React, { useRef, useState, ChangeEvent, useEffect } from 'react'
import axios from 'axios'

export default function InputBox ({ chatId }: { chatId: string }) {
    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    const [input, setInput] = useState<string>('')

    const handleClick = () => {
        inputRef.current?.focus()
    }
    
    const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        console.log('handleInput', e.target?.value)
        setInput(() => e.target?.value)
    }

    const handleSubmit = async () => {
        try {
            // console.log(input)
            await axios.post('/api/message', { text: input, chatId })
            setInput('')
        } catch (err) {
            console.log(err)
        }
    }
    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            await handleSubmit()
        }
    }

    return (
        <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
            <div 
                className='border border-gray-200 rounded-lg p-2 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'
                onClick={handleClick}
            >
                <textarea 
                    ref={inputRef} 
                    value={input}
                    className='w-full h-16 outline-none resize-none'
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                />
                <div className='flex justify-end'>
                    <button 
                        className='rounded-md bg-slate-900 h-10 px-4 py-2 text-white'
                        onClick={handleSubmit}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    )
}
