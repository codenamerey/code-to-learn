export const defaultCode = `/**
 * Generates an RSA public and private key pair given two distinct prime numbers p and q.
 * All inputs and outputs are BigInts.
 * @param {BigInt} p A prime number.
 * @param {BigInt} q Another distinct prime number.
 * @returns {{publicKey: {n: BigInt, e: BigInt}, privateKey: BigInt}} An object containing the public and private keys.
 */
function convertMessageToNumber(p, q) {
  // 1. Calculate n = p * q.

  // 2. Calculate phiN = (p - 1) * (q - 1).

  // 3. Choose a public exponent 'e'. Iterate through common values and find one coprime with phiN.
  //    Common 'e' values: [3n, 17n, 65537n]

  // 4. Calculate the private exponent 'd' using RSAHelper.modInverse(e, phiN).

  // 5. Return the public key {n, e} and private key d.
  return { publicKey: { n: 0n, e: 0n }, privateKey: 0n };
}`;
