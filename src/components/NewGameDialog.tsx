import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { isAddress, isAddressEqual } from 'viem'

import { Move } from '@/lib/types'

import { useWeb3 } from './Web3Provider'

type NewGameDialogProps = {
	open: boolean
	onClose: () => void
	onSubmit: (selectedMove: Move, opponentAddress: string, stake: number, customMessage: string) => void
}

const NewGameDialog = ({ open, onClose, onSubmit }: NewGameDialogProps) => {
	// State
	const [selectedMove, setSelectedMove] = useState<Move | string>(Move.Null)
	const [opponentAddress, setOpponentAddress] = useState<string>('')
	const [stakeAmount, setStakeAmount] = useState<number>(0.1)
	const [customMessage, setCustomMessage] = useState<string>('')
	const [validationError, setValidationError] = useState('')
	// Hooks
	const { address } = useWeb3()

	const handleClose = () => {
		onClose()
		setSelectedMove(Move.Null)
		setOpponentAddress('')
		setStakeAmount(0.1)
		setCustomMessage('')
		setValidationError('')
	}

	const handleSubmit = () => {
		// Validate values before calling submit handler
		if (selectedMove === Move.Null) {
			setValidationError('Please select a move')
		} else if (!isAddress(opponentAddress) || opponentAddress === '0x0') {
			setValidationError('Please enter a valid Ethereum account address')
		} else if (address && isAddressEqual(opponentAddress, address)) {
			setValidationError('You cannot play against yourself')
		} else if (stakeAmount === 0 || stakeAmount < 0) {
			setValidationError('Please enter a valid stake amount')
		} else if (customMessage.trim() === '' || customMessage.trim().length < 1) {
			setValidationError('Please enter a message for your identity')
		} else {
			// All validations pass, pass form values to handler
			onSubmit(selectedMove as Move, opponentAddress, stakeAmount, customMessage)
			handleClose()
		}
	}

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Create a New Game</DialogTitle>
			<DialogContent>
				<Typography mb={2}>
					Enter in your move, who you will play, how much to stake, and a message that will be used to generate a unique
					identity for your account. This is for verifying that only <em>your account</em> can solve the game and reveal
					the winner.
				</Typography>
				<FormControl fullWidth variant="outlined" required margin="normal">
					<InputLabel>Select Initial Move</InputLabel>
					<Select value={selectedMove} onChange={e => setSelectedMove(e.target.value)} label="Select Initial Move">
						<MenuItem value={Move.Rock}>Rock</MenuItem>
						<MenuItem value={Move.Paper}>Paper</MenuItem>
						<MenuItem value={Move.Scissors}>Scissors</MenuItem>
						<MenuItem value={Move.Spock}>Spock</MenuItem>
						<MenuItem value={Move.Lizard}>Lizard</MenuItem>
					</Select>
				</FormControl>
				<TextField
					label="Opponent Address"
					value={opponentAddress}
					onChange={e => setOpponentAddress(e.target.value)}
					fullWidth
					variant="outlined"
					placeholder="A valid Ethereum account address 0x..."
					required
					margin="normal"
				/>
				<TextField
					label="Stake Amount (Ether)"
					type="number"
					value={stakeAmount}
					onChange={e => setStakeAmount(parseFloat(e.target.value))}
					fullWidth
					variant="outlined"
					required
					margin="normal"
				/>
				<TextField
					label="Identity Message"
					value={customMessage}
					onChange={e => setCustomMessage(e.target.value)}
					fullWidth
					variant="outlined"
					placeholder="This message will be used to generate your identity"
					required
					margin="normal"
				/>
				{validationError && (
					<Typography variant="caption" color="error" textAlign="center" mt={2}>
						{validationError}
					</Typography>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleSubmit} variant="contained" color="primary">
					Create New Game
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default NewGameDialog
