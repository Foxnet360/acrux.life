import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { ApiResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  console.log('Signup API called')
  try {
    const { email, password, name } = await request.json()
    console.log('Received data:', { email, name, passwordLength: password?.length })

    // Validation
    if (!email || !password) {
      console.log('Validation failed: missing email or password')
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
      console.log('Validation failed: password too short')
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 8 characters long',
          data: null
        } as ApiResponse,
        { status: 400 }
      )
    }

    console.log('Checking if user exists')
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email already exists',
          data: null
        } as ApiResponse,
        { status: 400 }
      )
    }

    console.log('Hashing password')
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('Creating user')
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash: hashedPassword,
        role: 'RESEARCHER' // Default role
      }
    })

    console.log('User created:', user.id)
    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user

    console.log('Returning success')
    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: userWithoutPassword
      } as ApiResponse,
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
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