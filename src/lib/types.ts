export enum Move {
	Null = '0',
	Rock = '1',
	Paper = '2',
	Scissors = '3',
	Lizard = '4',
	Spock = '5',
}

export enum AccountStatus {
	Disconnected = 'Disconnected',
	Loading = 'N/A',
	Unregistered = 'Unregistered',
	Player = 'Initiating Player',
	Opponent = 'Challenged Player',
}

export type XString = `0x${string}`
export type WagmiString = XString | undefined
