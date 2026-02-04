export const testRunner = `
function runTests(studentFunction) {
  const tests = [];

  function validateStructure(moleculeData, expectedName, expectedCentralName, expectedValence, expectedCentralLone, expectedBonds, expectedLoneElectrons) {
    // Check if result has the correct structure: { atoms, centralAtom }
    if (!moleculeData || !moleculeData.atoms || !moleculeData.centralAtom) {
      return { title: expectedName, passed: false, message: "✗ Missing { atoms, centralAtom } structure." };
    }

    const atomsArray = moleculeData.atoms;
    const centralAtom = moleculeData.centralAtom;

    if (!Array.isArray(atomsArray) || !centralAtom) {
      return { title: expectedName, passed: false, message: "✗ Invalid structure format." };
    }

    let errors = [];

    // 1. Check Identity
    if (centralAtom.name !== expectedCentralName) {
      errors.push("Expected " + expectedCentralName + " central, got " + centralAtom.name);
    }

    // 2. Check Lone Electrons
    if (centralAtom.loneElectrons !== expectedCentralLone) {
      errors.push("Expected " + expectedCentralLone + " lone e-, got " + centralAtom.loneElectrons);
    }

    // 3. Verify central atom is marked as central
    if (!centralAtom.isCentral) {
      errors.push("Central atom not marked as isCentral");
    }

    // 4. Verify central atom exists in atoms array
    const centralInArray = atomsArray.find(a => a.uuid === centralAtom.uuid || 
      (a.name === centralAtom.name && a.isCentral === true));
    if (!centralInArray) {
      errors.push("Central atom not found in atoms array");
    }

    // 5. Check System Electrons (Conservation of Mass)
    let totalLone = 0;
    let bondOrders = {}; 
    atomsArray.forEach(a => {
      totalLone += a.loneElectrons;
      for (let id in a.bondsToNeighbors) {
        bondOrders[id] = a.bondsToNeighbors[id];
      }
    });

    let totalBonding = 0;
    for (let id in bondOrders) { totalBonding += bondOrders[id] * 2; }
    
    const actualTotal = totalLone + totalBonding;
    if (actualTotal !== expectedValence) {
      errors.push("Expected " + expectedValence + " total e-, got " + actualTotal);
    }

    // 6. Check Bond Orders
    if (expectedBonds) {
      for (let bondCheck of expectedBonds) {
        let atom1 = atomsArray.find(a => a.name === bondCheck.atom1);
        let atom2 = atomsArray.find(a => a.name === bondCheck.atom2);
        if (atom1 && atom2) {
          let actualBondOrder = atom1.getBondOrder ? atom1.getBondOrder(atom2) : 0;
          if (actualBondOrder !== bondCheck.order) {
            errors.push("Expected bond " + bondCheck.atom1 + "-" + bondCheck.atom2 + " order " + bondCheck.order + ", got " + actualBondOrder);
          }
        }
      }
    }

    // 7. Check Individual Lone Electrons
    if (expectedLoneElectrons) {
      for (let loneCheck of expectedLoneElectrons) {
        let atom = atomsArray.find(a => a.name === loneCheck.atom);
        if (atom) {
          if (atom.loneElectrons !== loneCheck.lone) {
            errors.push("Expected " + loneCheck.atom + " lone e- " + loneCheck.lone + ", got " + atom.loneElectrons);
          }
        }
      }
    }

    return {
      title: "Lewis Structure: " + expectedName,
      passed: errors.length === 0,
      message: errors.length === 0 ? "✓ Passed" : "✗ " + errors.join(" | ")
    };
  }

  // Test Case 1: H2O
  const water = [new Atom(1, 2.1, 'H'), new Atom(6, 3.5, 'O'), new Atom(1, 2.1, 'H')];
  water.forEach((atom, index) => { atom.uuid = 'test-atom-' + index; });
  tests.push(validateStructure(
    studentFunction(water), 
    "H₂O", 
    "O", 
    8, 
    4, 
    [
      { atom1: "O", atom2: "H", order: 1 },
      { atom1: "O", atom2: "H", order: 1 }
    ],
    [
      { atom: "O", lone: 4 },
      { atom: "H", lone: 0 },
      { atom: "H", lone: 0 }
    ]
  ));

  // Test Case 2: H2CO (Formaldehyde)
  const h2co = [new Atom(1, 2.1, 'H'), new Atom(1, 2.1, 'H'), new Atom(4, 2.5, 'C'), new Atom(6, 3.5, 'O')];
  h2co.forEach((atom, index) => { atom.uuid = 'test-atom-' + (index + 10); });
  tests.push(validateStructure(
    studentFunction(h2co), 
    "H₂CO", 
    "C", 
    12, 
    0,
    [
      { atom1: "C", atom2: "H", order: 1 },
      { atom1: "C", atom2: "H", order: 1 },
      { atom1: "C", atom2: "O", order: 2 }
    ],
    [
      { atom: "C", lone: 0 },
      { atom: "H", lone: 0 },
      { atom: "H", lone: 0 },
      { atom: "O", lone: 4 }
    ]
  ));

  // Test Case 3: NH3
  const nh3 = [new Atom(5, 3.0, 'N'), new Atom(1, 2.1, 'H'), new Atom(1, 2.1, 'H'), new Atom(1, 2.1, 'H')];
  nh3.forEach((atom, index) => { atom.uuid = 'test-atom-' + (index + 20); });
  tests.push(validateStructure(
    studentFunction(nh3), 
    "NH₃", 
    "N", 
    8, 
    2,
    [
      { atom1: "N", atom2: "H", order: 1 },
      { atom1: "N", atom2: "H", order: 1 },
      { atom1: "N", atom2: "H", order: 1 }
    ],
    [
      { atom: "N", lone: 2 },
      { atom: "H", lone: 0 },
      { atom: "H", lone: 0 },
      { atom: "H", lone: 0 }
    ]
  ));

  return tests;
}`;
