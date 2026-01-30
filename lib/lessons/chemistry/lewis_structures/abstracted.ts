export const abstractedCode = `
        class Atom {
          constructor(valence, electronegativity, name = 'Unknown') {
            this.uuid = Math.random().toString(36).substr(2, 9);
            this.valence = valence;
            this.electronegativity = electronegativity;
            this.bonds = 0;
            this.name = name;
            this.bonds_to_neighbors = {};
            this.lone_electrons = 0;
            this.is_central = false;
            this.is_terminal = false;
          }

          get is_octet() {
            let total_electrons_around_atom = 0;
            
            Object.values(this.bonds_to_neighbors).forEach(bond_order => {
              total_electrons_around_atom += bond_order * 2;
            });
            
            total_electrons_around_atom += this.lone_electrons;

            if (this.name === 'H' || this.valence === 1) {
              return total_electrons_around_atom >= 2;
            } else {
              return total_electrons_around_atom >= 8;
            }
          }

          get_neighbors() {
            return Object.keys(this.bonds_to_neighbors);
          }

          bond(other_atom, bond_order = 1) {
            // Check if there's already a bond between these atoms
            let existingBondUUID = null;
            let current_bond_order = 0;
            
            for (let bondUUID of Object.keys(this.bonds_to_neighbors)) {
              if (other_atom.bonds_to_neighbors[bondUUID] !== undefined) {
                existingBondUUID = bondUUID;
                current_bond_order = this.bonds_to_neighbors[bondUUID];
                break;
              }
            }
            
            if (existingBondUUID) {
              // Calculate electrons needed for bond upgrade
              let electrons_needed = (bond_order - current_bond_order) * 2;
              
              // Remove lone electrons from both atoms (they become bonding electrons)
              if (electrons_needed > 0) {
                let electrons_from_each = electrons_needed / 2;
                this.lone_electrons = Math.max(0, this.lone_electrons - electrons_from_each);
                other_atom.lone_electrons = Math.max(0, other_atom.lone_electrons - electrons_from_each);
              }
              
              // Upgrade existing bond
              this.bonds_to_neighbors[existingBondUUID] = bond_order;
              other_atom.bonds_to_neighbors[existingBondUUID] = bond_order;
            } else {
              // Create new bond - remove electrons for initial bond formation
              let electrons_needed = bond_order * 2;
              let electrons_from_each = electrons_needed / 2;
              this.lone_electrons = Math.max(0, this.lone_electrons - electrons_from_each);
              other_atom.lone_electrons = Math.max(0, other_atom.lone_electrons - electrons_from_each);
              
              // Create new bond
              const bondUUID = Math.random().toString(36).substr(2, 9);
              this.bonds_to_neighbors[bondUUID] = bond_order;
              other_atom.bonds_to_neighbors[bondUUID] = bond_order;
              existingBondUUID = bondUUID;
            }

            // Update total bond counts for both atoms
            this.bonds = Object.values(this.bonds_to_neighbors).reduce((a, b) => a + b, 0);
            other_atom.bonds = Object.values(other_atom.bonds_to_neighbors).reduce((a, b) => a + b, 0);
            return existingBondUUID; // Return the bond UUID for reference
          }
        }

        function check_octet(atom) {
          return atom.is_octet;
        }
      `;
