import { Box, Button } from '@mui/material'
import { useAccount } from 'wagmi'

function CreaateGameButton() {
	const { address } = useAccount()

	const handleCreateGame = () => {
		console.log('creating game for', address)
	}

	return (
		<Box>
			<Button variant="contained" color="secondary" onClick={handleCreateGame}>
				Create Game
			</Button>
		</Box>
	)
}
export default CreaateGameButton
