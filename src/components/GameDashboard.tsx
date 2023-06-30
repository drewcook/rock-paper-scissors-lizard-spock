import { Box, Grid, Link, Typography } from '@mui/material'

import PlayerMoves from './PlayerMoves'
import { useWeb3 } from './Web3Provider'

const GameDashboard = (): JSX.Element => {
	const { gameAddress, sendTxLoading, sendTxError } = useWeb3()

	return (
		<Box>
			{sendTxLoading && <Typography>Transaction is loading...</Typography>}
			{sendTxError && <Typography color="error">Transaction Error: {sendTxError.toString()}</Typography>}
			<Typography variant="h3" textAlign="center" gutterBottom>
				Current Game
			</Typography>
			<Typography mt={4} mb={4}>
				Game Contract Address:{' '}
				<Link href={`https://sepolia.etherscan.io/contract/${gameAddress}`}>View on Sepolia</Link>
			</Typography>
			<Grid container spacing={2} mt={4}>
				<Grid item xs={12} sm={6}>
					<PlayerMoves name="Player 1" />
				</Grid>
				<Grid item xs={12} sm={6}>
					<PlayerMoves name="Player 2" />
				</Grid>
			</Grid>
		</Box>
	)
}
export default GameDashboard
