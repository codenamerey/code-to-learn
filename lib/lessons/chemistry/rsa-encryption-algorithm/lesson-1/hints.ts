export const hintsData = [
  {
    id: "check-prime-helper",
    title: "Using the isPrime Helper",
    content:
      "There's a helper function `isPrime(num)` available that returns `true` if a number is prime and `false` otherwise. Use it to validate both p and q before proceeding.",
  },
  {
    id: "throw-error",
    title: "Throwing Errors for Invalid Input",
    content:
      "If either p or q is not prime, throw an error:\n```javascript\nif (!isPrime(p)) {\n  throw new Error('p must be a prime number');\n}\n```",
  },
  {
    id: "create-rsa-key",
    title: "Creating the RSAKey Object",
    content:
      "Once you have calculated n and phi, create a new RSAKey object:\n```javascript\nreturn new RSAKey(p, q, n, phi);\n```\nThe RSAKey constructor takes four parameters: p, q, n, and phi.",
  },
];
