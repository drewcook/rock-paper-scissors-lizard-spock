'use client'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Address, getContract, parseEther } from 'viem'
import {
	PublicClient,
	useAccount,
	useDisconnect,
	useNetwork,
	usePublicClient,
	useWalletClient,
	WalletClient,
} from 'wagmi'

import { HASHER_ADDRESS, PREFERRED_CHAIN_ID, RPS_ABI } from '@/lib/constants'
import { IAccountDoc } from '@/lib/models'
import { AccountStatus } from '@/lib/types'

import HASHER_ABI from '../lib/abis/hasher.json'

// Types
type Contracts = {
	game: any
	hasher: any
}

type Web3ContextProps = {
	accountStatus: AccountStatus
	address: Address | undefined
	connectedGame: IAccountDoc | undefined
	contracts: Contracts | undefined
	publicClient: PublicClient | undefined
	walletClient: WalletClient | undefined
	showWrongNetwork: boolean
	disconnect: (callback?: any) => void
	makeGameTransaction: (fnName: string, args: any[], value: number) => Promise<unknown>
}

type Web3ProviderProps = {
	children: ReactNode
}

// Create context with initial values
/* eslint-disable @typescript-eslint/no-empty-function */
const initialWeb3ContextValue: Web3ContextProps = {
	address: undefined,
	accountStatus: AccountStatus.Disconnected,
	connectedGame: undefined,
	contracts: undefined,
	publicClient: undefined,
	walletClient: undefined,
	showWrongNetwork: false,
	disconnect: () => {},
	makeGameTransaction: async (fnName, args, value) => {
		throw new Error('No game address set')
	},
}
/* eslint-enable @typescript-eslint/no-empty-function */
const Web3Context = createContext<Web3ContextProps>(initialWeb3ContextValue)

// Provider component
export const Web3Provider = ({ children }: Web3ProviderProps): JSX.Element => {
	// Hook Data
	const { address } = useAccount()
	const { disconnect } = useDisconnect()
	const publicClient = usePublicClient()
	const { chain } = useNetwork()
	const { data, isError, isLoading } = useWalletClient()
	// Local State
	const [accountStatus, setAccountStatus] = useState<AccountStatus>(AccountStatus.Disconnected)
	const [connectedGame, setConnectedGame] = useState<IAccountDoc | undefined>()
	const [gameContract, setGameContract] = useState<any>()
	const [hasherContract, setHasherContract] = useState<any>()
	const [walletClient, setWalletClient] = useState<WalletClient | undefined>()
	const [showWrongNetwork, setShowWrongNetwork] = useState<boolean>(false)
	// Context state
	const [web3ContextValue, setWeb3ContextValue] = useState<Web3ContextProps>(initialWeb3ContextValue)

	const handleDisconnect = (callback?: any) => {
		disconnect()
		// reset local state
		setAccountStatus(AccountStatus.Disconnected)
		setConnectedGame(undefined)
		setGameContract(undefined)
		// Invoke callback
		if (callback) callback()
	}

	const createGameContract = useCallback(
		async (gameAddress: Address) => {
			console.log('creating game contract')
			if (!gameAddress) {
				throw new Error('No game address set, plese connect an account')
			} else {
				setGameContract(
					getContract({
						address: gameAddress,
						abi: RPS_ABI,
						publicClient,
						walletClient,
					}),
				)
			}
		},
		[publicClient, walletClient],
	)

	const makeGameTransaction = useCallback(
		async (fnName: string, args: any[], value: number) => {
			console.log('making game transaction')
			if (!connectedGame?.gameAddress) {
				throw new Error('No game address set')
			}
			const { request, result } = await publicClient.simulateContract({
				account: address,
				address: connectedGame?.gameAddress,
				abi: RPS_ABI,
				functionName: fnName,
				args: args,
				value: parseEther(`${value}`),
			})
			const tx = await walletClient?.writeContract(request)
			return [tx, result]
		},
		[connectedGame?.gameAddress, publicClient, walletClient, address],
	)

	// Make a GET request to check if connected account is part of an ongoing game and return the record
	const checkForAccount = async (_address: Address) => {
		console.log('checking for account')
		try {
			// Show as loading while fetching address details
			setAccountStatus(AccountStatus.Loading)
			const response = await fetch(`/api/accounts?address=${_address}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const { data, status, message } = await response.json()
			if (status === 'success') {
				// Account/Game found, check account status and load game
				checkAccountStatus(data)
				setConnectedGame(data)
				createGameContract(data.gameAddress)
			} else {
				// Account not found
				console.error('Failed to fetch account:', message)
				checkAccountStatus(undefined)
			}
		} catch (error) {
			console.error('Failed to fetch account:', error)
			checkAccountStatus(undefined)
		}
	}

	// Checks against the given account record (connectedGame) to see if the connected account is either the player, opponent, or not participating
	const checkAccountStatus = (account: IAccountDoc | undefined) => {
		console.log('checking for account status')
		if (!account) {
			setAccountStatus(AccountStatus.Unregistered)
		} else if (account.player === address) {
			setAccountStatus(AccountStatus.Player)
		} else if (account.opponent === address) {
			setAccountStatus(AccountStatus.Opponent)
		} else {
			// Fallback, possibly bad data
			setAccountStatus(AccountStatus.Unregistered)
		}
	}

	// Check for chain and address changes
	// Check for account status only if on preferred chain
	useEffect(() => {
		console.log('checking for chain and address changes')
		if (!chain || !address) return
		const wrongNetwork = (chain.unsupported && chain.id !== PREFERRED_CHAIN_ID) || false
		setShowWrongNetwork(wrongNetwork)
		if (wrongNetwork) {
			setAccountStatus(AccountStatus.Loading) // N/A
			return
		}
		// Only fetch account details when on preferred network
		if (address) checkForAccount(address)
	}, [address, chain])

	// Get wallet client
	useEffect(() => {
		if (data) {
			setWalletClient(data)
			// Initialize hasher contract on first recognition
			if (!hasherContract) {
				setHasherContract(
					getContract({
						address: HASHER_ADDRESS,
						abi: HASHER_ABI,
						publicClient,
						walletClient: data,
					}),
				)
			}
		}
	}, [data])

	// Update the context value when any relevant internal state changes (read values)
	// This keeps the context in sync with the local state
	useEffect(() => {
		setWeb3ContextValue({
			accountStatus,
			address,
			connectedGame,
			contracts: { hasher: hasherContract, game: gameContract },
			publicClient,
			walletClient,
			showWrongNetwork,
			disconnect: handleDisconnect,
			makeGameTransaction,
		})
	}, [accountStatus, address, connectedGame, hasherContract, gameContract, publicClient, showWrongNetwork])

	return <Web3Context.Provider value={web3ContextValue}>{children}</Web3Context.Provider>
}

// Context hook
export const useWeb3 = () => {
	const context: Web3ContextProps = useContext(Web3Context)

	if (context === undefined) {
		throw new Error('useWeb3 must be used within an Web3Provider component.')
	}
	return context
}
