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
import { AccountStatus, Move, WagmiString } from '@/lib/types'

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
	txSuccess: boolean
	txError: string | null
	gameEnded: boolean
	disconnect: (callback?: any) => void
	createMoveHash: (move: Move, salt: string) => Promise<[string, WagmiString]>
	makeGameTransaction: (fnName: string, args: any[], value: number) => Promise<[unknown, WagmiString]>
	readGameValue: (fnName: string) => Promise<any>
	loadGameForAccount: (account: IAccountDoc) => void
	resetTxNotifications: () => void
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
	txSuccess: false,
	txError: null,
	gameEnded: false,
	disconnect: () => {},
	createMoveHash: () => {
		throw new Error('No game address set')
	},
	makeGameTransaction: async () => {
		throw new Error('No game address set')
	},
	readGameValue: async () => {
		throw new Error('No game address set')
	},
	loadGameForAccount: () => {},
	resetTxNotifications: () => {},
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
	const { data } = useWalletClient()
	// Local State
	const [accountStatus, setAccountStatus] = useState<AccountStatus>(AccountStatus.Disconnected)
	const [connectedGame, setConnectedGame] = useState<IAccountDoc | undefined>()
	const [gameContract, setGameContract] = useState<any>()
	const [hasherContract, setHasherContract] = useState<any>()
	const [walletClient, setWalletClient] = useState<WalletClient | undefined>()
	const [showWrongNetwork, setShowWrongNetwork] = useState<boolean>(false)
	const [txSuccess, setTxSuccess] = useState<boolean>(false)
	const [txError, setTxError] = useState<string | null>(null)
	const [gameEnded, setGameEnded] = useState<boolean>(false)
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
			if (!gameAddress) {
				throw new Error('No game address set, please connect an account')
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

	const loadGameForAccount = (account: IAccountDoc) => {
		checkAccountStatus(account)
		setConnectedGame(account)
		createGameContract(account.gameAddress)
	}

	const readGameValue = useCallback(
		async (valueName: string) => {
			if (!connectedGame?.gameAddress) {
				throw new Error('No game address set')
			}
			if (valueName === 'balance') {
				return await publicClient?.getBalance({ address: connectedGame.gameAddress })
			} else {
				return await publicClient?.readContract({
					address: connectedGame.gameAddress,
					abi: RPS_ABI,
					account: address,
					functionName: valueName,
				})
			}
		},
		[connectedGame?.gameAddress],
	)

	const createMoveHash = useCallback(
		async (move: Move, salt: string): Promise<[string, WagmiString]> => {
			try {
				const { request, result: c1Hash } = await publicClient?.simulateContract({
					account: address,
					address: HASHER_ADDRESS,
					abi: HASHER_ABI,
					functionName: 'hash',
					args: [move, salt],
				})
				const txHash: WagmiString = await walletClient?.writeContract(request)
				setTxSuccess(true)
				setTxError(null)
				return [`${c1Hash}`, txHash]
			} catch (error: any) {
				setTxSuccess(false)
				setTxError(error.message)
				throw error
			}
		},
		[publicClient, walletClient, address],
	)

	const makeGameTransaction = useCallback(
		async (fnName: string, args: any[], value: number): Promise<[unknown, WagmiString]> => {
			try {
				if (!connectedGame?.gameAddress) {
					setTxError('No game address set')
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
				const txHash: WagmiString = await walletClient?.writeContract(request)
				setTxSuccess(true)
				setTxError(null)
				// Handle game-ending actions to update context state for displaying across UI
				const gameEndingActions = ['j1Timeout', 'j2Timeout', 'solve']
				if (gameEndingActions.includes(fnName)) {
					// Tx was successful and funds were transferred, update state that game has ended
					// TODO: instead of ephemeral state, update the DB record to reflect game has ended
					setGameEnded(true)
				} else {
					setGameEnded(false) // 'play' opponent action
				}
				return [result, txHash]
			} catch (error: any) {
				setTxSuccess(false)
				setTxError(error.message)
				throw error
			}
		},
		[connectedGame?.gameAddress, publicClient, walletClient, address],
	)

	const resetTxNotifications = () => {
		setTxSuccess(false)
		setTxError(null)
	}

	// Make a GET request to check if connected account is part of an ongoing game and return the record
	const checkForAccount = async (_address: Address) => {
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
				// Account/Game found, load game
				loadGameForAccount(data)
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
			txSuccess,
			txError,
			gameEnded,
			disconnect: handleDisconnect,
			createMoveHash,
			readGameValue,
			makeGameTransaction,
			loadGameForAccount,
			resetTxNotifications,
		})
	}, [
		accountStatus,
		address,
		connectedGame,
		hasherContract,
		gameContract,
		publicClient,
		showWrongNetwork,
		txSuccess,
		txError,
		gameEnded,
	])

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
