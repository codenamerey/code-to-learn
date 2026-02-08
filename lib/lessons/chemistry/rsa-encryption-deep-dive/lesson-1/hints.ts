export const hintsData = [
  {
    "id": "string-concat",
    "title": "Concatenating ASCII values",
    "content": "Remember that `String.prototype.charCodeAt(index)` returns the ASCII value (or more precisely, the UTF-16 code unit) of a character. You can convert this number to a string using `.toString()` and then append it to your `numString` variable."
  },
  {
    "id": "bigint-conversion",
    "title": "Converting to BigInt",
    "content": "Once you have your `numString`, you can convert it to a BigInt using `BigInt(numString)`. Don't forget the `n` suffix for BigInt literals, though in this case, `BigInt()` constructor handles it for you."
  },
  {
    "id": "empty-message",
    "title": "Handling an empty message",
    "content": "Consider what should happen if the input `message` is an empty string. What would be the appropriate numerical representation for an empty message? The tests expect `0n`."
  }
];
