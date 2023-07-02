import { AccountCircleTwoTone } from '@mui/icons-material'
import { Button, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'

import formatAddress from '@/utils/formatAddress'

import { useWeb3 } from './Web3Provider'

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

const Profile = () => {
	const { disconnect } = useWeb3()
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

	if (isConnected) {
		return (
			<>
				<Typography
					variant="caption"
					textAlign="right"
					display="inline-flex"
					alignItems="center"
					justifyContent="center"
					flexDirection="row"
					mr={2}
				>
					<AccountCircleTwoTone fontSize="small" />
					&nbsp;{formatAddress(`${address}`)}
				</Typography>
				<Button size="small" variant="outlined" color="error" onClick={handleDisconnect}>
					Disconnect
				</Button>
			</>
		)
	}

	return (
		<>
			<Button variant="contained" color="info" onClick={handleClickOpen}>
				Connect Wallet
			</Button>
			<WalletOptionsDialog open={open} onClose={handleClose} />
		</>
	)
}

export default Profile
