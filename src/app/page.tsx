'use client' // Compatibility issue between Next v13 and MUI v5 - see https://github.com/mui/material-ui/issues/34898 & https://github.com/vercel/next.js/issues/41994
import { Box, Grid, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useAccount } from 'wagmi'

import CreaateGameButton from '@/components/CreateGameButton'
import PlayerMoves from '@/components/PlayerMoves'

import styles from './page.module.css'

const AppPage: NextPage = () => {
	const { isConnected } = useAccount()
	// Representing if a connected account is participating in a game
	const isParticipating = false

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
				) : (
					<>
						{isParticipating ? (
							<Box>
								<Typography variant="h3" textAlign="center" gutterBottom>
									Current Game
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
						) : (
							<Box>
								<Typography variant="h3" textAlign="center" gutterBottom>
									Create a New Game
								</Typography>
								<Typography mb={4}>
									It looks like you are not participating in any games at the moment. Click the button to create a new
									game.
								</Typography>
								<CreaateGameButton />
							</Box>
						)}
					</>
				)}
			</Box>
		</Box>
	)
}
export default AppPage
