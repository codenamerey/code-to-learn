export const hintsData = [
  {
    "id": "connecting-bonds",
    "title": "Forming Single Bonds",
    "content": "To connect the central atom to a terminal atom, you need to call `centralAtom.connectBond(terminalAtom.getId())` AND `terminalAtom.connectBond(centralAtom.getId())`. Each bond uses 2 electrons, so remember to update `electronsUsedForBonds` and `remainingValenceElectrons`."
  },
  {
    "id": "distributing-lone-pairs",
    "title": "Placing Lone Pairs",
    "content": "For distributing lone pairs, use a `while` loop. The condition should check if the atom still needs electrons to satisfy its octet (or duet) goal AND if there are `remainingValenceElectrons` available (at least 2 for a pair). Inside the loop, call `atom.addLonePair()` and subtract 2 from `remainingValenceElectrons`."
  },
  {
    "id": "atom-octet-goals-lookup",
    "title": "Looking Up Octet Goals",
    "content": "You've built `atomOctetGoals` as an object in the provided stub (e.g., `{ atomId: goal }`). This makes it easy to look up an atom's goal using `atomOctetGoals[atom.getId()]` when distributing lone pairs."
  }
];
