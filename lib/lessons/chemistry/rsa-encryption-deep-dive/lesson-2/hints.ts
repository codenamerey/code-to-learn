export const hintsData = [
  {
    "id": "bigint-arithmetic",
    "title": "Using BigInts",
    "content": "Remember that all numbers involved in this function (base, exp, mod, result, and intermediate calculations) must be BigInts. Append `n` to integer literals (e.g., `1n`, `2n`) or use `BigInt()` to convert standard numbers."
  },
  {
    "id": "exponentiation-by-squaring-loop",
    "title": "The Loop Structure",
    "content": "The core of the modular exponentiation algorithm is a `while` loop that continues as long as the `exp` is greater than `0n`. Inside the loop, you'll check if `exp` is odd, then square `base`, and finally halve `exp`."
  },
  {
    "id": "modulo-at-each-step",
    "title": "Applying Modulo Frequently",
    "content": "It's crucial to apply the modulo operation (`% mod`) after every multiplication. This prevents the numbers from growing too large and maintains efficiency. For example, `(result * base) % mod` and `(base * base) % mod`."
  }
];
