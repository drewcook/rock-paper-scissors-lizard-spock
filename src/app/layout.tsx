import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './globals.css'

import { Inter } from 'next/font/google'
import { WagmiConfig } from 'wagmi'

import AppHeader from '@/components/AppHeader'
import { wagmiConfig } from '@/lib/wagmiConfig'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Rock Paper Scissors Lizard Spock',
	description: 'An on-chain game of Rock Paper Scissors Lizard Spock between two different players.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<WagmiConfig config={wagmiConfig}>
					<>
						<AppHeader />
						{children}
					</>
				</WagmiConfig>
			</body>
		</html>
	)
}
