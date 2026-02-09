export const hintsData = [
  {
    id: "using-gcd",
    title: "Using the GCD Function",
    content:
      "The helper function `gcd(a, b)` calculates the Greatest Common Divisor of two numbers. Two numbers are co-prime if `gcd(a, b) === 1`.",
  },
  {
    id: "finding-e",
    title: "Finding a Valid e",
    content:
      "Start with `e = 3` and loop until you find a value where `gcd(e, phi) === 1`:\n```javascript\nlet e = 3;\nwhile (gcd(e, phi) !== 1) {\n  e += 2; // Only check odd numbers\n}\n```",
  },
  {
    id: "setting-exponent",
    title: "Setting the Public Exponent",
    content:
      "Once you've found a valid e, use the `setPublicExponent()` method:\n```javascript\nkey.setPublicExponent(e);\n```",
  },
];
