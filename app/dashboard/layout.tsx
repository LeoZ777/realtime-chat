import React from 'react'
import SideBarChatList from '../components/SideBarChatList'
import SideBarOverview from '../components/SideBarOverview'
import LogOut from '../components/LogOut'
import Link from 'next/link'
import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { getFriendsByUserId } from '@/lib/fetchFriends'

type LayoutProps = {
    children: React.ReactNode
}

export default async function DashboardLayout({ children }: LayoutProps) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return
    }

    const friends = await getFriendsByUserId(session.user.id)

    return (
        <div className='flex h-full w-full'>
            <div className='h w-80 px-6 border-r shrink-0'>
                <Link href='/dashboard'>Home</Link>
                <SideBarChatList
                    friends={friends}
                    userId={session.user.id}
                />
                <SideBarOverview></SideBarOverview>
                <LogOut></LogOut>
            </div>
            { children }
        </div>
    )
}
