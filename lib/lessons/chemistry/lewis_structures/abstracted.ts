export const abstractedCode = `
        class Atom {
          constructor(valence, electronegativity, name = 'Unknown') {
            this.uuid = Math.random().toString(36).substr(2, 9);
            this.valence = valence;
            this.electronegativity = electronegativity;
            this.bonds = 0;
            this.name = name;
            this.bonds_to_neighbors = {};
            this.lone_pairs = 0;
            this.is_central = false;
            this.is_terminal = false;
            this.is_octet = false;
          }

          get_neighbors() {
            return Object.keys(this.bonds_to_neighbors);
          }

          bond(other_atom, bond_order = 1) {
            const current_bond_self = this.bonds_to_neighbors[other_atom.uuid] || 0;
            const current_bond_other = other_atom.bonds_to_neighbors[this.uuid] || 0;

            this.bonds_to_neighbors[other_atom.uuid] = current_bond_self + bond_order;
            other_atom.bonds_to_neighbors[this.uuid] = current_bond_other + bond_order;

            this.bonds = Object.values(this.bonds_to_neighbors).reduce((a, b) => a + b, 0);
            other_atom.bonds = Object.values(other_atom.bonds_to_neighbors).reduce((a, b) => a + b, 0);
            return true;
          }
        }

        function check_octet(atom) {
          let total_electrons_around_atom = 0;
          
          Object.values(atom.bonds_to_neighbors).forEach(bond_order => {
            total_electrons_around_atom += bond_order * 2;
          });
          
          total_electrons_around_atom += atom.lone_pairs * 2;

          if (atom.name === 'Hydrogen' || atom.valence === 1) {
            atom.is_octet = (total_electrons_around_atom === 2);
          } else {
            atom.is_octet = (total_electrons_around_atom === 8);
          }
          return atom.is_octet;
        }

        // Unit tests for Lewis structure algorithm
        function runTests(studentFunction) {
          const tests = [];
          
          try {
            const result = studentFunction();
            
            // Test 1: Function returns correct structure
            if (!result || !result.atoms || !result.central_atom) {
              tests.push({
                name: "Return Structure",
                passed: false,
                message: "Function must return {atoms: [...], central_atom: atom}"
              });
              return tests;
            }
            
            tests.push({
              name: "Return Structure", 
              passed: true,
              message: "✓ Correct return format"
            });
            
            // Test 2: Central atom identification
            const centralIsOxygen = result.central_atom.name === 'O' && result.central_atom.is_central;
            tests.push({
              name: "Central Atom Selection",
              passed: centralIsOxygen,
              message: centralIsOxygen ? "✓ Oxygen correctly identified as central" : \`✗ Wrong central atom: \${result.central_atom.name}\`
            });
            
            // Test 3: Electron counting
            const totalValence = result.atoms.reduce((sum, atom) => sum + atom.valence, 0);
            tests.push({
              name: "Valence Electron Count",
              passed: totalValence === 8,
              message: totalValence === 8 ? "✓ Correctly counted 8 valence electrons" : \`✗ Expected 8, got \${totalValence}\`
            });
            
            // Test 4: Bond formation
            const centralBonds = Object.keys(result.central_atom.bonds_to_neighbors).length;
            tests.push({
              name: "Bond Formation",
              passed: centralBonds === 2,
              message: centralBonds === 2 ? "✓ Central atom has 2 bonds" : \`✗ Expected 2 bonds, got \${centralBonds}\`
            });
            
            // Test 5: Electron distribution
            let totalElectronsUsed = 0;
            result.atoms.forEach(atom => {
              // Count electrons in bonds (each bond contributes to both atoms)
              const bondElectrons = Object.values(atom.bonds_to_neighbors).reduce((sum, order) => sum + order, 0);
              totalElectronsUsed += bondElectrons;
              // Count lone pair electrons
              totalElectronsUsed += atom.lone_pairs * 2;
            });
            totalElectronsUsed /= 2; // Each bond counted twice
            
            tests.push({
              name: "Electron Conservation",
              passed: totalElectronsUsed === 8,
              message: totalElectronsUsed === 8 ? "✓ All electrons properly distributed" : \`✗ Expected 8 electrons used, got \${totalElectronsUsed}\`
            });
            
            // Test 6: Octet satisfaction
            const hydrogensSatisfied = result.atoms.filter(a => a.name === 'H').every(h => {
              const bondCount = Object.values(h.bonds_to_neighbors).reduce((sum, order) => sum + order, 0);
              return bondCount === 1 && h.lone_pairs === 0; // H needs exactly 1 bond, 0 lone pairs
            });
            
            tests.push({
              name: "Hydrogen Duet Rule", 
              passed: hydrogensSatisfied,
              message: hydrogensSatisfied ? "✓ Hydrogen atoms satisfy duet rule" : "✗ Hydrogen atoms don't follow duet rule"
            });
            
            // Test 7: Oxygen octet
            const oxygenElectrons = Object.values(result.central_atom.bonds_to_neighbors).reduce((sum, order) => sum + order, 0) * 2 + result.central_atom.lone_pairs * 2;
            tests.push({
              name: "Oxygen Octet Rule",
              passed: oxygenElectrons === 8,
              message: oxygenElectrons === 8 ? "✓ Oxygen satisfies octet rule" : \`✗ Oxygen has \${oxygenElectrons} electrons, needs 8\`
            });
            
          } catch (error: any) {
            tests.push({
              name: "Algorithm Execution",
              passed: false,
              message: \`✗ Runtime error: \${error.message}\`
            });
          }
          
          return tests;
        }
      `;
