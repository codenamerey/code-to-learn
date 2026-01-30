export const testRunner = `// Unit tests for Lewis structure algorithm
function runTests(studentFunction) {
  const tests = [];
  
  function getElectronegativity(element) {
    const electronegativities = {
      'H': 2.1, 'C': 2.5, 'N': 3.0, 'O': 3.5, 'F': 4.0, 'P': 2.1, 'S': 2.5, 'Cl': 3.0
    };
    return electronegativities[element] || 2.0;
  }

  function validateStructure(result, expectedName, expectedCentral, expectedValence, expectedCentralLone) {
    // Basic validation
    if (!result || !result.atoms || !result.central_atom) {
      return { 
        title: expectedName + " Structure",
        passed: false, 
        message: "✗ Function must return {atoms: [...], central_atom: atom}" 
      };
    }

    let errors = [];
    
    // Check Central Atom Identity
    if (result.central_atom.name !== expectedCentral) {
      errors.push("Expected " + expectedCentral + " as central atom, got " + result.central_atom.name);
    }

    // Check Central Atom Lone Pairs
    if (result.central_atom.lone_electrons !== expectedCentralLone) {
      errors.push("Expected " + expectedCentralLone + " lone electrons on central atom, got " + result.central_atom.lone_electrons);
    }

    // Check Total System Electrons (Conservation of Mass)
    let totalLoneElectrons = 0;
    let bondOrders = {}; // Map UUID to its order
    
    result.atoms.forEach(atom => {
      Object.entries(atom.bonds_to_neighbors).forEach(([uuid, order]) => {
        bondOrders[uuid] = order;
      });
      totalLoneElectrons += atom.lone_electrons;
    });

    const totalBondingElectrons = Object.values(bondOrders).reduce((sum, order) => sum + order, 0) * 2;
    const totalElectrons = totalBondingElectrons + totalLoneElectrons;

    if (totalElectrons !== expectedValence) {
      errors.push("Expected " + expectedValence + " electrons total, got " + totalElectrons);
    }

    // Return structured result with Title
    return {
      title: "Lewis Structure: " + expectedName,
      passed: errors.length === 0,
      message: errors.length === 0 ? "✓ Correctly implemented" : "✗ Errors: " + errors.join(', ')
    };
  }
  
  // Test Case 1: H₂O (Water)
  const waterAtoms = [new Atom(1, 2.1, 'H'), new Atom(6, 3.5, 'O'), new Atom(1, 2.1, 'H')];
  tests.push(validateStructure(studentFunction(waterAtoms), "H₂O", "O", 8, 4));

  // Test Case 2: CO₂ (Carbon Dioxide)
  const co2Atoms = [new Atom(6, 3.5, 'O'), new Atom(4, 2.5, 'C'), new Atom(6, 3.5, 'O')];
  tests.push(validateStructure(studentFunction(co2Atoms), "CO₂", "C", 16, 0));

  // Test Case 3: NH₃ (Ammonia)
  const nh3Atoms = [new Atom(5, 3.0, 'N'), new Atom(1, 2.1, 'H'), new Atom(1, 2.1, 'H'), new Atom(1, 2.1, 'H')];
  tests.push(validateStructure(studentFunction(nh3Atoms), "NH₃", "N", 8, 2));
  
  return tests;
}`;
