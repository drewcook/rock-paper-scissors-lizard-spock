'use client'
import { ThemeProvider } from '@mui/material'
import { ReactNode } from 'react'

import theme from '@/lib/theme'

import AppHeader from './AppHeader'

type AppProps = {
	children: ReactNode
}

const App = ({ children }: AppProps): JSX.Element => {
	return (
		<ThemeProvider theme={theme}>
			<>
				<AppHeader />
				{children}
			</>
		</ThemeProvider>
	)
}

export default App
