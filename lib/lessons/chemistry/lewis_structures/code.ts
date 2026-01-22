export const defaultCode = `function calculate_lewis_structure() {
  // Create the atoms for H2O (water)
  let hydrogen1 = new Atom(1, 2.1, 'H');
  let hydrogen2 = new Atom(1, 2.1, 'H'); 
  let oxygen = new Atom(6, 3.5, 'O');
  
  console.log("Created atoms:", hydrogen1.name, hydrogen2.name, oxygen.name);
  
  // Put all atoms in a list
  let atoms = [hydrogen1, hydrogen2, oxygen];
  
  for(let atom of atoms) {
      // Step 1
    
      // Step 2
      
      // Step 3
    
      // Step 4
    
      // Step 5
    
      // Step 6
  }
  
  return {
    atoms: atoms,
    central_atom: central_atom
  };
}`;
