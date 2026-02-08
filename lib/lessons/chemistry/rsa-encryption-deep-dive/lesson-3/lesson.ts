export const lesson = `# RSA Key Generation

<iframe width="560" height="315" src="https://www.youtube.com/embed/hm8s6FAc4pg?start=401&end=497" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Now that we understand message conversion and modular exponentiation, we can tackle the heart of RSA: key generation. This process creates the public and private key pair that makes secure communication possible. The security of RSA relies on the difficulty of factoring large numbers.

### Learning Objectives
- Understand the steps involved in generating RSA public and private keys.
- Implement the key generation process, including finding a suitable public exponent and calculating the private exponent.

### RSA Key Generation Steps

1.  **Choose two large distinct prime numbers, \`p\` and \`q\`**.
    *   These primes should be kept secret. The larger they are, the more secure the encryption.

2.  **Calculate \`n\` (the modulus)**:
    *   \`n = p * q\`.
    *   \`n\` is part of the public key.

3.  **Calculate \`φ(n)\` (Euler's Totient Function of \`n\`)**:
    *   \`φ(n) = (p - 1) * (q - 1)\`.
    *   \`φ(n)\` must be kept secret.

4.  **Choose the public exponent \`e\`**:
    *   \`e\` must satisfy two conditions:
        *   \`1 < e < φ(n)\`
        *   \`e\` must be coprime to \`φ(n)\` (i.e., \`gcd(e, φ(n)) = 1\`).
    *   Common choices for \`e\` are \`3\`, \`17\`, or \`65537\` because they are small primes, making encryption faster. \`65537\` (\`2^16 + 1\`) is the most common.
    *   \`e\` is part of the public key.

5.  **Calculate the private exponent \`d\`**:
    *   \`d\` is the modular multiplicative inverse of \`e\` modulo \`φ(n)\`.
    *   This means \`(e * d) % φ(n) = 1\`.
    *   \`d\` must be kept secret and is part of the private key.
    *   The extended Euclidean algorithm is typically used to find \`d\`. Our \`RSAHelper.modInverse\` function will do this for you.

### Public and Private Keys
*   **Public Key:** \`(n, e)\` - Shared with anyone who wants to encrypt a message for you.
*   **Private Key:** \`d\` - Kept secret and used only by you for decryption.

### Your Challenge
Implement the \`generateRSAKeys\` function. This function will take two prime numbers \`p\` and \`q\` as input and return an object containing the public key \`(n, e)\` and the private key \`d\`. You will use the \`RSAHelper\` class for \`phi\` and \`modInverse\` calculations.

For \`e\`, you should iterate through a predefined list of common public exponents (e.g., \`[3n, 17n, 65537n]\`) and pick the first one that is coprime with \`phiN\`. If none of these are suitable, you can throw an error or choose a default (though for this exercise, assume one will always be found).`;
