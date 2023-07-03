import { AbiCoder, keccak256 } from 'ethers'

import { Move } from '@/lib/types'

const hash = (_c: Move, _salt: bigint): string => {
	const abiCoder = new AbiCoder()
	const encodedParams = abiCoder.encode(['uint8', 'uint256'], [_c, _salt])
	const hash = keccak256(encodedParams)
	return hash
}
export default hash
