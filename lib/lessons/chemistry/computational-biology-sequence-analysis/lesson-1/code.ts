export const defaultCode = `function reconstructSangerSequence(fragments) {
  // fragments is an array of objects like { length: 5, terminalBase: 'A' }
  // Assume fragments are already sorted by length.

  // 1. Initialize an empty array to store the sequence.
  let sequence = [];

  // 2. Iterate through the sorted fragments.
  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i];

    // 3. For each fragment, determine its terminal base.
    // 4. Add the terminal base to the sequence array.
    //    Consider how the length of the fragment relates to its position in the sequence.
    //    If a fragment has length L, it means the L-th base in the synthesized strand is its terminal base.
    //    Adjust for 0-based indexing if necessary.

    // Hint: The problem asks for the sequence of the *synthesized* DNA strand.
    // The terminal base of a fragment of length \`L\` is the \`L\`-th base of the synthesized sequence.
    // Ensure your sequence array grows to accommodate the longest fragment.
  }

  // 5. Join the sequence array into a string and return it.
  return sequence.join('');
}`;
