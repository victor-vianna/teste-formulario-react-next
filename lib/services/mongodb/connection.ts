import createHttpError from 'http-errors'
import { Db, MongoClient } from 'mongodb'
import clientPromise from './client'

let cachedDb: Db | null = null
export default async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb
  }
  const client = await clientPromise
  const db = client.db('testing')
  cachedDb = db
  return db
}