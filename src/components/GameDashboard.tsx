import { Box, CircularProgress, Grid, Typography } from '@mui/material'

import { AccountStatus } from '@/lib/types'

import GameMoves from './GameMoves'
import GameStats from './GameStats'
import { useWeb3 } from './Web3Provider'

type GameDashboardProps = {
	accountStatus: AccountStatus
}

const GameDashboard = ({ accountStatus }: GameDashboardProps): JSX.Element => {
	const { connectedGame } = useWeb3()

	const showLoading = accountStatus === AccountStatus.Loading

	if (showLoading)
		return (
			<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" my={4}>
				<CircularProgress size={30} />
				<Typography variant="caption" mt={2}>
					Checking account status...
				</Typography>
			</Box>
		)

	// Fallback
	if (!connectedGame) return <Typography>Connect your wallet to view your game</Typography>

	return (
		<Box>
			<Typography variant="h3" textAlign="center">
				Current Game
			</Typography>
			<Grid container spacing={4} mt={4}>
				<Grid item xs={12} md={6}>
					<GameMoves connectedGame={connectedGame} />
				</Grid>
				<Grid item xs={12} md={6}>
					<GameStats connectedGame={connectedGame} />
				</Grid>
			</Grid>
		</Box>
	)
}
export default GameDashboard
