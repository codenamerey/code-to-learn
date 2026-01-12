export interface Atom {
  uuid: string;
  valence: number;
  electronegativity: number;
  name: string;
  bonds_to_neighbors: { [key: string]: number };
  lone_pairs: number;
  is_central: boolean;
  is_terminal: boolean;
  is_octet: boolean;
}
