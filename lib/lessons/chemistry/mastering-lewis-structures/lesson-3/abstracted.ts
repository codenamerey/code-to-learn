export const abstractedCode = `let nextAtomId = 1;

class Atom {
  constructor(symbol, groupNumber) {
    this.id = nextAtomId++;
    this.symbol = symbol;
    this.groupNumber = groupNumber;
    this.bondedTo = new Set(); // Stores IDs of atoms it's bonded to
    this.lonePairs = 0;
  }

  getId() {
    return this.id;
  }

  getSymbol() {
    return this.symbol;
  }

  getGroupNumber() {
    return this.groupNumber;
  }

  getValenceElectrons() {
    if (this.groupNumber >= 13) {
      return this.groupNumber - 10;
    } else if (this.groupNumber === 1 || this.groupNumber === 2) {
      return this.groupNumber;
    } else if (this.symbol === 'He') {
      return 2;
    }
    return 0;
  }

  // New methods for Lesson 3
  connectBond(targetAtomId) {
    this.bondedTo.add(targetAtomId);
  }

  addLonePair() {
    this.lonePairs++;
  }

  getBondsCount() {
    return this.bondedTo.size; // Counts single bonds for simplicity
  }

  getLonePairsCount() {
    return this.lonePairs;
  }

  // Total electrons 'around' the atom (shared + lone pair)
  getElectronsAround() {
    return (this.getBondsCount() * 2) + (this.lonePairs * 2);
  }
}

let nextMoleculeId = 1;

class Molecule {
  constructor(atoms, charge = 0) {
    this.id = nextMoleculeId++;
    this.atoms = atoms;
    this.charge = charge;
  }

  getAtoms() {
    return this.atoms;
  }

  getCharge() {
    return this.charge;
  }
}`;
