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
            // Generate a unique UUID for this bond
            const bondUUID = Math.random().toString(36).substr(2, 9);
            
            // Both atoms reference the same bond UUID
            this.bonds_to_neighbors[bondUUID] = bond_order;
            other_atom.bonds_to_neighbors[bondUUID] = bond_order;

            // Update total bond counts for both atoms
            this.bonds = Object.values(this.bonds_to_neighbors).reduce((a, b) => a + b, 0);
            other_atom.bonds = Object.values(other_atom.bonds_to_neighbors).reduce((a, b) => a + b, 0);
            return bondUUID; // Return the bond UUID for reference if needed
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
      `;
