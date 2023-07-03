import { createHash } from 'crypto'

// Example usage
// const inputString = 'example';
// const salt = generateSaltFromString(inputString);
// console.log(salt);
const generateSaltFromString = (input: string): bigint => {
	// Create a SHA-256 hash object
	const hash = createHash('sha256')

	// Update the hash with the input string
	hash.update(input)

	// Get the hexadecimal hash digest
	const hashDigest = hash.digest('hex')

	// Convert the hexadecimal hash digest to a bigint value
	const salt = BigInt(`0x${hashDigest}`)

	return salt
}

export default generateSaltFromString
