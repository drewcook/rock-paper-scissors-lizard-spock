'use client'
import { AppBar, Toolbar, Typography } from '@mui/material'

import Profile from './Profile'
import { useWeb3 } from './Web3Provider'

const AppHeader = () => {
	const { accountStatus } = useWeb3()
	return (
		<AppBar position="static" color="transparent">
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Rock Paper Scissors Lizard Spock
				</Typography>
				<Typography variant="caption" textAlign="right" mr={2}>
					Account Status: {accountStatus}
				</Typography>
				<Profile />
			</Toolbar>
		</AppBar>
	)
}

export default AppHeader
