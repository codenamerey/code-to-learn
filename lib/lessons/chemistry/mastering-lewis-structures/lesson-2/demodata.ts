export const demoData = `
// NH₃ (Ammonia) - demonstrates central atom identification for lesson 2
const nitrogen = new Atom('N', 15);
const hydrogen1 = new Atom('H', 1);
const hydrogen2 = new Atom('H', 1);
const hydrogen3 = new Atom('H', 1);
const nh3 = new Molecule([nitrogen, hydrogen1, hydrogen2, hydrogen3], 0);
const demoAtoms = nh3;
`;
