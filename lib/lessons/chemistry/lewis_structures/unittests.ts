export const testRunner = `// Unit tests for Lewis structure algorithm
        function runTests(studentFunction) {
          const tests = [];
          
          function getElectronegativity(element) {
            const electronegativities = {
              'H': 2.1, 'C': 2.5, 'N': 3.0, 'O': 3.5, 'F': 4.0, 'P': 2.1, 'S': 2.5, 'Cl': 3.0
            };
            return electronegativities[element] || 2.0;
          }
          
          // Test Case 1: H₂O (Water)
          try {
            const waterAtoms = [
              new Atom(1, getElectronegativity('H'), 'H'),
              new Atom(6, getElectronegativity('O'), 'O'),
              new Atom(1, getElectronegativity('H'), 'H')
            ];
            const waterResult = studentFunction(waterAtoms);
            
            if (!waterResult || !waterResult.atoms || !waterResult.central_atom) {
              tests.push({
                name: "H₂O Structure Test",
                passed: false,
                message: "✗ Function must return {atoms: [...], central_atom: atom}"
              });
            } else {
              let waterPassed = true;
              const waterErrors = [];
              
              // Check central atom is oxygen
              if (waterResult.central_atom.name !== 'O') {
                waterPassed = false;
                waterErrors.push("Expected O as central atom, got " + waterResult.central_atom.name);
              }
              
              // Check 2 bonds from oxygen
              const oxygenBonds = Object.keys(waterResult.central_atom.bonds_to_neighbors).length;
              console.log(waterResult);
              if (oxygenBonds !== 2) {
                waterPassed = false;
                waterErrors.push("Expected 2 bonds from oxygen, got " + oxygenBonds);
              }
              
              // Check 4 lone electrons on oxygen (2 lone pairs)
              if (waterResult.central_atom.lone_electrons !== 4) {
                waterPassed = false;
                waterErrors.push("Expected 4 lone electrons on oxygen, got " + waterResult.central_atom.lone_electrons);
              }
              
              // Check hydrogen atoms follow duet rule
              const hydrogens = waterResult.atoms.filter(a => a.name === 'H');
              const hydrogensSatisfied = hydrogens.every(h => {
                const bondCount = Object.values(h.bonds_to_neighbors).reduce((sum, order) => sum + order, 0);
                return bondCount === 1 && h.lone_electrons === 0;
              });
              if (!hydrogensSatisfied) {
                waterPassed = false;
                waterErrors.push("Hydrogen atoms don't follow duet rule (1 bond, 0 lone electrons)");
              }
              
              // Check total electron count (8 valence electrons)
              let totalElectrons = 0;
              let totalLoneElectrons = 0;

              let seenBonds = new Set();
              waterResult.atoms.forEach(atom => {
                Object.keys(atom.bonds_to_neighbors).forEach(bondUUID => {
                  seenBonds.add(bondUUID);
                });
                totalLoneElectrons += atom.lone_electrons;
              });
              
              // Calculate total electrons: unique bonds * 2 + lone electrons
              totalElectrons = seenBonds.size * 2 + totalLoneElectrons;
              if (totalElectrons !== 8) {
                waterPassed = false;
                waterErrors.push("Expected 8 electrons total, got " + totalElectrons);
              }
              
              tests.push({
                name: "H₂O Structure Test",
                passed: waterPassed,
                message: waterPassed ? "✓ H-O-H with 4 lone electrons on O correctly implemented" : "✗ H₂O errors: " + waterErrors.join(', ')
              });
            }
          } catch (error) {
            tests.push({
              name: "H₂O Structure Test",
              passed: false,
              message: "✗ Runtime error: " + error.message
            });
          }

          // Test Case 2: CO₂ (Carbon Dioxide)
          try {
            const co2Atoms = [
              new Atom(6, getElectronegativity('O'), 'O'),
              new Atom(4, getElectronegativity('C'), 'C'),
              new Atom(6, getElectronegativity('O'), 'O')
            ];
            const co2Result = studentFunction(co2Atoms);
            
            if (!co2Result || !co2Result.atoms || !co2Result.central_atom) {
              tests.push({
                name: "CO₂ Structure Test",
                passed: false,
                message: "✗ Function must return {atoms: [...], central_atom: atom}"
              });
            } else {
              let co2Passed = true;
              const co2Errors = [];
              
              // Check central atom is carbon
              if (co2Result.central_atom.name !== 'C') {
                co2Passed = false;
                co2Errors.push("Expected C as central atom, got " + co2Result.central_atom.name);
              }
              
              // Check 2 bonds from carbon
              const carbonBonds = Object.keys(co2Result.central_atom.bonds_to_neighbors).length;
              if (carbonBonds !== 2) {
                co2Passed = false;
                co2Errors.push("Expected 2 bonds from carbon, got " + carbonBonds);
              }
              
              // Check 0 lone electrons on carbon
              if (co2Result.central_atom.lone_electrons !== 0) {
                co2Passed = false;
                co2Errors.push("Expected 0 lone electrons on carbon, got " + co2Result.central_atom.lone_electrons);
              }
              
              // Check oxygen atoms have double bonds (bond order 2)
              const oxygens = co2Result.atoms.filter(a => a.name === 'O');
              const doubleBonds = oxygens.every(o => {
                const bondCount = Object.values(o.bonds_to_neighbors).reduce((sum, order) => sum + order, 0);
                return bondCount === 2; // Double bond
              });
              if (!doubleBonds) {
                co2Passed = false;
                co2Errors.push("Expected double bonds (O=C=O), oxygen atoms should have bond order 2");
              }
              
              // Check total electron count (16 valence electrons)
              let totalElectrons = 0;
              let totalLoneElectrons = 0;

              let seenBonds = new Set();
              co2Result.atoms.forEach(atom => {
                Object.keys(atom.bonds_to_neighbors).forEach(bondUUID => {
                  seenBonds.add(bondUUID);
                });
                totalLoneElectrons += atom.lone_electrons;
              });
              
              // Calculate total electrons: unique bonds * 2 + lone electrons  
              totalElectrons = seenBonds.size * 2 + totalLoneElectrons;
              if (totalElectrons !== 16) {
                co2Passed = false;
                co2Errors.push("Expected 16 electrons total, got " + totalElectrons);
              }
              
              tests.push({
                name: "CO₂ Structure Test",
                passed: co2Passed,
                message: co2Passed ? "✓ O=C=O with no lone pairs correctly implemented" : "✗ CO₂ errors: " + co2Errors.join(', ')
              });
            }
          } catch (error) {
            tests.push({
              name: "CO₂ Structure Test",
              passed: false,
              message: "✗ Runtime error: " + error.message
            });
          }

          // Test Case 3: NH₃ (Ammonia)
          try {
            const nh3Atoms = [
              new Atom(5, getElectronegativity('N'), 'N'),
              new Atom(1, getElectronegativity('H'), 'H'),
              new Atom(1, getElectronegativity('H'), 'H'),
              new Atom(1, getElectronegativity('H'), 'H')
            ];
            const nh3Result = studentFunction(nh3Atoms);
            
            if (!nh3Result || !nh3Result.atoms || !nh3Result.central_atom) {
              tests.push({
                name: "NH₃ Structure Test",
                passed: false,
                message: "✗ Function must return {atoms: [...], central_atom: atom}"
              });
            } else {
              let nh3Passed = true;
              const nh3Errors = [];
              
              // Check central atom is nitrogen
              if (nh3Result.central_atom.name !== 'N') {
                nh3Passed = false;
                nh3Errors.push("Expected N as central atom, got " + nh3Result.central_atom.name);
              }
              
              // Check 3 bonds from nitrogen
              const nitrogenBonds = Object.keys(nh3Result.central_atom.bonds_to_neighbors).length;
              if (nitrogenBonds !== 3) {
                nh3Passed = false;
                nh3Errors.push("Expected 3 bonds from nitrogen, got " + nitrogenBonds);
              }
              
              // Check 2 lone electrons on nitrogen (1 lone pair)
              if (nh3Result.central_atom.lone_electrons !== 2) {
                nh3Passed = false;
                nh3Errors.push("Expected 2 lone electrons on nitrogen, got " + nh3Result.central_atom.lone_electrons);
              }
              
              // Check hydrogen atoms follow duet rule
              const hydrogens = nh3Result.atoms.filter(a => a.name === 'H');
              const hydrogensSatisfied = hydrogens.every(h => {
                const bondCount = Object.values(h.bonds_to_neighbors).reduce((sum, order) => sum + order, 0);
                return bondCount === 1 && h.lone_electrons === 0;
              });
              if (!hydrogensSatisfied) {
                nh3Passed = false;
                nh3Errors.push("Hydrogen atoms don't follow duet rule (1 bond, 0 lone electrons)");
              }
              
              // Check total electron count (8 valence electrons)
              let totalElectrons = 0;
              let totalLoneElectrons = 0;

              let seenBonds = new Set();
              nh3Result.atoms.forEach(atom => {
                Object.keys(atom.bonds_to_neighbors).forEach(bondUUID => {
                  seenBonds.add(bondUUID);
                });
                totalLoneElectrons += atom.lone_electrons;
              });
              
              // Calculate total electrons: unique bonds * 2 + lone electrons
              totalElectrons = seenBonds.size * 2 + totalLoneElectrons;
              if (totalElectrons !== 8) {
                nh3Passed = false;
                nh3Errors.push("Expected 8 electrons total, got " + totalElectrons);
              }
              
              tests.push({
                name: "NH₃ Structure Test",
                passed: nh3Passed,
                message: nh3Passed ? "✓ H₃N with 2 lone electrons on N correctly implemented" : "✗ NH₃ errors: " + nh3Errors.join(', ')
              });
            }
          } catch (error) {
            tests.push({
              name: "NH₃ Structure Test",
              passed: false,
              message: "✗ Runtime error: " + error.message
            });
          }
          
          return tests;
        }`;
