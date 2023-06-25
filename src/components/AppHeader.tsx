'use client'
import { AppBar, Toolbar, Typography } from '@mui/material'

import Profile from './Profile'

const AppHeader = () => (
	<AppBar position="static" color="transparent">
		<Toolbar>
			<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
				Rock Paper Scissors Lizard Spock
			</Typography>
			<Profile />
		</Toolbar>
	</AppBar>
)

export default AppHeader
