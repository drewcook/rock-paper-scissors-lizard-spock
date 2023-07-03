import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Paper,
	Radio,
	RadioGroup,
	Typography,
} from '@mui/material'
import { format } from 'date-fns'
import { useState } from 'react'
import { numberToBytes } from 'viem'

import { IAccountDoc } from '@/lib/models'
import { AccountStatus, Move } from '@/lib/types'

import { useWeb3 } from './Web3Provider'

const styles = {
	paper: {
		py: 4,
		px: 2,
		m: 0,
	},
	btn: {
		mt: 2,
		'&:last-child': {
			mb: 0,
		},
	},
}

type GameMovesProps = {
	connectedGame: IAccountDoc
	timeoutExpired: boolean
	canSolve: boolean
}

const GameMoves = ({ connectedGame, timeoutExpired, canSolve }: GameMovesProps): JSX.Element => {
	const { accountStatus, readGameValue, makeGameTransaction } = useWeb3()
	const [lastAction, setLastAction] = useState<string>('')
	const [openDialog, setOpenDialog] = useState<boolean>(false)
	const [selectedMove, setSelectedMove] = useState<Move>(Move.Rock)

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	const handleMoveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedMove(event.target.value as Move)
	}

	// For any player to get the timestamp of the last action
	const handleGetLastAction = async () => {
		// Validation guard / Access-control
		const data = await readGameValue('lastAction')
		setLastAction(format(new Date(Number(data)), 'MM/dd/yyyy @ HH:mm a'))
	}

	// For both player and opponent to call to check if opposite player has timed out
	const handleCheckTimeout = async () => {
		try {
			// // Validation guard / Access-control
			if (accountStatus !== AccountStatus.Player) {
				const hash = await makeGameTransaction('j2Timeout', [], 0)
				console.log('Timeout checked successfully!', hash)
			}
			// Validation guard / Access-control
			if (accountStatus !== AccountStatus.Opponent) {
				const hash = await makeGameTransaction('j1Timeout', [], 0)
				console.log('Timeout checked successfully!', hash)
			}
		} catch (error: any) {
			console.log('Error checking timeout:', error)
		}
	}

	// For opponent to call to make their move
	const handleMakeMove = async () => {
		try {
			// Validation guard / Access-control
			if (accountStatus === AccountStatus.Opponent) {
				const hash = await makeGameTransaction('play', [numberToBytes(Number(selectedMove))], connectedGame.stake)
				console.log('Move played successfully!', hash)
				handleCloseDialog()
			}
		} catch (error: any) {
			console.log('Error playing move:', error)
		}
	}

	// For player to call to solve the game, using the salt tied to their initial move hash
	const handleSolve = async () => {
		try {
			// Validation guard / Access-control
			if (accountStatus === AccountStatus.Player) {
				const hash = await makeGameTransaction('solve', [connectedGame.move, connectedGame.c1Hash], 0)
				console.log('Game solved successfully!', hash)
			}
		} catch (error: any) {
			console.log('Error solving game:', error)
		}
	}

	const PlayerActions = (): JSX.Element => (
		<>
			<Button variant="contained" onClick={handleGetLastAction} fullWidth sx={styles.btn}>
				Get Last Action
			</Button>
			<Typography variant="caption" display="block" color="caution" mt={0.5} mb={0} textAlign="left">
				Last Action: {lastAction && lastAction}
			</Typography>
			<Button
				variant="contained"
				onClick={handleCheckTimeout}
				fullWidth
				sx={styles.btn}
				disabled={!timeoutExpired}
				color="secondary"
			>
				Initiate J2 Timeout
			</Button>
			<Typography variant="caption" display="block" color="caution" mt={0.5} mb={0} textAlign="left">
				{timeoutExpired ? 'Timeout has expired' : 'Timeout has not expired yet'}
			</Typography>
			<Button
				variant="contained"
				onClick={handleSolve}
				fullWidth
				sx={styles.btn}
				color="secondary"
				disabled={!canSolve}
			>
				Solve Game
			</Button>
		</>
	)

	const OpponentActions = (): JSX.Element => (
		<>
			<Button variant="contained" onClick={handleGetLastAction} fullWidth sx={styles.btn}>
				Get Last Action
			</Button>
			<Typography variant="caption" display="block" color="caution" mt={0.5} mb={0} textAlign="left">
				Last Action: {lastAction && lastAction}
			</Typography>
			<Button
				variant="contained"
				onClick={handleCheckTimeout}
				fullWidth
				sx={styles.btn}
				disabled={!timeoutExpired}
				color="secondary"
			>
				Initiate J1 Timeout
			</Button>
			<Typography variant="caption" display="block" color="caution" mt={0.5} mb={0} textAlign="left">
				{timeoutExpired ? 'Timeout has expired' : 'Timeout has not expired yet'}
			</Typography>
			<Button variant="contained" onClick={handleOpenDialog} fullWidth sx={styles.btn} color="secondary">
				Make Move
			</Button>
		</>
	)

	const GameMoveDialog = (): JSX.Element => (
		<Dialog open={openDialog} onClose={handleCloseDialog}>
			<DialogTitle>Make Your Move</DialogTitle>
			<DialogContent>
				<Typography variant="body2" color="textSecondary" mb={2}>
					Stake: {`${connectedGame.stake} ETH`}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Select your move:
				</Typography>
				<RadioGroup name="move" value={selectedMove} onChange={handleMoveChange}>
					<FormControlLabel value={Move.Rock} control={<Radio />} label="Rock" />
					<FormControlLabel value={Move.Paper} control={<Radio />} label="Paper" />
					<FormControlLabel value={Move.Scissors} control={<Radio />} label="Scissors" />
					<FormControlLabel value={Move.Lizard} control={<Radio />} label="Lizard" />
					<FormControlLabel value={Move.Spock} control={<Radio />} label="Spock" />
				</RadioGroup>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseDialog}>Cancel</Button>
				<Button onClick={handleMakeMove}>Submit</Button>
			</DialogActions>
		</Dialog>
	)

	return (
		<>
			<Typography variant="h4" mb={4}>
				Available Actions
			</Typography>
			<Paper elevation={2} sx={styles.paper}>
				<Typography variant="h6" mb={2}>
					As the <strong>{accountStatus}</strong> in this game, you have the following actions available for you to
					call:
				</Typography>
				{accountStatus === AccountStatus.Player && <PlayerActions />}
				{accountStatus === AccountStatus.Opponent && <OpponentActions />}
			</Paper>
			<GameMoveDialog />
		</>
	)
}

export default GameMoves
