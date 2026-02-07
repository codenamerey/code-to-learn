export const hintsData = [
  {
    "id": "central-atom-logic",
    "title": "Finding the Central Atom",
    "content": "To find the central atom, first filter out all 'H' atoms. If there's only one left, that's your central atom. If there are multiple, you'll need a tie-breaker. Sorting them by `groupNumber` (ascending) and picking the first one is a good heuristic for 'least electronegative'. Don't forget to handle the edge case where all atoms are hydrogen!"
  },
  {
    "id": "atom-id-for-central",
    "title": "Returning Atom ID",
    "content": "When identifying the central atom, make sure you return its unique `id` property, which can be accessed using `atom.getId()`."
  },
  {
    "id": "octet-goal-structure",
    "title": "Structuring Octet Goals",
    "content": "The `atomOctetGoals` array should contain objects, where each object has an `atomId` and a `goal`. For example, `[{ atomId: 1, goal: 8 }, { atomId: 2, goal: 2 }]`. Remember the special case for Hydrogen."
  }
];
