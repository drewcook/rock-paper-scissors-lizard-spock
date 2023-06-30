'use client'
import { Box, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useAccount } from 'wagmi'

import CreateNewGame from '@/components/CreateNewGame'
import GameDashboard from '@/components/GameDashboard'
import { useWeb3 } from '@/components/Web3Provider'

import styles from './page.module.css'

const AppPage: NextPage = () => {
	const { isConnected } = useAccount()
	// Representing if a connected account is participating in a game
	// TODO: Determine basec off connected account and database if they have a game in progress
	const { gameAddress } = useWeb3()
	const isParticipating = gameAddress !== null && gameAddress !== undefined

	return (
		<Box component="main" className={styles.main}>
			<Box component="section" textAlign="center">
				{!isConnected ? (
					<Box>
						<Typography variant="h3" textAlign="center" gutterBottom>
							Welcome!
						</Typography>
						<Typography variant="subtitle1" mb={4}>
							This is a variant of the classic game of &quot;rock-paper-scissors&quot; but with two additional weapons,
							lizard and spock.
						</Typography>
						<Typography variant="subtitle2">
							FUN FACT:{' '}
							<i>
								This variant was first mentioned in a 2005 article in The Times of London and was later the subject of
								an episode of the American sitcom The Big Bang Theory in 2008.
							</i>
						</Typography>
						<Typography variant="h6" component="p" mt={4}>
							Connect your wallet to start a new game or join one you are participating in!
						</Typography>
					</Box>
				) : isParticipating ? (
					<GameDashboard />
				) : (
					<CreateNewGame />
				)}
			</Box>
		</Box>
	)
}
export default AppPage
