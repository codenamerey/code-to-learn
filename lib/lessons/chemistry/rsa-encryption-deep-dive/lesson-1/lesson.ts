export const lesson = `# Introduction to RSA and Modular Arithmetic

<iframe width="560" height="315" src="https://www.youtube.com/embed/hm8s6FAc4pg?start=25&end=202" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Welcome to the RSA Encryption course! In this lesson, we'll introduce the RSA algorithm and delve into the mathematical backbone that makes it work: modular arithmetic. RSA relies heavily on operations within a finite set of integers, which is precisely what modular arithmetic provides.

### Learning Objectives
- Understand the basic concept of RSA encryption: public and private keys.
- Grasp the core principles of modular arithmetic, including congruence and the modulo operator.
- Learn how messages can be represented numerically for cryptographic operations.

### The Need for Encryption
Imagine Alice wants to send a secret message to Bob. Without encryption, anyone who intercepts the message can read it. RSA solves this by allowing Alice to encrypt her message using Bob's publicly available key, and only Bob, with his secret private key, can decrypt it.

### Modular Arithmetic
Modular arithmetic is a system of arithmetic for integers where numbers 'wrap around' upon reaching a certain value, called the modulus. Think of a clock: 10 hours after 7 o'clock is 5 o'clock, not 17 o'clock. We are interested in the remainder after division.

### Representing Messages Numerically
For RSA to work, messages (like 'HELLO') must first be converted into large integers. This is typically done by converting each character to its ASCII or binary equivalent and then concatenating these values to form a single large number. For example, 'A' might be 65, 'B' 66, and so on. 'AB' could be represented as 6566 or by concatenating their binary representations.

### Your Challenge
In this challenge, you will implement a function that converts a given message string into its numerical representation. For simplicity, we will convert each character to its ASCII value and then concatenate these values as a string, which can then be parsed as a BigInt. This is a simplified approach but demonstrates the core idea of message-to-number conversion.`;
