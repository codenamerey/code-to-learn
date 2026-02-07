export const testRunner = `function runTests(calculateLewisStructureDetails) {
  const tests = [];

  // Test Case 1: H2O (Water) - Neutral molecule
  {
    const hydrogen1 = new Atom('H', 1);
    const hydrogen2 = new Atom('H', 1);
    const oxygen = new Atom('O', 16);
    const h2o = new Molecule([hydrogen1, hydrogen2, oxygen], 0);
    const result = calculateLewisStructureDetails(h2o);
    const expected = 8;
    const passed = result.totalValenceElectrons === expected;
    tests.push({
      title: 'H2O (Water) - Neutral molecule',
      passed: passed,
      message: passed ? 'Correct total valence electrons.' : 'Expected ' + expected + ', got ' + result.totalValenceElectrons + '.'
    });
  }

  // Test Case 2: CO3^2- (Carbonate ion) - Anion
  {
    const carbon = new Atom('C', 14);
    const oxygen1 = new Atom('O', 16);
    const oxygen2 = new Atom('O', 16);
    const oxygen3 = new Atom('O', 16);
    const co3_2_minus = new Molecule([carbon, oxygen1, oxygen2, oxygen3], -2);
    const result = calculateLewisStructureDetails(co3_2_minus);
    const expected = 24;
    const passed = result.totalValenceElectrons === expected;
    tests.push({
      title: 'CO3^2- (Carbonate ion) - Anion',
      passed: passed,
      message: passed ? 'Correct total valence electrons, adjusted for charge.' : 'Expected ' + expected + ', got ' + result.totalValenceElectrons + '.'
    });
  }

  // Test Case 3: NH4+ (Ammonium ion) - Cation
  {
    const nitrogen = new Atom('N', 15);
    const hydrogen1 = new Atom('H', 1);
    const hydrogen2 = new Atom('H', 1);
    const hydrogen3 = new Atom('H', 1);
    const hydrogen4 = new Atom('H', 1);
    const nh4_plus = new Molecule([nitrogen, hydrogen1, hydrogen2, hydrogen3, hydrogen4], 1);
    const result = calculateLewisStructureDetails(nh4_plus);
    const expected = 8;
    const passed = result.totalValenceElectrons === expected;
    tests.push({
      title: 'NH4+ (Ammonium ion) - Cation',
      passed: passed,
      message: passed ? 'Correct total valence electrons, adjusted for charge.' : 'Expected ' + expected + ', got ' + result.totalValenceElectrons + '.'
    });
  }

  // Test Case 4: CH4 (Methane)
  {
    const carbon = new Atom('C', 14);
    const h1 = new Atom('H', 1);
    const h2 = new Atom('H', 1);
    const h3 = new Atom('H', 1);
    const h4 = new Atom('H', 1);
    const ch4 = new Molecule([carbon, h1, h2, h3, h4], 0);
    const result = calculateLewisStructureDetails(ch4);
    const expected = 8;
    const passed = result.totalValenceElectrons === expected;
    tests.push({
      title: 'CH4 (Methane) - Neutral molecule',
      passed: passed,
      message: passed ? 'Correct total valence electrons.' : 'Expected ' + expected + ', got ' + result.totalValenceElectrons + '.'
    });
  }

  return tests;
}`;
