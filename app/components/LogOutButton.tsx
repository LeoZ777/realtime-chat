'use client'

import React from 'react'
import { signOut } from 'next-auth/react'
import { getSession } from 'next-auth/react'

export default function LogOutButton() {
    return (
        <div onClick={() => signOut()}>
            LogOut
        </div>
    )
}
