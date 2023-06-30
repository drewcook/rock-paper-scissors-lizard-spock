'use client'
import { sepolia } from '@wagmi/core/chains'
import { configureChains, createConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

// Support Sepolia and prefer Infura as Main RPC provider with fallbacks
const { chains, publicClient, webSocketPublicClient } = configureChains(
	[sepolia],

	[
		infuraProvider({ apiKey: `${process.env.NEXT_PUBLIC_INFURA_RPC_KEY}` }),
		alchemyProvider({ apiKey: `${process.env.NEXT_PUBLIC_ALCHEMY_RPC_KEY}` }),
		publicProvider(),
	],
)

// Set up wagmi config
export const wagmiConfig = createConfig({
	autoConnect: false,
	connectors: [
		new MetaMaskConnector({ chains }),
		new InjectedConnector({
			chains,
			options: {
				name: 'Browser Wallet',
				shimDisconnect: true,
			},
		}),
	],
	publicClient,
	webSocketPublicClient,
})
