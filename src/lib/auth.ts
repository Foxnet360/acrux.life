import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { logger } from './logger'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        logger.debug('Authorize called', { email: credentials?.email })
        if (!credentials?.email || !credentials?.password) {
          logger.debug('No credentials')
          return null
        }

        logger.debug('Finding user')
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        logger.debug('User found', { found: !!user })
        if (!user || !user.passwordHash) {
          logger.debug('No user or no passwordHash')
          return null
        }

        logger.debug('Comparing password')
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        logger.debug('Password valid', { valid: isPasswordValid })
        if (!isPasswordValid) {
          logger.debug('Invalid password')
          return null
        }

        logger.debug('Returning user', { userId: user.id })
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