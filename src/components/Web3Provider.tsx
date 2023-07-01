'use client'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { Address, getContract, parseEther } from 'viem'
import { PublicClient, WalletClient, useAccount, useDisconnect, usePublicClient, useWalletClient } from 'wagmi'

import { HASHER_ADDRESS, RPS_ABI } from '@/lib/constants'
import { IAccountDoc } from '@/lib/models'

import HASHER_ABI from '../lib/abis/hasher.json'

// Create context
type Web3ContextProps = {
	contracts: RPSContracts
	connectedAccount: IAccountDoc | undefined
	disconnect: (callback?: any) => void
	updateConnectedAccount: (account: IAccountDoc) => void
	createRpsContract: (gameAddress: Address) => void
	makeGameTransaction: (fnName: string, args: any[], value: number) => Promise<unknown>
	// sendTxLoading: boolean
	// sendTxError: Error | undefined
	publicClient: PublicClient
	walletClient: WalletClient | undefined
	address: Address | undefined
}
type RPSContracts = {
	rps: any
	hasher: any
}
// @ts-ignore
const Web3Context = createContext<Web3ContextProps>({})

// Context provider
type Web3ProviderProps = {
	children: ReactNode
}

// Provider component
export const Web3Provider = ({ children }: Web3ProviderProps): JSX.Element => {
	const { address } = useAccount()
	const { disconnect } = useDisconnect()
	const { data, isError, isLoading } = useWalletClient()
	const publicClient = usePublicClient()
	const [walletClient, setWalletClient] = useState<WalletClient | undefined>()
	const [hasher, setHasher] = useState<unknown>()
	const [rps, setRps] = useState<unknown>()
	const [connectedAccount, setConnectedAccount] = useState<IAccountDoc | undefined>()

	// const {
	// 	data: txData,
	// 	isLoading: txLoading,
	// 	writeAsync,
	// } = useContractWrite({
	// 	onError: error => setSendTxError(error),
	// 	onSuccess: () => setSendTxError(undefined),
	// })
	// const [sendTxError, setSendTxError] = useState<Error | undefined>()

	// Get wallet client and get hasher contract
	useEffect(() => {
		if (data) {
			setWalletClient(data)
			const hasherContract = getContract({
				address: HASHER_ADDRESS,
				abi: HASHER_ABI,
				publicClient,
				walletClient: data,
			})
			setHasher(hasherContract)
		}
	}, [data])

	const makeGameTransaction = async (_fnName: string, _args: any[], _value: number) => {
		if (!connectedAccount?.gameAddress) throw new Error('No game address set')
		const { request, result } = await publicClient.simulateContract({
			account: address,
			address: connectedAccount?.gameAddress,
			abi: RPS_ABI,
			functionName: _fnName,
			args: _args,
			value: parseEther(`${_value}`),
		})
		const tx = await walletClient?.writeContract(request)
		return [tx, result]
	}

	const handleDisconnect = (callback?: any) => {
		disconnect()
		// reset local state
		setConnectedAccount(undefined)
		// Invoke callback
		if (callback) callback()
	}

	const createRpsContract = async (gameAddress: Address) => {
		if (!gameAddress) throw new Error('No game address set, plese connect an account')
		else
			setRps(
				getContract({
					address: gameAddress,
					abi: RPS_ABI,
					publicClient,
					walletClient,
				}),
			)
	}

	return (
		<Web3Context.Provider
			value={{
				contracts: { hasher, rps },
				connectedAccount,
				disconnect: handleDisconnect,
				updateConnectedAccount: setConnectedAccount,
				createRpsContract,
				makeGameTransaction,
				// sendTxLoading: txLoading,
				// sendTxError,
				publicClient,
				walletClient,
				address,
			}}
		>
			{children}
		</Web3Context.Provider>
	)
}

// Context hook
export const useWeb3 = () => {
	const context: Partial<Web3ContextProps> = useContext(Web3Context)

	if (context === undefined) {
		throw new Error('useWeb3 must be used within an Web3Provider component.')
	}
	return context
}
