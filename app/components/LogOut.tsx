'use client'

import React, { useEffect, useState } from 'react'
import LogOutButton from './LogOutButton'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'

export default function LogOut() {
    const [session, setSession] = useState<any>({})

    useEffect(() => {
        let s: Session | null
        async function fetchSession () {
            s = await getSession()
            setSession(() => s)
        }
        fetchSession()
    }, [])

    return (
        <div className='absolute left-0 bottom-0 flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
            <img src={ session?.user?.image || '' } className='relative h-8 w-8 bg-gray-50 rounded-full'/>
            <div>
                <p>{ session?.user?.name || '' }</p>
                <p className='text-xs text-zinc-400'>{ session?.user?.email || '' }</p>
            </div>
            <LogOutButton />
        </div>
    )
}
