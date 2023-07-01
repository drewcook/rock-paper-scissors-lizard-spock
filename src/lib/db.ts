import mongoose from 'mongoose'

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose
// @ts-ignore
if (!cached) cached = global.mongoose = { conn: null, promise: null }

const connectToMongo = async () => {
	if (cached.conn) {
		console.info(`Connected to MongoDB`)
		return cached.conn
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(`${process.env.MONGODB_URI}`, { bufferCommands: false }).then(mongoose => {
			console.info(`Connected to MongoDB`)
			return mongoose
		})
	}

	cached.conn = await cached.promise
	return cached.conn
}

export default connectToMongo
