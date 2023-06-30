import { Move } from '@/lib/types'

export const moveDisplayName = (_move: Move): string => {
	switch (_move) {
		case Move.Rock:
			return 'Rock'
		case Move.Paper:
			return 'Paper'
		case Move.Scissors:
			return 'Scissors'
		default:
			return 'Unknown'
	}
}
