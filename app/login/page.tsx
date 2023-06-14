'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function Page () {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    async function logIn () {
        if (isLoading) {
            return
        }
        try {
            setIsLoading(true)
            await signIn('google')
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <button onClick={logIn}>
                { isLoading ? 'Loading...' : 'Login' }
            </button>
        </div>
    )
}
