import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('Authorize called with:', credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          console.log('No credentials')
          return null
        }

        console.log('Finding user')
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        console.log('User found:', !!user)
        if (!user || !user.passwordHash) {
          console.log('No user or no passwordHash')
          return null
        }

        console.log('Comparing password')
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        console.log('Password valid:', isPasswordValid)
        if (!isPasswordValid) {
          console.log('Invalid password')
          return null
        }

        console.log('Returning user')
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
}