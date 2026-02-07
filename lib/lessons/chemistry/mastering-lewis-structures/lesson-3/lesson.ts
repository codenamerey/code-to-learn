export const lesson = `# Placing Bonds and Lone Pairs

<iframe width="560" height="315" src="https://www.youtube.com/embed/DvGNpuan4rw?start=283&end=568" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

With valence electrons counted and the central atom identified, we can now start building the Lewis structure by placing bonds and distributing lone pairs. This is where the Octet Rule truly guides our placement.

### Learning Objectives
- Understand how to place single bonds between atoms.
- Learn to distribute remaining electrons as lone pairs to satisfy the octet rule.
- Implement a function to simulate initial bond placement and lone pair distribution.

### Bonding and Lone Pair Placement Algorithm

1.  **Place Single Bonds:** Connect all terminal atoms to the central atom with a single bond. Each single bond uses 2 valence electrons. Keep track of used electrons and the bonds formed.
2.  **Distribute Lone Pairs to Terminal Atoms:** Starting with the most electronegative terminal atoms (or just iterating through them), add lone pairs (2 electrons per pair) until each terminal atom fulfills its octet goal (or duet for Hydrogen). Subtract these electrons from the total available.
3.  **Distribute Lone Pairs to Central Atom:** If there are any remaining valence electrons, place them as lone pairs on the central atom until its octet goal is met, or all electrons are used up, whichever comes first. Subtract these electrons.
4.  **Check for Octet Deficiencies (and multiple bonds):** If the central atom (or any atom) still doesn't have an octet and there are no more valence electrons, this indicates the need for multiple bonds. For this lesson, we will *not* form multiple bonds, but simply identify if the central atom is deficient. *You will just return the state after step 3.*

### Your Challenge

Enhance the \`calculateLewisStructureDetails\` function further. Now, calculate the number of bonds formed, the lone pairs on each atom, and the remaining available electrons after initial placement. You will need to use the \`Atom.connectBond(targetAtomId)\` method to simulate bond formation and \`Atom.addLonePair()\` to add lone pairs.`;
