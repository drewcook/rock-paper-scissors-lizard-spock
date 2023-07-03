'use client'
import { Alert, Snackbar, ThemeProvider } from '@mui/material'
import { ReactNode } from 'react'

import theme from '@/lib/theme'

import AppHeader from './AppHeader'
import { useWeb3 } from './Web3Provider'

type AppProps = {
	children: ReactNode
}

const App = ({ children }: AppProps): JSX.Element => {
	const { txSuccess, txError, resetTxNotifications } = useWeb3()

	return (
		<ThemeProvider theme={theme}>
			<>
				<AppHeader />
				{children}
				<Snackbar
					open={!!txSuccess}
					autoHideDuration={6000}
					onClose={resetTxNotifications}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					color="inherit"
				>
					<Alert variant="filled" severity="success" elevation={6} onClose={resetTxNotifications}>
						Successfully sent transaction
					</Alert>
				</Snackbar>
				<Snackbar
					open={!!txError}
					autoHideDuration={6000}
					onClose={resetTxNotifications}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				>
					<Alert variant="filled" severity="error" elevation={6} onClose={resetTxNotifications}>
						{txError}
					</Alert>
				</Snackbar>
			</>
		</ThemeProvider>
	)
}

export default App
