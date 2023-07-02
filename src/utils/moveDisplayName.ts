import { Move } from '@/lib/types'

export const moveDisplayName = (_move: Move): string => {
	switch (_move) {
		case Move.Rock:
			return 'Rock'
		case Move.Paper:
			return 'Paper'
		case Move.Scissors:
			return 'Scissors'
		case Move.Lizard:
			return 'Lizard'
		case Move.Spock:
			return 'Spock'
		default:
			return 'Unknown'
	}
}
