import { OpenInNew } from '@mui/icons-material'
import { Box, Grid, Link, Typography } from '@mui/material'

import { AccountStatus } from '@/lib/types'

import PlayerMoves from './PlayerMoves'
import { useWeb3 } from './Web3Provider'

type GameDashboardProps = {
	accountStatus: AccountStatus
}

const GameDashboard = ({ accountStatus }: GameDashboardProps): JSX.Element => {
	const { connectedAccount /*sendTxLoading, sendTxError*/ } = useWeb3()

	// Fallback
	if (!connectedAccount) return <Typography>Connect your wallet to view your game</Typography>

	return (
		<Box>
			{/* {sendTxLoading && <Typography>Transaction is loading...</Typography>}
			{sendTxError && <Typography color="error">Transaction Error: {sendTxError.toString()}</Typography>} */}
			<Typography variant="h3" textAlign="center" gutterBottom>
				Current Game
			</Typography>
			<Typography mt={4} mb={4}>
				Game Contract Address:{' '}
				<Link href={`https://sepolia.etherscan.io/address/${connectedAccount.gameAddress}`} target="_blank">
					<Typography
						component="span"
						display="inline-flex"
						alignItems="center"
						justifyContent="center"
						flexDirection="row"
					>
						View on Sepolia <OpenInNew />
					</Typography>
				</Link>
			</Typography>
			<Typography mb={4}>Connected Account Status: {accountStatus}</Typography>
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
