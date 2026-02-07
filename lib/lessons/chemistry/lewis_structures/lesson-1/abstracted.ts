export const abstractedCode = `
let bondCounter = 0;

class Atom {
  constructor(valenceElectrons, electronegativity, name = 'Unknown') {
    this.name = name;
    this.valenceElectrons = valenceElectrons;
    this.electronegativity = electronegativity;
    this.loneElectrons = 0;
    this.bondsToNeighbors = {}; 
    this.isCentral = false;
  }

  get totalElectronCount() {
    let bonding = 0;
    for (let id in this.bondsToNeighbors) {
      bonding += (this.bondsToNeighbors[id] * 2);
    }
    return bonding + this.loneElectrons;
  }

  get isOctet() {
    let target = (this.name === 'H' || this.name === 'He') ? 2 : 8;
    return this.totalElectronCount === target;
  }

  // Returns the current order of a bond with another atom
  getBondOrder(otherAtom) {
    for (let id in this.bondsToNeighbors) {
      if (otherAtom.bondsToNeighbors[id] !== undefined) {
        return this.bondsToNeighbors[id];
      }
    }
    return 0;
  }

  bond(otherAtom, order = 1) {
    let sharedID = null;
    for (let id in this.bondsToNeighbors) {
      if (otherAtom.bondsToNeighbors[id] !== undefined) sharedID = id;
    }
    
    if (!sharedID) sharedID = "bond_" + (bondCounter++);
    
    this.bondsToNeighbors[sharedID] = order;
    otherAtom.bondsToNeighbors[sharedID] = order;
  }
}
      `;
