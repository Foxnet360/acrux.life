import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  logger.debug('Signup API called')
  try {
    const { email, password, name } = await request.json()
    logger.debug('Received data', { email, name, passwordLength: password?.length })

    // Validation
    if (!email || !password) {
      logger.debug('Validation failed: missing email or password')
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
          data: null
        } as ApiResponse,
        { status: 400 }
      )
    }

    if (password.length < 8) {
      logger.debug('Validation failed: password too short')
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 8 characters long',
          data: null
        } as ApiResponse,
        { status: 400 }
      )
    }

    logger.debug('Checking if user exists')
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      logger.debug('User already exists')
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email already exists',
          data: null
        } as ApiResponse,
        { status: 400 }
      )
    }

    logger.debug('Hashing password')
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    logger.debug('Creating user')
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash: hashedPassword,
        role: 'RESEARCHER' // Default role
      }
    })

    logger.debug('User created', { userId: user.id })
    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user

    logger.debug('Returning success')
    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: userWithoutPassword
      } as ApiResponse,
      { status: 201 }
    )
  } catch (error) {
    logger.error('Signup error', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        data: null
      } as ApiResponse,
      { status: 500 }
    )
  }
}