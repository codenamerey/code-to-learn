export const lesson = `# Counting Valence Electrons

<iframe width="560" height="315" src="https://www.youtube.com/embed/DvGNpuan4rw?start=0&end=109" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Welcome to the first lesson in mastering Lewis Structures! Before we can draw anything, we need to understand the fundamental building blocks: atoms and their valence electrons. Valence electrons are the electrons in the outermost shell of an atom, and they are the ones involved in chemical bonding.

### Learning Objectives
- Understand what valence electrons are.
- Learn how to determine the number of valence electrons for a main group element.
- Implement a function to calculate the total valence electrons for a given molecule.

### Determining Valence Electrons Algorithm

To find the total number of valence electrons in a molecule, follow these steps:

1.  **Identify each atom:** For every atom in the molecule, determine its elemental symbol.
2.  **Find group number:** For each main group element, its group number (1-2, 13-18) on the periodic table directly corresponds to its number of valence electrons. For example, Carbon (Group 14) has 4 valence electrons, Oxygen (Group 16) has 6, and Hydrogen (Group 1) has 1.
3.  **Sum individual valence electrons:** Add up the valence electrons from all atoms in the molecule.
4.  **Adjust for charge:** If the molecule is an ion:
    -   For a *negative* charge, add that many electrons to the total.
    -   For a *positive* charge, subtract that many electrons from the total.

### Your Challenge

You will implement the \`calculateLewisStructureDetails\` function to determine the total number of valence electrons for a given molecule. You'll be provided with a \`Molecule\` object, which contains information about its constituent \`Atom\` objects and its overall charge. Use the \`Atom.getValenceElectrons()\` method to get the valence electrons for each atom and then sum them up, adjusting for the molecule's charge.`;
