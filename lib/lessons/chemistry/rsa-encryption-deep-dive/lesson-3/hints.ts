export const hintsData = [
  {
    "id": "calculate-n-and-phi",
    "title": "Calculating n and phiN",
    "content": "The first steps are straightforward multiplication. Remember to use BigInts for `p` and `q` and their results. `n = p * q` and `phiN = (p - 1n) * (q - 1n)`."
  },
  {
    "id": "choosing-e",
    "title": "Selecting a Public Exponent 'e'",
    "content": "You need to iterate through the `commonEs` array (e.g., `[3n, 17n, 65537n]`). For each potential `e`, check if it's less than `phiN` and if `RSAHelper.areCoprime(e, phiN)` returns `true`. The first one that satisfies both conditions is your `e`."
  },
  {
    "id": "calculating-d",
    "title": "Finding the Private Exponent 'd'",
    "content": "The `RSAHelper.modInverse(e, phiN)` function is designed to calculate `d`. Simply call it with your chosen `e` and `phiN`."
  }
];
