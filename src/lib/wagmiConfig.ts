'use client'
import { configureChains, createConfig, sepolia } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

// Configure chains & providers with the Alchemy provider.
const { chains, publicClient, webSocketPublicClient } = configureChains(
	[sepolia],
	[alchemyProvider({ apiKey: `${process.env.NEXT_PUBLIC_ALCHEMY_RPC_KEY}` }), publicProvider()],
)

// Set up wagmi config
export const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: [
		new InjectedConnector({
			chains,
			options: {
				name: 'Browser Wallet',
				shimDisconnect: true,
			},
		}),
		new MetaMaskConnector({ chains }),
	],
	publicClient,
	webSocketPublicClient,
})
