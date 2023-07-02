'use client'
import { Button, Paper, Typography } from '@mui/material'
import { format } from 'date-fns'
import { useState } from 'react'
import { parseEther } from 'viem'

import { Move } from '@/lib/types'

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

type PlayerMovesProps = {
	name: string
}

const PlayerMoves = ({ name }: PlayerMovesProps): JSX.Element => {
	const { contracts } = useWeb3()
	const [lastAction, setLastAction] = useState<string>('')

	// For any player to get the timestamp of the last action
	const handleGetLastAction = async () => {
		const lastActionTimeStamp = await contracts?.game.read.lastAction()
		setLastAction(format(new Date(Number(lastActionTimeStamp)), 'yyyy-MM-dd HH:mm:ss'))
	}

	// For opponent to make their move
	const handleMakeMove = async (move: Move) => {
		console.log('contract', contracts?.game)
		const response = await contracts?.game.simulate.play({ args: [move], value: parseEther('0.38') })
		console.log({ response })
	}

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
			<Button variant="contained" onClick={handleGetLastAction} fullWidth sx={styles.btn}>
				Get Last Action
			</Button>
			<Button variant="contained" onClick={() => handleMakeMove(Move.Spock)} fullWidth sx={styles.btn}>
				Make Move
			</Button>
		</Paper>
	)
}

export default PlayerMoves
