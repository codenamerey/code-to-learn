export const testRunner = `function runTests(calculateLewisStructureDetails) {
  const tests = [];

  // Test Case 1: H2O (Water)
  {
    const hydrogen1 = new Atom('H', 1);
    const hydrogen2 = new Atom('H', 1);
    const oxygen = new Atom('O', 16);
    const h2o = new Molecule([hydrogen1, hydrogen2, oxygen], 0);
    
    const result = calculateLewisStructureDetails(h2o);

    const expectedBonds = 2; // O-H, O-H
    const expectedTotalLonePairs = 2; // 2 on Oxygen
    const expectedRemainingElectrons = 0;
    
    const passedBonds = result.bonds.length === expectedBonds;
    // Verify oxygen has 2 bonds, hydrogens have 1
    const oAtomInResult = h2o.getAtoms().find(a => a.getId() === oxygen.getId());
    const h1AtomInResult = h2o.getAtoms().find(a => a.getId() === hydrogen1.getId());
    const h2AtomInResult = h2o.getAtoms().find(a => a.getId() === hydrogen2.getId());

    const passedAtomBonds = oAtomInResult.getBondsCount() === 2 && h1AtomInResult.getBondsCount() === 1 && h2AtomInResult.getBondsCount() === 1;

    const actualOxygenLonePairs = result.atomLonePairs.find(lp => lp.atomId === oxygen.getId())?.lonePairs || 0;
    const actualHydrogen1LonePairs = result.atomLonePairs.find(lp => lp.atomId === hydrogen1.getId())?.lonePairs || 0;
    const actualHydrogen2LonePairs = result.atomLonePairs.find(lp => lp.atomId === hydrogen2.getId())?.lonePairs || 0;
    
    const passedLonePairs = actualOxygenLonePairs === expectedTotalLonePairs && actualHydrogen1LonePairs === 0 && actualHydrogen2LonePairs === 0;
    const passedRemaining = result.remainingValenceElectrons === expectedRemainingElectrons;

    const bondsMsg = passedBonds ? 'OK' : 'Expected ' + expectedBonds + ', got ' + result.bonds.length + '.';
    const atomBondsMsg = passedAtomBonds ? 'OK' : 'Incorrect atom bond counts.';
    const lonePairsMsg = passedLonePairs ? 'OK' : 'Expected O: ' + expectedTotalLonePairs + ', H: 0. Got O: ' + actualOxygenLonePairs + ', H1: ' + actualHydrogen1LonePairs + ', H2: ' + actualHydrogen2LonePairs + '.';
    const remainingMsg = passedRemaining ? 'OK' : 'Expected ' + expectedRemainingElectrons + ', got ' + result.remainingValenceElectrons + '.';

    tests.push({
      title: 'H2O - Bonds and Lone Pairs',
      passed: passedBonds && passedAtomBonds && passedLonePairs && passedRemaining,
      message: (passedBonds && passedAtomBonds && passedLonePairs && passedRemaining) ? 'Correct bonds, lone pairs, and remaining electrons.' : 
               'Bonds: ' + bondsMsg + ' Atom Bonds: ' + atomBondsMsg + ' Lone Pairs: ' + lonePairsMsg + ' Remaining: ' + remainingMsg
    });
  }

  // Test Case 2: NH3 (Ammonia)
  {
    const nitrogen = new Atom('N', 15);
    const hydrogen1 = new Atom('H', 1);
    const hydrogen2 = new Atom('H', 1);
    const hydrogen3 = new Atom('H', 1);
    const nh3 = new Molecule([nitrogen, hydrogen1, hydrogen2, hydrogen3], 0);
    
    const result = calculateLewisStructureDetails(nh3);

    const expectedBonds = 3; 
    const expectedTotalLonePairs = 1; // 1 on Nitrogen
    const expectedRemainingElectrons = 0;

    const passedBonds = result.bonds.length === expectedBonds;

    const nAtomInResult = nh3.getAtoms().find(a => a.getId() === nitrogen.getId());
    const hAtomsInResult = nh3.getAtoms().filter(a => a.getSymbol() === 'H');
    const passedAtomBonds = nAtomInResult.getBondsCount() === 3 && hAtomsInResult.every(h => h.getBondsCount() === 1);

    const actualNitrogenLonePairs = result.atomLonePairs.find(lp => lp.atomId === nitrogen.getId())?.lonePairs || 0;
    const actualHydrogenLonePairs = result.atomLonePairs.filter(lp => lp.atomId !== nitrogen.getId()).every(lp => lp.lonePairs === 0);

    const passedLonePairs = actualNitrogenLonePairs === expectedTotalLonePairs && actualHydrogenLonePairs;
    const passedRemaining = result.remainingValenceElectrons === expectedRemainingElectrons;

    const bondsMsg = passedBonds ? 'OK' : 'Expected ' + expectedBonds + ', got ' + result.bonds.length + '.';
    const atomBondsMsg = passedAtomBonds ? 'OK' : 'Incorrect atom bond counts.';
    const lonePairsMsg = passedLonePairs ? 'OK' : 'Expected N: ' + expectedTotalLonePairs + ', H: 0. Got N: ' + actualNitrogenLonePairs + '.';
    const remainingMsg = passedRemaining ? 'OK' : 'Expected ' + expectedRemainingElectrons + ', got ' + result.remainingValenceElectrons + '.';

    tests.push({
      title: 'NH3 - Bonds and Lone Pairs',
      passed: passedBonds && passedAtomBonds && passedLonePairs && passedRemaining,
      message: (passedBonds && passedAtomBonds && passedLonePairs && passedRemaining) ? 'Correct bonds, lone pairs, and remaining electrons.' : 
               'Bonds: ' + bondsMsg + ' Atom Bonds: ' + atomBondsMsg + ' Lone Pairs: ' + lonePairsMsg + ' Remaining: ' + remainingMsg
    });
  }

  // Test Case 3: CO2 (Carbon Dioxide) - Should have remaining electrons for double bonds, but we don't form them yet.
  {
    const carbon = new Atom('C', 14);
    const oxygen1 = new Atom('O', 16);
    const oxygen2 = new Atom('O', 16);
    const co2 = new Molecule([carbon, oxygen1, oxygen2], 0);
    
    const result = calculateLewisStructureDetails(co2);

    const expectedValence = 16;
    const expectedBonds = 2; // C-O, C-O
    const expectedOxygenLonePairs = 3; // 3 pairs on each O
    const expectedCarbonLonePairs = 0;
    const expectedRemainingElectrons = 0;
    
    const passedValence = result.totalValenceElectrons === expectedValence;
    const passedBonds = result.bonds.length === expectedBonds;

    const cAtomInResult = co2.getAtoms().find(a => a.getId() === carbon.getId());
    const o1AtomInResult = co2.getAtoms().find(a => a.getId() === oxygen1.getId());
    const o2AtomInResult = co2.getAtoms().find(a => a.getId() === oxygen2.getId());
    const passedAtomBonds = cAtomInResult.getBondsCount() === 2 && o1AtomInResult.getBondsCount() === 1 && o2AtomInResult.getBondsCount() === 1;

    const actualOxygen1LonePairs = result.atomLonePairs.find(lp => lp.atomId === oxygen1.getId())?.lonePairs || 0;
    const actualOxygen2LonePairs = result.atomLonePairs.find(lp => lp.atomId === oxygen2.getId())?.lonePairs || 0;
    const actualCarbonLonePairs = result.atomLonePairs.find(lp => lp.atomId === carbon.getId())?.lonePairs || 0;

    const passedLonePairs = actualOxygen1LonePairs === expectedOxygenLonePairs && actualOxygen2LonePairs === expectedOxygenLonePairs && actualCarbonLonePairs === expectedCarbonLonePairs;
    const passedRemaining = result.remainingValenceElectrons === expectedRemainingElectrons;

    const valenceMsg = passedValence ? 'OK' : 'Expected ' + expectedValence + ', got ' + result.totalValenceElectrons + '.';
    const bondsMsg = passedBonds ? 'OK' : 'Expected ' + expectedBonds + ', got ' + result.bonds.length + '.';
    const atomBondsMsg = passedAtomBonds ? 'OK' : 'Incorrect atom bond counts.';
    const lonePairsMsg = passedLonePairs ? 'OK' : 'Expected O: 3, C: 0. Got O1: ' + actualOxygen1LonePairs + ', O2: ' + actualOxygen2LonePairs + ', C: ' + actualCarbonLonePairs + '.';
    const remainingMsg = passedRemaining ? 'OK' : 'Expected ' + expectedRemainingElectrons + ', got ' + result.remainingValenceElectrons + '.';

    tests.push({
      title: 'CO2 - Bonds and Lone Pairs (initial distribution)',
      passed: passedValence && passedBonds && passedAtomBonds && passedLonePairs && passedRemaining,
      message: (passedValence && passedBonds && passedAtomBonds && passedLonePairs && passedRemaining) ? 'Correct bonds, lone pairs, and remaining electrons.' : 
               'Valence: ' + valenceMsg + ' Bonds: ' + bondsMsg + ' Atom Bonds: ' + atomBondsMsg + ' Lone Pairs: ' + lonePairsMsg + ' Remaining: ' + remainingMsg
    });
  }

  return tests;
}`;
