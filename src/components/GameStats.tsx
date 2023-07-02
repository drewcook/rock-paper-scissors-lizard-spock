import { OpenInNew } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { IAccountDoc } from '@/lib/models'
import { formatAddressLong } from '@/utils/formatAddress'

import { useWeb3 } from './Web3Provider'

type GameStatsProps = {
	connectedGame: IAccountDoc
}

const GameStats = ({ connectedGame }: GameStatsProps): JSX.Element => {
	const { publicClient } = useWeb3()
	const [gameBalance, setGameBalance] = useState<string>('0.00')

	useEffect(() => {
		const getGameBalance = async () => {
			const balance = await publicClient?.getBalance({
				address: connectedGame.gameAddress,
			})
			setGameBalance(`${Number(balance)}`)
		}
		getGameBalance()
	}, [])

	return (
		<>
			{/* TODO: Read data from contract, i.e. stake, players, hash, etc */}
			<Typography variant="h4" textAlign="left" mb={4}>
				Game Info
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
					Contract Balance:
					<br />
					{gameBalance} ETH
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
		</>
	)
}
export default GameStats
