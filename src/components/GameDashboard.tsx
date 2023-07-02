import { OpenInNew } from '@mui/icons-material'
import { Box, CircularProgress, Grid, Link, Typography } from '@mui/material'

import { AccountStatus } from '@/lib/types'
import { formatAddressLong } from '@/utils/formatAddress'

import PlayerMoves from './PlayerMoves'
import { useWeb3 } from './Web3Provider'

type GameDashboardProps = {
	accountStatus: AccountStatus
}

const GameDashboard = ({ accountStatus }: GameDashboardProps): JSX.Element => {
	const { connectedGame } = useWeb3()

	if (accountStatus === AccountStatus.Loading)
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
			{/* {sendTxLoading && <Typography>Transaction is loading...</Typography>}
			{sendTxError && <Typography color="error">Transaction Error: {sendTxError.toString()}</Typography>} */}
			<Typography variant="h3" textAlign="center">
				Current Game
			</Typography>
			<Grid container spacing={2} mt={4}>
				<Grid item xs={12} md={6}>
					{/* TODO: Read data from contract, i.e. stake, players, hash, etc */}
					<Typography variant="h4" textAlign="left" mb={4}>
						Game Data
					</Typography>
					<Box textAlign="left">
						<Typography mb={2}>
							Game Address:
							<br />
							<Link href={`https://sepolia.etherscan.io/address/${connectedGame.gameAddress}`} target="_blank">
								<Typography
									variant="body2"
									component="span"
									display="inline-flex"
									alignItems="center"
									justifyContent="center"
									flexDirection="row"
								>
									{connectedGame.gameAddress}&nbsp;
									<OpenInNew fontSize="inherit" />
								</Typography>
							</Link>
						</Typography>
						<Typography mb={2}>
							Game Stake:
							<br />
							{connectedGame.stake} ETH
						</Typography>
						<Typography mb={2}>
							Player 1:
							<br />
							<Link href={`https://sepolia.etherscan.io/address/${connectedGame.player}`} target="_blank">
								<Typography
									variant="body2"
									component="span"
									display="inline-flex"
									alignItems="center"
									justifyContent="center"
									flexDirection="row"
								>
									{connectedGame.player}&nbsp;
									<OpenInNew fontSize="inherit" />
								</Typography>
							</Link>
						</Typography>
						<Typography mb={2}>
							Player 2:
							<br />
							<Link href={`https://sepolia.etherscan.io/address/${connectedGame.opponent}`} target="_blank">
								<Typography
									variant="body2"
									component="span"
									display="inline-flex"
									alignItems="center"
									justifyContent="center"
									flexDirection="row"
								>
									{connectedGame.opponent}&nbsp;
									<OpenInNew fontSize="inherit" />
								</Typography>
							</Link>
						</Typography>
						<Typography mb={2}>
							Player 1 Identity Commitment:
							<br />
							<Typography variant="body2" component="span">
								{formatAddressLong(connectedGame.c1Hash)}
							</Typography>
						</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} md={6}>
					<PlayerMoves name="hi" />
				</Grid>
			</Grid>
		</Box>
	)
}
export default GameDashboard
