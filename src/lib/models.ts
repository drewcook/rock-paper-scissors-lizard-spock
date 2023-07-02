import mongoose, { Document, Model, Schema } from 'mongoose'
import { Address } from 'viem'

import { Move } from './types'

// Represents a game initiates by account from 'address'
// Designed to be stored only after a game contract is deployed
// This model maps to 'connectedGame' in the frontend
export interface IAccountDoc extends Document {
	player: Address // address of the account creating the game
	move: Move // move of the account
	msgSignature: string // signature of the commitment
	c1Hash: string // hash of the commitment
	opponent: Address // address of the opponent
	stake: number // in wei
	gameAddress: Address // address of the deployed game contract
}

const AccountSchema: Schema = new Schema({
	player: { type: String, required: true },
	move: { type: String, required: true },
	msgSignature: { type: String, required: true },
	c1Hash: { type: String, required: true },
	opponent: { type: String, required: true },
	stake: { type: Number, required: true },
	gameAddress: { type: String, required: true },
})

const AccountModel: Model<IAccountDoc> =
	mongoose.models.Account || mongoose.model<IAccountDoc>('Account', AccountSchema)

export default AccountModel
