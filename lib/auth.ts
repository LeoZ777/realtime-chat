import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import redis from './db'
// import { Redis } from "@upstash/redis";

// const redis = Redis.fromEnv()
// const redis = new Redis({
//     url: process.env.UPSTASH_REDIS_REST_URL || '',
//     token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
// })

function getGoogleCredentials () {
    const clientId = process?.env?.GOOGLE_CLIENT_ID
    const clientSecret = process?.env?.GOOGLE_CLIENT_SECRET
    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }
    return [clientId, clientSecret]
}

const [clientId, clientSecret] = getGoogleCredentials()

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: clientId,
            clientSecret: clientSecret
        })
    ],
    session: {
        strategy: 'jwt'
    },
    adapter: UpstashRedisAdapter(redis),
    callbacks: {
        async jwt ({ token, user, account }) {
            return token
        },
        async session ({ session, token, user }) {
            console.log('token: ', token)
            if (token) {
                session.user.id = token.id
            }
            return session
        },
        redirect () {
            return '/'
        }
    },
}

export default authOptions