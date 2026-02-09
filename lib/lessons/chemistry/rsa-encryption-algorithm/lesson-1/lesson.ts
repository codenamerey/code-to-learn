export const lesson = `# Introduction to RSA Encryption & Prime Numbers

<iframe width="560" height="315" src="https://www.youtube.com/embed/hm8s6FAc4pg?start=5&end=80" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*Watch the video above (0:05 - 1:20) to understand the basics of encryption and why RSA is needed.*

## Learning Objectives
- Understand the difference between encrypted and unencrypted communication
- Learn what prime numbers are and why they're important for RSA
- Implement a function to check if a number is prime
- Generate RSA key components using two prime numbers

## What is RSA Encryption?

When Alice sends a message "hello" to Bob without encryption, anyone who intercepts it can read it directly. With RSA encryption, Bob generates a **public key** and a **private key**. Alice encrypts her message using Bob's public key, and only Bob can decrypt it with his private key.

The security of RSA relies on a simple mathematical fact: it's **easy to multiply two large prime numbers together**, but it's **extremely difficult to factor the result back into those primes**.

## Prime Numbers: The Foundation of RSA

A **prime number** is a natural number greater than 1 that has no positive divisors other than 1 and itself. Examples: 2, 3, 5, 7, 11, 13, 17, 19, 23...

In RSA, we start by selecting two large distinct prime numbers **p** and **q**. We then multiply them to get **n = p × q**. This value **n** becomes part of the public key. The security comes from the fact that even if someone knows **n**, they can't easily figure out what **p** and **q** were.

## Your Challenge

You'll implement a function called \`generateRSAKeys(p, q)\` that takes two prime numbers and generates the basic RSA key components. Your function should:

1. Verify that both p and q are prime numbers
2. Calculate n = p × q (this will be the modulus)
3. Calculate φ(n) = (p-1) × (q-1) (Euler's totient function)
4. Return an RSAKey object with these values

The function should throw an error if either input is not prime.
`;
