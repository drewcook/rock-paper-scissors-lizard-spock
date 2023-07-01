import { NextResponse } from 'next/server'

import connectToMongo from '@/lib/db'
import AccountModel from '@/lib/models'

// Utility for success responses
export const getSuccessResponse = (data: any, status = 200): NextResponse => {
	return new NextResponse(
		JSON.stringify({
			status: 'success',
			data,
		}),
		{
			status,
			headers: { 'Content-Type': 'application/json' },
		},
	)
}

// Utility for error responses
export const getErrorResponse = (status = 500, message: string, error: Error | null = null): NextResponse => {
	return new NextResponse(
		JSON.stringify({
			status: status < 500 ? 'fail' : 'error',
			message,
			error,
		}),
		{
			status,
			headers: { 'Content-Type': 'application/json' },
		},
	)
}

// GET /api/accounts
export async function GET(req: Request) {
	try {
		await connectToMongo()

		// Determine if getting all accounts or a specific account
		const { searchParams } = new URL(req.url)
		const address = searchParams.get('address')
		if (address) {
			// Get singular account, proiritize checking for player account first, then check if account is an opponent
			const [accountPlayer] = await AccountModel.find({ player: address }).limit(1)
			if (!accountPlayer) {
				const [accountOpponent] = await AccountModel.find({ opponent: address }).limit(1)
				// No Account found
				if (!accountOpponent) return getErrorResponse(404, 'Account not found')
				// Return the opponent
				return getSuccessResponse(accountOpponent)
			}
			// Return the player
			return getSuccessResponse(accountPlayer)
		} else {
			// Get all accounts
			const accounts = await AccountModel.find({}).sort({ balance: -1 }).limit(100)
			return getSuccessResponse(accounts)
		}
	} catch (error: any) {
		return getErrorResponse(500, error.message, error)
	}
}

// POST /api/accounts
export async function POST(req: Request) {
	const params = await req.json()
	const { player, move, msgSignature, c1Hash, opponent, stake, gameAddress } = params
	await connectToMongo()
	const account = await AccountModel.create({
		player,
		move,
		msgSignature,
		c1Hash,
		opponent,
		stake,
		gameAddress,
	})
	if (account) {
		return getSuccessResponse(account)
	} else {
		return getErrorResponse(500, 'Error creating account')
	}
}
