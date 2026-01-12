import { Atom } from "./atom.interface";

export interface Molecule {
  atoms: Atom[];
  central_atom: Atom;
}
