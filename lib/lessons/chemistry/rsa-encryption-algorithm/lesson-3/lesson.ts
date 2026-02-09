export const lesson = `# Computing the Private Key & RSA Encryption/Decryption

<iframe width="560" height="315" src="https://www.youtube.com/embed/hm8s6FAc4pg?start=241&end=411" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*Watch the video above (4:01 - 6:51) to understand key generation, encryption, and decryption.*

## Learning Objectives
- Understand the modular multiplicative inverse
- Calculate the private exponent d using the Extended Euclidean Algorithm
- Implement RSA encryption: C = M^e (mod n)
- Implement RSA decryption: M = C^d (mod n)
- Complete the full RSA key generation process

## The Private Exponent d

The private exponent **d** is the modular multiplicative inverse of **e** modulo φ(n). This means:

**e × d ≡ 1 (mod φ(n))**

Or equivalently: **e × d = k × φ(n) + 1** for some integer k.

The Extended Euclidean Algorithm can compute d efficiently. Once we have d, we have everything needed for RSA:
- **Public Key**: (n, e) - shared openly for encryption
- **Private Key**: (n, d) - kept secret for decryption

## RSA Encryption

To encrypt a message M (converted to an integer) using the public key (n, e):

**C = M^e mod n**

Where:
- M is the plaintext message as an integer (M < n)
- C is the ciphertext
- e is the public exponent
- n is the modulus

## RSA Decryption

To decrypt ciphertext C using the private key (n, d):

**M = C^d mod n**

The mathematics of RSA guarantee that this recovers the original message M, thanks to Euler's theorem and the relationship between e and d.

## Your Challenge

You'll implement the complete \`generateRSAKeys(p, q)\` function that:

1. Validates primes and calculates n and φ(n)
2. Finds a valid public exponent e
3. **Calculates the private exponent d** using the modular inverse
4. Sets both e and d in the RSAKey object
5. Returns the complete key ready for encryption and decryption

You'll use the \`modInverse(e, phi)\` helper function to calculate d.
`;
