'use client'
import { Button, Paper, Typography } from '@mui/material'
import { format } from 'date-fns'
import { useState } from 'react'
import { parseEther } from 'viem'

import { IAccountDoc } from '@/lib/models'
import { AccountStatus, Move } from '@/lib/types'

import { useWeb3 } from './Web3Provider'

const styles = {
	paper: {
		p: 2,
		m: 2,
	},
	btn: {
		mb: 2,
	},
}

type GameMovesProps = {
	connectedGame: IAccountDoc
}

const GameMoves = ({ connectedGame }: GameMovesProps): JSX.Element => {
	const { accountStatus, contracts } = useWeb3()
	const [lastAction, setLastAction] = useState<string>('')

	// For any player to get the timestamp of the last action
	const handleGetLastAction = async () => {
		const lastActionTimeStamp = await contracts?.game.read.lastAction()
		setLastAction(format(new Date(Number(lastActionTimeStamp)), 'yyyy-MM-dd HH:mm:ss'))
	}

	// For any player to check if the opponent has timed out
	const handleCheckTimeout = async () => {
		const isTimeout = await contracts?.game.read.j1Timeout()
		console.log({ isTimeout })
	}

	// For opponent to make their move
	const handleMakeMove = async (move: Move) => {
		console.log('contract', contracts?.game)
		const response = await contracts?.game.simulate.play({ args: [move], value: parseEther('0.38') })
		console.log({ response })
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
			<Button variant="contained" onClick={() => handleMakeMove(Move.Spock)} fullWidth sx={styles.btn}>
				Make Spock Move
			</Button>
		</>
	)

	return (
		<Paper elevation={2} sx={styles.paper}>
			<Typography variant="h4" mb={4}>
				Available Actions
			</Typography>
			{lastAction && (
				<Typography variant="caption" mb={2} mt={2}>
					Last Action: {lastAction}
				</Typography>
			)}
			{accountStatus === AccountStatus.Player && <PlayerActions />}
			{accountStatus === AccountStatus.Opponent && <OpponentActions />}
		</Paper>
	)
}

export default GameMoves
