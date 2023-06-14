import React from 'react'
import SideBarChatList from './SideBarChatList'
import SideBarOverview from './SideBarOverview'
import LogOut from './LogOut'
import Link from 'next/link'

export default function SideBar() {
  return (
    <div className='h w-80 px-6 border-r shrink-0'>
        <Link href='/dashboard'>Home</Link>
        {/* <SideBarChatList></SideBarChatList> */}
        <SideBarOverview></SideBarOverview>

        <LogOut></LogOut>
    </div>
  )
}
