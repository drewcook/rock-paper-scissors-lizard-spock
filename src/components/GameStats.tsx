import { OpenInNew } from '@mui/icons-material'
import { Box, Divider, Link, Typography } from '@mui/material'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import { IAccountDoc } from '@/lib/models'
import { Move } from '@/lib/types'
import { formatAddressLong } from '@/utils/formatAddress'
import { moveDisplayName } from '@/utils/moveDisplayName'

import { useWeb3 } from './Web3Provider'

type GameStatsProps = {
	connectedGame: IAccountDoc
}

const GameStats = ({ connectedGame }: GameStatsProps): JSX.Element => {
	const { publicClient, readGameValue } = useWeb3()
	const [gameBalance, setGameBalance] = useState<string>('0')
	const [player, setPlayer] = useState<unknown>()
	const [opponent, setOpponent] = useState<unknown>()
	const [lastAction, setLastAction] = useState<string>()
	const [timeout, setTimeout] = useState<unknown>()
	const [stake, setStake] = useState<unknown>()
	const [c1Hash, setC1Hash] = useState<unknown>()
	const [j2Move, setJ2Move] = useState<unknown>()
	// const [winner, setWinner] = useState<string>('')
	// const [loser, setLoser] = useState<string>('')

	// Contract Getters
	// Perform on-chain reads to get contract values
	useEffect(() => {
		const getGameValues = async () => {
			const balance = await publicClient?.getBalance({ address: connectedGame.gameAddress })
			const _j1 = await readGameValue('j1')
			const _j2 = await readGameValue('j2')
			const _lastAction = await readGameValue('lastAction')
			const _timeout = await readGameValue('TIMEOUT')
			const _stake = await readGameValue('stake')
			const _c1Hash = await readGameValue('c1Hash')
			const _j2Move = await readGameValue('c2')
			setGameBalance(`${Number(balance)}`)
			setPlayer(_j1)
			setOpponent(_j2)
			setLastAction(format(new Date(Number(_lastAction)), 'MM/dd/yyyy @ HH:mm a'))
			setTimeout(_timeout)
			setStake(_stake)
			setC1Hash(_c1Hash)
			setJ2Move(_j2Move)
		}
		getGameValues()
	}, [])

	return (
		<>
			{/* TODO: Read data from contract, i.e. stake, players, hash, etc */}
			<Typography variant="h4" textAlign="left" mb={4}>
				Game Info
			</Typography>
			<Box textAlign="left">
				<Typography mb={2}>
					Game Contract:
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
					{`${stake}`} ETH
				</Typography>
				<Typography mb={2}>
					Contract Balance:
					<br />
					{gameBalance} ETH
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
							{`${player}`}&nbsp;
							<OpenInNew fontSize="inherit" />
						</Typography>
					</Link>
				</Typography>
				<Typography mb={2}>
					Player 1 Move Commitment:
					<br />
					<Typography variant="body2" component="span">
						{formatAddressLong(`${c1Hash}`)}
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
							{`${opponent}`}&nbsp;
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
						{`${Number(timeout) / 60} minutes`}
					</Typography>
				</Typography>
			</Box>
		</>
	)
}
export default GameStats
