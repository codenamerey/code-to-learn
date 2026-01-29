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
      `;
