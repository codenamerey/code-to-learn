export const lesson = `# Determining Central Atom and Octet Rule

<iframe width="560" height="315" src="https://www.youtube.com/embed/DvGNpuan4rw?start=109&end=283" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Now that we can count valence electrons, the next crucial step in drawing Lewis structures is identifying the central atom and understanding the Octet Rule. The central atom is typically the least electronegative atom (excluding hydrogen, which is always terminal). The Octet Rule states that atoms tend to gain, lose, or share electrons to achieve a full outer shell of eight electrons, resembling a noble gas. Hydrogen is an exception, requiring only two electrons (duet rule).

### Learning Objectives
- Understand the criteria for selecting a central atom.
- Apply the Octet Rule to determine the maximum capacity of electrons around each atom.
- Implement a function to identify the central atom and calculate each atom's 'octet capacity'.

### Central Atom and Octet Algorithm

1.  **Identify Potential Central Atoms:** The central atom is usually:
    -   The least electronegative atom (excluding Hydrogen, which is *never* central).
    -   The atom that appears only once in the formula (e.g., C in CO2, N in NH3).
    -   If there are multiple candidates, the one that can form more bonds (often Group 14, 15, 16 elements).
    -   *For simplicity in this exercise, assume the first non-hydrogen atom in the molecule's \`atoms\` array (if multiple atoms exist) is the central atom, unless there's only one non-hydrogen atom, which then is the central atom.* If all atoms are hydrogen (e.g., H2), there is no 'central' atom in the traditional sense, but we can designate the first one.
2.  **Determine Octet Capacity:** For each atom:
    -   Most atoms (C, N, O, F, Cl, Br, I, S, P, etc.) want 8 valence electrons (octet).
    -   Hydrogen (H) wants 2 valence electrons (duet).
    -   Boron (B) sometimes forms exceptions with 6 electrons.
    -   *For this exercise, assume all atoms except Hydrogen want 8 electrons, and Hydrogen wants 2.*

### Your Challenge

Extend the \`calculateLewisStructureDetails\` function. In addition to the total valence electrons, you need to identify the central atom (returning its \`id\`) and for each atom, determine its 'octet capacity' (how many electrons it 'wants' to achieve stability).`;
