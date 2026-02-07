export const defaultCode = `/**
 * Calculates comprehensive details for a Lewis structure, including total valence electrons, central atom, octet goals, 
 * initial bonds, and lone pairs.
 * @param {Molecule} molecule The molecule object to analyze.
 * @returns {object} An object containing all calculated Lewis structure details.
 */
function calculateLewisStructureDetails(molecule) {
  let totalValenceElectrons = 0;
  const atoms = molecule.getAtoms();
  const atomOctetGoals = {}; // Use an object for easier lookup by atomId

  // --- Lesson 1: Calculate total valence electrons ---
  for (const atom of atoms) {
    totalValenceElectrons += atom.getValenceElectrons();
  }
  totalValenceElectrons -= molecule.getCharge();

  // --- Lesson 2: Determine central atom and octet goals ---
  let centralAtom = null;
  let nonHydrogenAtoms = atoms.filter(atom => atom.getSymbol() !== 'H');

  if (nonHydrogenAtoms.length === 1) {
    centralAtom = nonHydrogenAtoms[0];
  } else if (nonHydrogenAtoms.length > 1) {
    nonHydrogenAtoms.sort((a, b) => a.getGroupNumber() - b.getGroupNumber());
    centralAtom = nonHydrogenAtoms[0];
  } else if (atoms.length > 0) {
    centralAtom = atoms[0];
  }

  for (const atom of atoms) {
    atomOctetGoals[atom.getId()] = atom.getSymbol() === 'H' ? 2 : 8;
  }

  // --- Lesson 3: Place single bonds and distribute lone pairs ---
  let electronsUsedForBonds = 0;
  const bonds = []; // Stores { atom1Id, atom2Id, type: 'single' }

  // 1. Place Single Bonds between central and terminal atoms.
  if (centralAtom) {
    for (const atom of atoms) {
      if (atom.getId() !== centralAtom.getId()) {
        // Connect terminal atom to central atom
        centralAtom.connectBond(atom.getId()); // This method updates the atom's internal bond count
        atom.connectBond(centralAtom.getId());
        bonds.push({ atom1Id: centralAtom.getId(), atom2Id: atom.getId(), type: 'single' });
        electronsUsedForBonds += 2;
      }
    }
  }
  
  let remainingValenceElectrons = totalValenceElectrons - electronsUsedForBonds;

  // Track lone pairs per atom (object for easy access)
  const atomLonePairs = {};
  for(const atom of atoms) { 
    atomLonePairs[atom.getId()] = 0; 
  }

  // 2. Distribute Lone Pairs to Terminal Atoms.
  //    Iterate through terminal atoms (all non-central atoms).
  if (centralAtom) {
    for (const atom of atoms) {
      if (atom.getId() !== centralAtom.getId()) {
        // While atom needs electrons and there are remaining valence electrons
        while (atom.getElectronsAround() < atomOctetGoals[atom.getId()] && remainingValenceElectrons >= 2) {
          atom.addLonePair();
          atomLonePairs[atom.getId()]++;
          remainingValenceElectrons -= 2;
        }
      }
    }
  }

  // 3. Distribute Lone Pairs to Central Atom.
  if (centralAtom) {
    while (centralAtom.getElectronsAround() < atomOctetGoals[centralAtom.getId()] && remainingValenceElectrons >= 2) {
      centralAtom.addLonePair();
      atomLonePairs[centralAtom.getId()]++;
      remainingValenceElectrons -= 2;
    }
  }

  return {
    totalValenceElectrons: totalValenceElectrons,
    centralAtomId: centralAtom ? centralAtom.getId() : null,
    atomOctetGoals: Object.entries(atomOctetGoals).map(([id, goal]) => ({ atomId: parseInt(id), goal: goal })),
    bonds: bonds,
    atomLonePairs: Object.entries(atomLonePairs).map(([id, pairs]) => ({ atomId: parseInt(id), lonePairs: pairs })),
    remainingValenceElectrons: remainingValenceElectrons
  };
}`;
