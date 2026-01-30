export const abstractedCode = `
let bondCounter = 0;

class Atom {
  constructor(valenceElectrons, electronegativity, name = 'Unknown') {
    this.name = name;
    this.valenceElectrons = valenceElectrons;
    this.electronegativity = electronegativity;
    this.lone_electrons = 0;
    this.bonds_to_neighbors = {}; 
    this.is_central = false;
  }

  get total_electron_count() {
    let bonding = 0;
    for (let id in this.bonds_to_neighbors) {
      bonding += (this.bonds_to_neighbors[id] * 2);
    }
    return bonding + this.lone_electrons;
  }

  get is_octet() {
    let target = (this.name === 'H' || this.name === 'He') ? 2 : 8;
    return this.total_electron_count === target;
  }

  // Returns the current order of a bond with another atom
  get_bond_order(other_atom) {
    for (let id in this.bonds_to_neighbors) {
      if (other_atom.bonds_to_neighbors[id] !== undefined) {
        return this.bonds_to_neighbors[id];
      }
    }
    return 0;
  }

  bond(other_atom, order = 1) {
    let sharedID = null;
    for (let id in this.bonds_to_neighbors) {
      if (other_atom.bonds_to_neighbors[id] !== undefined) sharedID = id;
    }
    
    if (!sharedID) sharedID = "bond_" + (bondCounter++);
    
    this.bonds_to_neighbors[sharedID] = order;
    other_atom.bonds_to_neighbors[sharedID] = order;
  }
}
      `;
