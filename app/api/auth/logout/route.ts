import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value
    
    if (sessionToken) {
      await deleteSession(sessionToken)
    }
    
    const response = NextResponse.json({ success: true })
    response.cookies.delete('session_token')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: true })
  }
}
