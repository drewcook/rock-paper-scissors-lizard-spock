import { OpenInNew } from '@mui/icons-material'
import { Box, Grid, Link, Typography } from '@mui/material'

import { AccountStatus } from '@/lib/types'

import PlayerMoves from './PlayerMoves'
import { useWeb3 } from './Web3Provider'

type GameDashboardProps = {
	accountStatus: AccountStatus
}

const GameDashboard = ({ accountStatus }: GameDashboardProps): JSX.Element => {
	const {
		connectedAccount,
		/*sendTxLoading, sendTxError*/
	} = useWeb3()

	// Fallback
	if (!connectedAccount) return <Typography>Connect your wallet to view your game</Typography>

	return (
		<Box>
			{/* {sendTxLoading && <Typography>Transaction is loading...</Typography>}
			{sendTxError && <Typography color="error">Transaction Error: {sendTxError.toString()}</Typography>} */}
			<Typography variant="h3" textAlign="center">
				Current Game
			</Typography>
			<Typography mb={4}>Connected Account Status: {accountStatus}</Typography>
			<Grid container spacing={2} mt={4}>
				<Grid item xs={12} md={6}>
					{/* TODO: Read data from contract, i.e. stake, players, hash, etc */}
					<Typography variant="h4" textAlign="center" mb={4}>
						Game Data
					</Typography>
					<Box textAlign="left">
						<Typography mb={2}>
							Game Address:
							<br />
							<Link href={`https://sepolia.etherscan.io/address/${connectedAccount.gameAddress}`} target="_blank">
								<Typography
									component="span"
									display="inline-flex"
									alignItems="center"
									justifyContent="center"
									flexDirection="row"
								>
									{connectedAccount.gameAddress} <OpenInNew />
								</Typography>
							</Link>
						</Typography>
						<Typography mb={2}>
							Game Stake:
							<br />
							{connectedAccount.stake} ETH
						</Typography>
						<Typography mb={2}>
							Player 1:
							<br />
							<Link href={`https://sepolia.etherscan.io/address/${connectedAccount.player}`} target="_blank">
								<Typography
									component="span"
									display="inline-flex"
									alignItems="center"
									justifyContent="center"
									flexDirection="row"
								>
									{connectedAccount.player}
									<OpenInNew />
								</Typography>
							</Link>
						</Typography>
						<Typography mb={2}>
							Player 2:
							<br />
							<Link href={`https://sepolia.etherscan.io/address/${connectedAccount.opponent}`} target="_blank">
								<Typography
									component="span"
									display="inline-flex"
									alignItems="center"
									justifyContent="center"
									flexDirection="row"
								>
									{connectedAccount.opponent}
									<OpenInNew />
								</Typography>
							</Link>
						</Typography>
						<Typography mb={2}>
							Player 1 Identity Commitment:
							<br />
							{connectedAccount.c1Hash}
						</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} md={6}>
					<PlayerMoves name="Player 2" />
				</Grid>
			</Grid>
		</Box>
	)
}
export default GameDashboard
