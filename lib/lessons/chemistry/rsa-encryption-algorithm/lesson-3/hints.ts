export const hintsData = [
  {
    id: "calculating-d",
    title: "Calculating the Private Exponent",
    content:
      "Use the `modInverse(e, phi)` function to calculate d:\n```javascript\nconst d = modInverse(e, phi);\n```\nThis computes the value d such that (e × d) ≡ 1 (mod φ(n)).",
  },
  {
    id: "setting-both-exponents",
    title: "Setting Both Exponents",
    content:
      "After calculating both e and d, set them on the RSAKey object:\n```javascript\nkey.setPublicExponent(e);\nkey.setPrivateExponent(d);\n```",
  },
  {
    id: "complete-flow",
    title: "Complete Key Generation Flow",
    content:
      "The full flow is:\n1. Validate primes\n2. Calculate n = p × q and phi = (p-1) × (q-1)\n3. Find e where gcd(e, phi) = 1\n4. Calculate d = modInverse(e, phi)\n5. Create RSAKey and set both e and d\n6. Return the key",
  },
];
