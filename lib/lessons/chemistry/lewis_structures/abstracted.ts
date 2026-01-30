export const abstractedCode = `
class Atom {
  /**
   * @param {number} valenceElectrons - Number of electrons in the outer shell (e.g., C=4, O=6).
   * @param {number} electronegativity - Pauling scale value.
   * @param {string} name - Chemical symbol.
   */
  constructor(valenceElectrons, electronegativity, name = 'Unknown') {
    this.uuid = Math.random().toString(36).substr(2, 9);
    this.valenceElectrons = valenceElectrons; // Total electrons available
    this.electronegativity = electronegativity;
    this.name = name;
    
    // State tracking
    this.bonds_to_neighbors = {}; // { bondUUID: bondOrder }
    this.lone_electrons = valenceElectrons; // Initially, all valence electrons are lone
    this.is_central = false;
    this.is_terminal = false;
  }

  /**
   * Calculates the total electrons associated with the atom.
   * Total = (Sum of Bond Orders * 2) + Lone Electrons
   */
  get total_electron_count() {
    let bonding_electrons = Object.values(this.bonds_to_neighbors).reduce((sum, order) => sum + (order * 2), 0);
    return bonding_electrons + this.lone_electrons;
  }

  /**
   * Formal Charge = Valence Electrons - [Lone Electrons + (Bonding Electrons / 2)]
   * In Lewis structures, Bonding Electrons / 2 is simply the sum of bond orders.
   */
  get formal_charge() {
    let total_bond_order = Object.values(this.bonds_to_neighbors).reduce((sum, order) => sum + order, 0);
    return this.valenceElectrons - (this.lone_electrons + total_bond_order);
  }

  /**
   * Checks if the atom satisfies the Octet (or Duet) rule.
   */
  get is_octet() {
    const count = this.total_electron_count;
    if (this.name === 'H' || this.name === 'He') {
      return count === 2;
    }
    return count === 8;
  }

  /**
   * Forms or upgrades a covalent bond.
   * @param {Atom} other_atom 
   * @param {number} target_order - The desired bond order (1, 2, or 3).
   */
  bond(other_atom, target_order = 1) {
    let bondUUID = null;
    let current_order = 0;

    // 1. Check for existing bond
    for (let id of Object.keys(this.bonds_to_neighbors)) {
      if (other_atom.bonds_to_neighbors[id] !== undefined) {
        bondUUID = id;
        current_order = this.bonds_to_neighbors[id];
        break;
      }
    }

    const order_increase = target_order - current_order;
    if (order_increase <= 0) return bondUUID;

    // 2. Verify electron availability
    // Each increase in bond order requires 1 electron from each atom
    if (this.lone_electrons < order_increase || other_atom.lone_electrons < order_increase) {
      throw new Error("Insufficient lone electrons to form/upgrade bond between " + this.name + " and " + other_atom.name);
    }

    // 3. Update electrons and bond order
    if (!bondUUID) {
      bondUUID = Math.random().toString(36).substr(2, 9);
    }

    this.lone_electrons -= order_increase;
    other_atom.lone_electrons -= order_increase;

    this.bonds_to_neighbors[bondUUID] = target_order;
    other_atom.bonds_to_neighbors[bondUUID] = target_order;

    return bondUUID;
  }

  get_neighbors() {
    return Object.keys(this.bonds_to_neighbors);
  }
}

/**
 * Helper to check octet status
 */
function check_octet(atom) {
  return atom.is_octet;
}
      `;
