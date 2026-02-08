export const lesson = `# Euler's Totient Function and Modular Exponentiation

<iframe width="560" height="315" src="https://www.youtube.com/embed/hm8s6FAc4pg?start=223&end=303" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

In this lesson, we'll explore two fundamental concepts critical to RSA: Euler's Totient Function (often denoted as φ(n)) and Modular Exponentiation. These mathematical tools provide the basis for generating keys and performing the encryption/decryption operations.

### Learning Objectives
- Understand the definition and calculation of Euler's Totient Function for a product of two distinct primes.
- Learn the importance of modular exponentiation in RSA.
- Implement a function to calculate modular exponentiation efficiently.

### Euler's Totient Function φ(n)
Euler's Totient Function, φ(n), counts the number of positive integers up to a given integer n that are relatively prime to n. Two integers are relatively prime (or coprime) if their greatest common divisor (GCD) is 1.

For RSA, we are particularly interested in the case where \`n\` is the product of two distinct prime numbers, \`p\` and \`q\`. In this specific scenario, the calculation simplifies significantly:

1. **Select two large distinct prime numbers, \`p\` and \`q\`**.
2. **Calculate \`n = p * q\`**.
3. **Calculate \`φ(n) = (p - 1) * (q - 1)\`**.

This simplified formula is a cornerstone of RSA key generation.

### Modular Exponentiation
Modular exponentiation is an operation where a number \`M\` is raised to a power \`E\`, and the result is then subjected to a modulo operation with a modulus \`N\`. It's written as \`M^E mod N\`.

This operation is central to both RSA encryption (\`C = M^E mod N\`) and decryption (\`M = C^D mod N\`). Performing \`M^E\` directly when \`E\` is a very large number would result in an astronomically large intermediate number, making it computationally infeasible. Modular exponentiation algorithms compute the result efficiently by applying the modulo operation at each step of the exponentiation, keeping intermediate results manageable.

### Your Challenge
Implement a function for modular exponentiation, \`power(base, exp, mod)\`. This function should calculate \`(base^exp) % mod\` efficiently using BigInts. Standard JavaScript \`Math.pow()\` does not support BigInts, and direct exponentiation can lead to overflow or performance issues with large numbers. You will need to implement a modular exponentiation algorithm, often called 'exponentiation by squaring' or 'binary exponentiation'.

#### Algorithm for Modular Exponentiation (Exponentiation by Squaring):
1. **Initialize \`result\` to \`1n\` (BigInt one).**
2. **Reduce \`base\` modulo \`mod\`**: \`base = base % mod\`.
3. **Loop while \`exp\` is greater than \`0n\`:**
    a. **If \`exp\` is odd (i.e., \`exp % 2n === 1n\`):**
        \`result = (result * base) % mod\`.
    b. **Square the \`base\` and reduce modulo \`mod\`:**
        \`base = (base * base) % mod\`.
    c. **Halve \`exp\`:**
        \`exp = exp / 2n\`.
4. **Return \`result\`.**

Remember to use BigInts for all calculations to handle the large numbers involved in RSA.`;
