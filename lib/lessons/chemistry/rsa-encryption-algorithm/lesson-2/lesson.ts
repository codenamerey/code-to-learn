export const lesson = `# Modular Arithmetic & Choosing the Public Exponent

<iframe width="560" height="315" src="https://www.youtube.com/embed/hm8s6FAc4pg?start=82&end=175" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*Watch the video above (1:22 - 2:55) to understand modular arithmetic and Euler's totient function.*

## Learning Objectives
- Understand modular arithmetic and the modulo operation
- Learn about co-prime numbers and the GCD (Greatest Common Divisor)
- Implement the GCD algorithm
- Choose a valid public exponent e that is co-prime with φ(n)

## Modular Arithmetic

Modular arithmetic is a system where numbers "wrap around" after reaching a certain value called the **modulus**. Think of a clock: there are only 12 hours on the face. If it's 7:00 now, 10 hours later will be 5:00 (not 17:00). We're working modulo 12.

When we write **a ≡ r (mod n)**, it means that **a** and **r** leave the same remainder when divided by **n**.

For example:
- 17 ≡ 5 (mod 12) because 17 = 1×12 + 5
- 25 ≡ 1 (mod 12) because 25 = 2×12 + 1

## Co-Prime Numbers and GCD

Two numbers are **co-prime** (or relatively prime) if their Greatest Common Divisor (GCD) is 1. In other words, they share no common factors except 1.

Examples:
- GCD(8, 15) = 1, so 8 and 15 are co-prime
- GCD(12, 18) = 6, so 12 and 18 are NOT co-prime

## Choosing the Public Exponent e

In RSA, after calculating φ(n), we need to choose a public exponent **e** such that:
1. 1 < e < φ(n)
2. GCD(e, φ(n)) = 1 (e and φ(n) are co-prime)

Common choices for e are small primes like 3, 5, 17, or 65537 (which is 2^16 + 1).

## Your Challenge

You'll implement a function called \`generateRSAKeys(p, q)\` that:

1. Validates that p and q are prime
2. Calculates n and φ(n)
3. Finds a valid public exponent e (start checking from e=3 and find the first value co-prime with φ(n))
4. Returns an RSAKey object with the public exponent set

You'll need to implement a helper to check if two numbers are co-prime using the GCD algorithm.
`;
