import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')

    if (userId) {
      // Fetch user email from database
      const user = await prisma.user.findUnique({
        where: { id: userId.value },
        select: { email: true }
      })

      if (user) {
        return NextResponse.json({ authenticated: true, email: user.email })
      }
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    console.error('Auth status error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
