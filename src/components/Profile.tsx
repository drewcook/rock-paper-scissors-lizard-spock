import { Button, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Address, useAccount, useConnect } from 'wagmi'

import formatAddress from '@/utils/formatAddress'

import { useWeb3 } from './Web3Provider'

const Profile = () => {
	const { updateConnectedAccount, disconnect } = useWeb3()
	const { address, isConnected } = useAccount()
	const [open, setOpen] = useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleDisconnect = () => {
		if (disconnect) disconnect(handleClose)
	}

	useEffect(() => {
		// Check for user address against database and check game this.state.
		if (isConnected && address) checkForAccount(address)
	}, [isConnected, address])

	// Make a GET request to check if connected account is part of an ongoing game and return the record
	const checkForAccount = async (_address: Address) => {
		try {
			const response = await fetch(`/api/accounts?address=${_address}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const { data, status, message } = await response.json()
			if (status === 'success') {
				// Account found
				if (updateConnectedAccount) updateConnectedAccount(data)
			} else {
				// Account not found
				console.error('Failed to fetch account:', message)
			}
		} catch (error) {
			console.error('Failed to fetch account:', error)
		}
	}

	if (isConnected) {
		return (
			<>
				<Typography mr={2}>Connected to: {formatAddress(`${address}`)}</Typography>
				<Button size="small" variant="outlined" color="error" onClick={handleDisconnect}>
					Disconnect
				</Button>
			</>
		)
	}

	return (
		<div>
			<Button variant="contained" color="info" onClick={handleClickOpen}>
				Connect Wallet
			</Button>
			<WalletOptionsDialog open={open} onClose={handleClose} />
		</div>
	)
}

type WalletOptionsDialogProps = {
	onClose: () => void
	open: boolean
}

const WalletOptionsDialog = ({ onClose, open }: WalletOptionsDialogProps) => {
	const { connect, connectors, error, isLoading, pendingConnector } = useConnect()

	return (
		<Dialog onClose={onClose} open={open}>
			<DialogTitle>Choose A Wallet</DialogTitle>
			<List sx={{ pt: 0 }}>
				{connectors.map(connector => (
					<ListItem disableGutters key={connector.id}>
						<ListItemButton onClick={() => connect({ connector })} disabled={!connector.ready}>
							<ListItemText primary={connector.name} />
							{!connector.ready && ' (unsupported)'}
							{isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
						</ListItemButton>
					</ListItem>
				))}
			</List>
			{error && <Typography color="error">{error.message}</Typography>}
		</Dialog>
	)
}

export default Profile
