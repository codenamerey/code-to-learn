export const defaultCode = `function calculate_lewis_structure() {
  // Step 1: Create the atoms for H2O (water)
  let hydrogen1 = new Atom(1, 2.1, 'H');
  let hydrogen2 = new Atom(1, 2.1, 'H'); 
  let oxygen = new Atom(6, 3.5, 'O');
  
  console.log("Created atoms:", hydrogen1.name, hydrogen2.name, oxygen.name);
  
  // Step 2: Put all atoms in a list
  let atoms = [hydrogen1, hydrogen2, oxygen];
  
  // Step 3: Find the central atom 
  // Rule: Atom that can form the most bonds (NOT hydrogen)
  let central_atom = null;
  // TODO: Write a loop to find the central atom
  // Hint: Skip hydrogen atoms, pick the one with most valence electrons
  
  console.log("Finding central atom...");
  
  // Step 4: Mark atom types
  central_atom.is_central = true;
  for (let atom of atoms) {
    if (atom !== central_atom) {
      atom.is_terminal = true;
    }
  }
  
  // Step 5: Count total valence electrons
  let total_electrons = 0;
  // TODO: Add up valence electrons from all atoms
  
  console.log("Total electrons:", total_electrons);
  
  // Step 6: Form single bonds between central and terminal atoms
  let electrons_used = 0;
  // TODO: Bond central atom to each terminal atom
  // TODO: Count electrons used (2 per bond)
  
  // Step 7: Give lone pairs to terminal atoms first
  for (let atom of atoms) {
    if (atom.is_terminal) {
      // TODO: Calculate how many electrons this atom needs
      // Hydrogen needs 2 total, others need 8 total
      // TODO: Give lone pairs to complete the octet/duet
      // TODO: Update electrons_used
    }
  }
  
  // Step 8: Give remaining electrons to central atom
  let remaining_electrons = total_electrons - electrons_used;
  // TODO: Give remaining electrons to central atom as lone pairs
  
  console.log("Remaining electrons:", remaining_electrons);
  
  // Step 9: Check if central atom satisfies octet rule
  // TODO: Use check_octet(central_atom) to see if it's satisfied
  // If not satisfied and terminal atoms have lone pairs, form double bonds
  
  console.log("Algorithm complete!");
  
  return {
    atoms: atoms,
    central_atom: central_atom
  };
}`;
