import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (sessionToken) {
      const db = await getDb()
      await db.collection('sessions').deleteOne({ sessionToken })
    }
    
    const response = NextResponse.json({ success: true })
    response.cookies.delete('session_token')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: true })
  }
}
