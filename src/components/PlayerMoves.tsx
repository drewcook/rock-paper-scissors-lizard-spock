'use client'
import { Button, Paper, Typography } from '@mui/material'

const styles = {
	paper: {
		p: 2,
		m: 2,
	},
}

type PlayerMovesProps = {
	name: string
}

const PlayerMoves = (props: PlayerMovesProps): JSX.Element => {
	const handleMakeMove = () => {
		console.log(`${props.name} make move`)
	}
	return (
		<Paper elevation={2} sx={styles.paper}>
			<Typography variant="h3">Player Moves</Typography>
			<Typography variant="h4">{props.name}</Typography>
			<Button variant="contained" onClick={handleMakeMove}>
				Make A Move
			</Button>
		</Paper>
	)
}

export default PlayerMoves
