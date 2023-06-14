import { Session, User } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: User
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
    }
}