import { OpenInNew } from '@mui/icons-material'
import { Box, Divider, Link, Typography } from '@mui/material'
import { formatEther } from 'viem'

import { Move } from '@/lib/types'
import { formatAddressLong } from '@/utils/formatAddress'
import { moveDisplayName } from '@/utils/moveDisplayName'

type GameStatsProps = {
	gameAddress: string
	gameBalance: number
	player: string
	opponent: string
	lastAction: string
	timeout: number
	stake: number
	c1Hash: string
	j2Move: Move
}

const GameStats = ({
	gameAddress,
	gameBalance,
	player,
	opponent,
	lastAction,
	timeout,
	stake,
	c1Hash,
	j2Move,
}: GameStatsProps): JSX.Element => (
	<>
		<Typography variant="h4" textAlign="left" mb={4}>
			Game Info
		</Typography>
		<Box textAlign="left">
			<Typography mb={2}>
				Game Contract:
				<br />
				<Link href={`https://sepolia.etherscan.io/address/${gameAddress}`} target="_blank">
					<Typography
						variant="body2"
						component="span"
						display="inline-flex"
						alignItems="center"
						justifyContent="center"
						flexDirection="row"
					>
						{gameAddress}&nbsp;
						<OpenInNew fontSize="inherit" />
					</Typography>
				</Link>
			</Typography>
			<Typography mb={2}>
				Game Stake:
				<br />
				{formatEther(BigInt(stake))} ETH
			</Typography>
			<Typography mb={2}>
				Contract Balance:
				<br />
				{formatEther(BigInt(gameBalance))} ETH
			</Typography>
			<Divider sx={{ my: 2 }} />
			<Typography mb={2}>
				Player 1:
				<br />
				<Link href={`https://sepolia.etherscan.io/address/${player}`} target="_blank">
					<Typography
						variant="body2"
						component="span"
						display="inline-flex"
						alignItems="center"
						justifyContent="center"
						flexDirection="row"
					>
						{player}&nbsp;
						<OpenInNew fontSize="inherit" />
					</Typography>
				</Link>
			</Typography>
			<Typography mb={2}>
				Player 1 Move Commitment:
				<br />
				<Typography variant="body2" component="span">
					{formatAddressLong(c1Hash)}
				</Typography>
			</Typography>
			<Divider sx={{ my: 2 }} />
			<Typography mb={2}>
				Player 2:
				<br />
				<Link href={`https://sepolia.etherscan.io/address/${opponent}`} target="_blank">
					<Typography
						variant="body2"
						component="span"
						display="inline-flex"
						alignItems="center"
						justifyContent="center"
						flexDirection="row"
					>
						{opponent}&nbsp;
						<OpenInNew fontSize="inherit" />
					</Typography>
				</Link>
			</Typography>
			<Typography mb={2}>
				Player 2 Move Commitment:
				<br />
				<Typography variant="body2" component="span">
					{moveDisplayName(String(j2Move) as Move)}
				</Typography>
			</Typography>
			<Divider sx={{ my: 2 }} />
			<Typography mb={2}>
				Last Action:
				<br />
				<Typography variant="body2" component="span">
					{lastAction}
				</Typography>
			</Typography>
			<Typography mb={2}>
				Timeout:
				<br />
				<Typography variant="body2" component="span">
					{`${timeout / 60} minutes`}
				</Typography>
			</Typography>
		</Box>
	</>
)

export default GameStats
