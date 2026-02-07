export const defaultCode = `/**
 * Calculates initial details for a Lewis structure, including total valence electrons, central atom, and octet goals.
 * @param {Molecule} molecule The molecule object to analyze.
 * @returns {object} An object containing total valence electrons, central atom ID, and an array of atom octet goals.
 */
function calculateLewisStructureDetails(molecule) {
  let totalValenceElectrons = 0;
  const atoms = molecule.getAtoms();
  const atomOctetGoals = [];

  // 1. Calculate total valence electrons (from previous lesson)
  for (const atom of atoms) {
    totalValenceElectrons += atom.getValenceElectrons();
  }
  totalValenceElectrons -= molecule.getCharge(); // Adjust for charge

  // 2. Determine the central atom ID.
  //    - Find the first non-Hydrogen atom. If only one non-Hydrogen, it's central.
  //    - If all are H, pick the first atom.
  //    - If there are multiple non-Hydrogens, pick the one with the lowest group number (most metallic/least electronegative usually).
  let centralAtomId = null;
  let nonHydrogenAtoms = atoms.filter(atom => atom.getSymbol() !== 'H');

  if (nonHydrogenAtoms.length === 1) {
    centralAtomId = nonHydrogenAtoms[0].id;
  } else if (nonHydrogenAtoms.length > 1) {
    // Sort by group number to find the 'least electronegative' (lower group number)
    nonHydrogenAtoms.sort((a, b) => a.getGroupNumber() - b.getGroupNumber());
    centralAtomId = nonHydrogenAtoms[0].id;
  } else if (atoms.length > 0) { // All atoms are H, pick the first one
    centralAtomId = atoms[0].id;
  }

  // 3. Determine octet goal for each atom.
  //    - Hydrogen wants 2 electrons.
  //    - All other atoms want 8 electrons.
  for (const atom of atoms) {
    atomOctetGoals.push({
      atomId: atom.id,
      goal: atom.getSymbol() === 'H' ? 2 : 8
    });
  }

  return {
    totalValenceElectrons: totalValenceElectrons,
    centralAtomId: centralAtomId,
    atomOctetGoals: atomOctetGoals
  };
}`;
