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
import { numberToBytes, numberToHex, parseEther, toBytes } from 'viem'

import { RPS_ABI } from '@/lib/constants'
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
		mb: 2,
		'&:last-child': {
			mb: 0,
		},
	},
}

type GameMovesProps = {
	connectedGame: IAccountDoc
}

const GameMoves = ({ connectedGame }: GameMovesProps): JSX.Element => {
	const { address, accountStatus, contracts, publicClient, walletClient } = useWeb3()
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
		const lastActionTimeStamp = await publicClient?.readContract({
			address: connectedGame.gameAddress,
			abi: RPS_ABI,
			functionName: 'lastAction',
		})
		setLastAction(format(new Date(Number(lastActionTimeStamp)), 'MM/dd/yyyy @ HH:mm a'))
	}

	// For any player to check if the opponent has timed out
	const handleCheckTimeout = async () => {
		let resp: any
		if (accountStatus !== AccountStatus.Player) {
			resp = await publicClient?.simulateContract({
				address: connectedGame.gameAddress,
				abi: RPS_ABI,
				account: address,
				functionName: 'j2Timeout',
			})
			const hash = await walletClient?.writeContract(resp.request)
			console.log('Timeout checked successfully!', hash)
		}
		if (accountStatus !== AccountStatus.Opponent) {
			resp = await publicClient?.simulateContract({
				address: connectedGame.gameAddress,
				abi: RPS_ABI,
				account: address,
				functionName: 'j1Timeout',
			})
			const hash = await walletClient?.writeContract(resp.request)
			console.log('Timeout checked successfully!', hash)
		}
		console.log({ resp })
	}

	// For opponent to make their move
	const handleMakeMove = async () => {
		try {
			// @ts-ignore
			const { request } = await publicClient?.simulateContract({
				address: connectedGame.gameAddress,
				abi: RPS_ABI,
				account: address,
				functionName: 'play',
				args: [numberToBytes(Number(selectedMove))],
				value: parseEther(`${connectedGame.stake}`),
			})
			const hash = await walletClient?.writeContract(request)
			console.log('Move played successfully!', hash)
			handleCloseDialog()
		} catch (error: any) {
			console.log('Error playing move:', error, error.message)
		}
	}

	const PlayerActions = (): JSX.Element => (
		<>
			<Button variant="contained" onClick={handleGetLastAction} fullWidth sx={styles.btn}>
				Get Last Action
			</Button>
			<Button variant="contained" onClick={handleCheckTimeout} fullWidth sx={styles.btn}>
				Check Timeout
			</Button>
		</>
	)

	const OpponentActions = (): JSX.Element => (
		<>
			<Button variant="contained" onClick={handleGetLastAction} fullWidth sx={styles.btn}>
				Get Last Action
			</Button>
			<Button variant="contained" onClick={handleCheckTimeout} fullWidth sx={styles.btn}>
				Check Timeout
			</Button>
			<Button variant="contained" onClick={handleOpenDialog} fullWidth sx={styles.btn}>
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
				{lastAction && (
					<Typography variant="caption" display="block" my={4}>
						Last Action: {lastAction}
					</Typography>
				)}
				{accountStatus === AccountStatus.Player && <PlayerActions />}
				{accountStatus === AccountStatus.Opponent && <OpponentActions />}
			</Paper>
			<GameMoveDialog />
		</>
	)
}

export default GameMoves
