import { Button, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import formatAddress from '@/utils/formatAddress'


const Profile = () => {
	const { address, isConnected } = useAccount()
	const { disconnect } = useDisconnect()
	const [open, setOpen] = useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleDisconnect = () => {
		disconnect()
		handleClose()
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
