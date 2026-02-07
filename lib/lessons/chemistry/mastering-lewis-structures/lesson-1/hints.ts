export const hintsData = [
  {
    "id": "initialize-valence-count",
    "title": "Starting the Count",
    "content": "Remember to declare a variable, like `let totalValenceElectrons = 0;`, before you start summing up."
  },
  {
    "id": "iterate-atoms",
    "title": "Looping Through Atoms",
    "content": "You can access the array of atoms using `molecule.getAtoms()`. A `for...of` loop or `forEach` method would be suitable for iterating through them. Inside the loop, call `atom.getValenceElectrons()`."
  },
  {
    "id": "adjust-for-charge",
    "title": "Handling Molecular Charge",
    "content": "The molecule's charge can be accessed via `molecule.getCharge()`. If `charge` is negative (e.g., -1 for an anion), you add `Math.abs(charge)` electrons. If it's positive (e.g., +1 for a cation), you subtract `charge` electrons. Think about how to combine these conditions or use a direct addition/subtraction based on the sign."
  }
];
