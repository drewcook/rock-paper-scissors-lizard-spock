import { RefreshOutlined } from '@mui/icons-material'
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import { format } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'

import { AccountStatus, Move } from '@/lib/types'

import GameMoves from './GameMoves'
import GameStats from './GameStats'
import { useWeb3 } from './Web3Provider'

type GameDashboardProps = {
	accountStatus: AccountStatus
}

const GameDashboard = ({ accountStatus }: GameDashboardProps): JSX.Element => {
	// Hooks
	const { connectedGame, readGameValue } = useWeb3()
	// State
	const [gameBalance, setGameBalance] = useState<number>(0)
	const [player, setPlayer] = useState<string>('')
	const [opponent, setOpponent] = useState<string>('')
	const [lastAction, setLastAction] = useState<string>('')
	const [timeout, setTimeout] = useState<number>(0)
	const [timeoutHasExpired, setTimeoutHasExpired] = useState<boolean>(false)
	const [stake, setStake] = useState<number>(0)
	const [c1Hash, setC1Hash] = useState<string>('')
	const [j2Move, setJ2Move] = useState<Move>(Move.Null)
	const showLoading = accountStatus === AccountStatus.Loading

	useEffect(() => {
		if (connectedGame) {
			// Perform on-chain reads to get contract values
			const getGameValues = async () => {
				const balance = await readGameValue('balance')
				const _j1 = await readGameValue('j1')
				const _j2 = await readGameValue('j2')
				const _timeout = await readGameValue('TIMEOUT')
				const _stake = await readGameValue('stake')
				const _c1Hash = await readGameValue('c1Hash')
				const _j2Move = await readGameValue('c2')
				setGameBalance(Number(balance))
				setPlayer(String(_j1))
				setOpponent(String(_j2))
				setTimeout(Number(_timeout))
				setStake(Number(_stake))
				setC1Hash(String(_c1Hash))
				setJ2Move(String(_j2Move) as Move)
			}
			getGameValues()

			// Poll for last action every minute
			getLastAction()
			const interval = setInterval(getLastAction, 60000)
			return () => clearInterval(interval)
		}
	}, [])

	useEffect(() => {
		if (connectedGame && timeout) getLastAction()
	}, [connectedGame])

	// Poll contract for last action to keep both player's UI in sync
	const getLastAction = useCallback(async () => {
		const _lastAction = await readGameValue('lastAction')
		setLastAction(format(new Date(Number(_lastAction)), 'MM/dd/yyyy @ HH:mm a'))
		// Check if timeout has expired for last action
		let _timeout = timeout
		if (!_timeout) {
			_timeout = await readGameValue('TIMEOUT')
			setTimeout(Number(_timeout))
		}
		if (!_lastAction) {
			setTimeoutHasExpired(false)
		} else if (new Date() > new Date(Number(_lastAction) + Number(_timeout) * 1000)) {
			setTimeoutHasExpired(true)
		} else {
			setTimeoutHasExpired(false)
		}
	}, [connectedGame])

	if (showLoading)
		return (
			<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" my={4}>
				<CircularProgress size={30} />
				<Typography variant="caption" mt={2}>
					Checking account status...
				</Typography>
			</Box>
		)

	// Usually between loading and when game contract info is fetched
	if (!connectedGame) {
		return (
			<Box>
				<Typography variant="h3" textAlign="center" gutterBottom>
					Current Game
				</Typography>
				<Typography mb={4}>
					Fetching game details for connected account... Please wait or refresh the page if waiting too long.
				</Typography>
				<Button variant="contained" color="secondary" onClick={() => window.location.reload()}>
					Reload <RefreshOutlined />
				</Button>
			</Box>
		)
	}

	return (
		<Box>
			<Typography variant="h3" textAlign="center" gutterBottom>
				Current Game
			</Typography>
			<Grid container spacing={4} mt={4}>
				<Grid item xs={12} md={6}>
					<GameMoves
						connectedGame={connectedGame}
						timeoutExpired={timeoutHasExpired}
						opponentHasMoved={j2Move !== Move.Null}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<GameStats
						gameAddress={String(connectedGame.gameAddress)}
						gameBalance={gameBalance}
						player={player}
						opponent={opponent}
						lastAction={lastAction}
						timeout={timeout}
						stake={stake}
						c1Hash={c1Hash}
						j2Move={j2Move}
					/>
				</Grid>
			</Grid>
		</Box>
	)
}
export default GameDashboard
