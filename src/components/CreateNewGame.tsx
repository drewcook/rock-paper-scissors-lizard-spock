import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { keccak256 } from 'ethers'
import { useState } from 'react'
import { Address, encodeDeployData, encodePacked, parseEther } from 'viem'
import { useSignMessage } from 'wagmi'

import { RPS_ABI, RPS_BYTECODE } from '@/lib/constants'
import { Move } from '@/lib/types'
import { moveDisplayName } from '@/utils/moveDisplayName'

import NewGameDialog from './NewGameDialog'
import { useWeb3 } from './Web3Provider'

const styles = {
	btn: {
		'&:disabled': {
			backgroundColor: 'dimgray',
			color: 'initial',
		},
	},
}

const CreateNewGame = () => {
	// State
	const [open, setOpen] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [submitError, setSubmitError] = useState(false)
	// Hooks
	const { address, publicClient, walletClient, loadGameForAccount } = useWeb3()
	const { error: signError, signMessageAsync } = useSignMessage()

	const handleSubmit = async (_move: Move, _opponentAddress: Address, _stake: number, _customMessage: string) => {
		try {
			setSubmitLoading(true)
			setSubmitError(false)
			// 1. Get signature with a custom message to create salt
			const salt = await signMessageAsync({
				message: `Please sign this message to create your unique identity for this game. This ensures that you are the owner of this game and are the only one permitted to reveal your move later on to determine the winner. You identity is based off of your move and your custom message:\n\nMove: ${moveDisplayName(
					_move,
				)}\nMessage: ${_customMessage}`,
			})

			// 2. Generate a keccack256 hash of the move and the salt
			// Make tx to generate a keccack256 hash of the move and salt
			// const tx1 = await hasherWriteAsync({ args: [_move, bytesToBigint(hash)] })
			// const tx1Receipt = await publicClient?.waitForTransactionReceipt(tx1)
			// console.log({ tx1Receipt })

			// Or, concatenate and hash locally instead (hard to get return data from the contract itself)
			// const concatenated = `${salt + _move}`
			const hash = keccak256(encodePacked(['string', 'string'], [_move, salt]))
			console.log({ hash })

			// 3. Create new game with the stake amount, move hash, and opponent
			const calldata = encodeDeployData({ abi: RPS_ABI, bytecode: `0x${RPS_BYTECODE}`, args: [hash, _opponentAddress] })
			const tx = await walletClient?.sendTransaction({
				data: calldata,
				account: address,
				value: parseEther(`${_stake}`),
			})
			if (tx) {
				// Get the newly deployed contract address for the game
				const txReceipt = await publicClient?.waitForTransactionReceipt({ hash: `${tx}` })
				const gameAddress = txReceipt?.contractAddress
				console.log({ txReceipt, gameAddress })
				// Store account info in the database for the given address.This will be used to verify the move later
				if (gameAddress) await createGameAccount(_move, salt, hash, _opponentAddress, _stake, gameAddress)
			}
		} catch (e: any) {
			setSubmitLoading(false)
			setSubmitError(true)
			console.error('Error occurred in handleSubmit() - ', e)
		}
	}

	// Make a POST request to create new db record about player and game
	const createGameAccount = async (
		move: Move,
		msgSignature: string,
		c1Hash: string,
		opponent: Address,
		stake: number,
		gameAddress: Address,
	) => {
		try {
			const response = await fetch('/api/accounts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					player: address,
					move,
					msgSignature,
					c1Hash,
					opponent,
					stake,
					gameAddress,
				}),
			})
			const { data, status, message } = await response.json()
			if (status === 'success') {
				console.log('Account/Game created:', data)
				// Set the connected game in the Web3Provider for global state
				if (data) loadGameForAccount(data)
			} else {
				console.error('Failed to create account for game:', message)
			}
		} catch (error) {
			console.error('Failed to create account for game:', error)
		}
	}

	return (
		<Box>
			<Typography variant="h3" textAlign="center" gutterBottom>
				Create a New Game
			</Typography>
			<Typography mb={4}>
				It looks like you are not participating in any games at the moment. Click the button to create a new game.
			</Typography>
			<Button
				variant="contained"
				color="secondary"
				onClick={() => setOpen(true)}
				disabled={submitLoading}
				sx={styles.btn}
			>
				{submitLoading ? <CircularProgress size={20} color="inherit" sx={{ my: 0.5, mx: 4 }} /> : 'Create Game'}
			</Button>
			<NewGameDialog open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
			{signError && !submitLoading && (
				<Typography color="error" mt={4}>
					Please sign the message to create your commitment for the new game.
				</Typography>
			)}
			{submitError && (
				<Typography color="error" mt={4}>
					There was an error creating your game. Please check the console and try again.
				</Typography>
			)}
		</Box>
	)
}

export default CreateNewGame
