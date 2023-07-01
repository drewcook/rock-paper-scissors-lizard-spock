import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './globals.css'

import { Inter } from 'next/font/google'
import { WagmiConfig } from 'wagmi'

import App from '@/components/App'
import { Web3Provider } from '@/components/Web3Provider'
import { wagmiConfig } from '@/lib/wagmiConfig'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Rock Paper Scissors Lizard Spock',
	description: 'An on-chain game of Rock Paper Scissors Lizard Spock between two different players.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta name="description" content="Play rock paper scissors lizard spock with crypto." />
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,600;0,800;1,300;1,400;1,600;1,800&display=swap"
					rel="stylesheet"
				/>
				<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
			</head>
			<body className={inter.className}>
				<WagmiConfig config={wagmiConfig}>
					<Web3Provider>
						<App>{children}</App>
					</Web3Provider>
				</WagmiConfig>
			</body>
		</html>
	)
}
