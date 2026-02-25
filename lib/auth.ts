import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { getDb, ObjectId } from './mongodb'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const SESSION_EXPIRY_DAYS = parseInt(process.env.SESSION_EXPIRY_DAYS || '7')

export interface JWTPayload {
  userId: string
  email: string
  exp?: number
}

export interface UserSession {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  handle: string
  plan: string
  picture: string | null
  isAdmin: boolean
}

// Admin domain check
const ADMIN_DOMAIN = '@gotoretreats.com'

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase().endsWith(ADMIN_DOMAIN)
}

// Generate JWT token
export function generateToken(payload: Omit<JWTPayload, 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${SESSION_EXPIRY_DAYS}d` })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate session token
export function generateSessionToken(): string {
  return `sess_${crypto.randomUUID().replace(/-/g, '')}`
}

// Create session in database
export async function createSession(userId: string): Promise<string> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)
  
  const db = await getDb()
  await db.collection('sessions').insertOne({
    userId,
    sessionToken,
    expiresAt,
    createdAt: new Date(),
  })
  
  return sessionToken
}

// Get current user from session
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value
    
    if (!sessionToken) {
      return null
    }
    
    const db = await getDb()
    const session = await db.collection('sessions').findOne({ sessionToken })
    
    if (!session || new Date(session.expiresAt) < new Date()) {
      return null
    }
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) })
    
    if (!user) {
      return null
    }
    
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      handle: user.handle,
      plan: user.plan || 'FREE',
      picture: user.picture || null,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Validate session from request
export async function validateSession(request: Request): Promise<UserSession | null> {
  try {
    // Check cookie first
    const cookieHeader = request.headers.get('cookie')
    let sessionToken: string | null = null
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {} as Record<string, string>)
      sessionToken = cookies['session_token']
    }
    
    // Fallback to Authorization header
    if (!sessionToken) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        sessionToken = authHeader.slice(7)
      }
    }
    
    if (!sessionToken) {
      return null
    }
    
    const db = await getDb()
    const session = await db.collection('sessions').findOne({ sessionToken })
    
    if (!session || new Date(session.expiresAt) < new Date()) {
      return null
    }
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) })
    
    if (!user) {
      return null
    }
    
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      handle: user.handle,
      plan: user.plan || 'FREE',
      picture: user.picture || null,
    }
  } catch (error) {
    console.error('Error validating session:', error)
    return null
  }
}

// Delete session (logout)
export async function deleteSession(sessionToken: string): Promise<void> {
  const db = await getDb()
  await db.collection('sessions').deleteOne({ sessionToken }).catch(() => {})
}

// Generate unique handle from name
export async function generateUniqueHandle(firstName: string, lastName?: string): Promise<string> {
  const base = `${firstName}${lastName || ''}`.toLowerCase().replace(/[^a-z0-9]/g, '')
  let handle = base
  let counter = 1
  
  const db = await getDb()
  while (await db.collection('users').findOne({ handle })) {
    handle = `${base}${counter}`
    counter++
  }
  
  return handle
}
