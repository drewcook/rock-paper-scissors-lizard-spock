export enum Move {
	Null = '0',
	Rock = '1',
	Paper = '2',
	Scissors = '3',
	Lizard = '4',
	Spock = '5',
}

export type XString = `0x${string}`
export type WagmiString = XString | Uint8Array
