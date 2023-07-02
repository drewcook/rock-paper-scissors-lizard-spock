'use client'
import { Alert, Box, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useAccount } from 'wagmi'

import CreateNewGame from '@/components/CreateNewGame'
import GameDashboard from '@/components/GameDashboard'
import { useWeb3 } from '@/components/Web3Provider'
import { AccountStatus } from '@/lib/types'

import styles from './page.module.css'

const AppPage: NextPage = () => {
	const { isConnected } = useAccount()
	const { accountStatus, showWrongNetwork } = useWeb3()
	const showDisconnected = !isConnected || accountStatus === AccountStatus.Disconnected
	const showUnregistered = accountStatus === AccountStatus.Unregistered

	const WelcomeMessage = (): JSX.Element => (
		<Box>
			<Typography variant="h3" textAlign="center" gutterBottom>
				Welcome!
			</Typography>
			<Typography variant="subtitle1" mb={4}>
				This is a variant of the classic game of &quot;rock-paper-scissors&quot; but with two additional weapons, lizard
				and spock.
			</Typography>
			<Typography variant="subtitle2">
				FUN FACT:{' '}
				<i>
					This variant was first mentioned in a 2005 article in The Times of London and was later the subject of an
					episode of the American sitcom The Big Bang Theory in 2008.
				</i>
			</Typography>
		</Box>
	)

	const Disconnected = (): JSX.Element => (
		<>
			<WelcomeMessage />
			<Typography variant="h6" component="p" textAlign="center" mt={4}>
				Connect your wallet to start a new game or join one you are participating in!
			</Typography>
		</>
	)

	const WrongNetwork = (): JSX.Element => (
		<>
			<WelcomeMessage />
			<Alert severity="warning" sx={{ mt: 4 }}>
				You are on an unsupported network. Please switch to the Sepolia test network.
			</Alert>
		</>
	)

	const Unregistered = (): JSX.Element => <CreateNewGame />
	const Registered = (): JSX.Element => <GameDashboard accountStatus={accountStatus} />

	return (
		<Box component="main" className={styles.main}>
			<Box component="section" textAlign="center">
				{showWrongNetwork ? (
					<WrongNetwork />
				) : showDisconnected ? (
					<Disconnected />
				) : showUnregistered ? (
					<Unregistered />
				) : (
					<Registered />
				)}
			</Box>
		</Box>
	)
}
export default AppPage
