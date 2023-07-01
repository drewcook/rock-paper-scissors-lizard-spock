'use client'
import { Box, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import CreateNewGame from '@/components/CreateNewGame'
import GameDashboard from '@/components/GameDashboard'
import { useWeb3 } from '@/components/Web3Provider'
import { IAccountDoc } from '@/lib/models'
import { AccountStatus } from '@/lib/types'

import styles from './page.module.css'

const AppPage: NextPage = () => {
	const { address, isConnected } = useAccount()
	const { connectedAccount } = useWeb3()
	const [accountStatus, setAccountStatus] = useState<AccountStatus>(AccountStatus.Unregistered)

	useEffect(() => {
		if (isConnected) checkIsParticipating(connectedAccount)
	}, [isConnected, connectedAccount, address])

	// Representing if a connected account is participating in a game
	const checkIsParticipating = (account: IAccountDoc | undefined) => {
		if (!account) {
			console.log('not participating')
			setAccountStatus(AccountStatus.Unregistered)
		} else if (account.player === address) {
			// Connected account is initiating player
			console.log('player')
			setAccountStatus(AccountStatus.Player)
		} else if (account.opponent === address) {
			// Connected account is opponent
			console.log('opponent')
			setAccountStatus(AccountStatus.Opponent)
		} else {
			setAccountStatus(AccountStatus.Unregistered)
		}
	}

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
				) : accountStatus === AccountStatus.Unregistered ? (
					<CreateNewGame />
				) : (
					<GameDashboard accountStatus={accountStatus} />
				)}
			</Box>
		</Box>
	)
}
export default AppPage
