import { MongoClient, Db, ObjectId } from 'mongodb'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'gotolinks'

let client: MongoClient | null = null
let db: Db | null = null

export async function getDb(): Promise<Db> {
  if (db) return db
  
  client = new MongoClient(MONGO_URL)
  await client.connect()
  db = client.db(DB_NAME)
  
  // Create indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
  await db.collection('users').createIndex({ handle: 1 }, { unique: true })
  await db.collection('sessions').createIndex({ sessionToken: 1 }, { unique: true })
  await db.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
  await db.collection('profiles').createIndex({ userId: 1 }, { unique: true })
  await db.collection('blocks').createIndex({ profileId: 1 })
  await db.collection('analytics').createIndex({ userId: 1 })
  await db.collection('analytics').createIndex({ blockId: 1 })
  
  return db
}

// Helper to convert MongoDB _id to string id
export function toJSON<T extends { _id?: ObjectId }>(doc: T | null): Omit<T, '_id'> & { id: string } | null {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { id: _id?.toString() || '', ...rest } as any
}

export { ObjectId }
