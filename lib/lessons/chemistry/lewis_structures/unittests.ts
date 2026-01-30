export const testRunner = `
function runTests(studentFunction) {
  const tests = [];

  function validateStructure(atomsArray, expectedName, expectedCentralName, expectedValence, expectedCentralLone) {
    // find the atom marked as central by the student function
    const central_atom = atomsArray.find(a => a.is_central === true);

    if (!atomsArray || !central_atom) {
      return { title: expectedName, passed: false, message: "✗ Missing central atom marking." };
    }

    let errors = [];

    // 1. Check Identity
    if (central_atom.name !== expectedCentralName) {
      errors.push("Expected " + expectedCentralName + " central, got " + central_atom.name);
    }

    // 2. Check Lone Electrons
    if (central_atom.lone_electrons !== expectedCentralLone) {
      errors.push("Expected " + expectedCentralLone + " lone e-, got " + central_atom.lone_electrons);
    }

    // 3. Check System Electrons (Conservation of Mass)
    let totalLone = 0;
    let bondOrders = {}; 
    atomsArray.forEach(a => {
      totalLone += a.lone_electrons;
      for (let id in a.bonds_to_neighbors) {
        bondOrders[id] = a.bonds_to_neighbors[id];
      }
    });

    let totalBonding = 0;
    for (let id in bondOrders) { totalBonding += bondOrders[id] * 2; }
    
    const actualTotal = totalLone + totalBonding;
    if (actualTotal !== expectedValence) {
      errors.push("Expected " + expectedValence + " total e-, got " + actualTotal);
    }

    return {
      title: "Lewis Structure: " + expectedName,
      passed: errors.length === 0,
      message: errors.length === 0 ? "✓ Passed" : "✗ " + errors.join(" | ")
    };
  }

  // Test Case 1: H2O
  const water = [new Atom(1, 2.1, 'H'), new Atom(6, 3.5, 'O'), new Atom(1, 2.1, 'H')];
  tests.push(validateStructure(studentFunction(water), "H₂O", "O", 8, 4));

  // Test Case 2: CO2
  const co2 = [new Atom(6, 3.5, 'O'), new Atom(4, 2.5, 'C'), new Atom(6, 3.5, 'O')];
  tests.push(validateStructure(studentFunction(co2), "CO₂", "C", 16, 0));

  // Test Case 3: NH3
  const nh3 = [new Atom(5, 3.0, 'N'), new Atom(1, 2.1, 'H'), new Atom(1, 2.1, 'H'), new Atom(1, 2.1, 'H')];
  tests.push(validateStructure(studentFunction(nh3), "NH₃", "N", 8, 2));

  return tests;
}`;
