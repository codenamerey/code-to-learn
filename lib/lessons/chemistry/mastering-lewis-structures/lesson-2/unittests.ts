export const testRunner = `function runTests(calculateLewisStructureDetails) {
  const tests = [];

  // Test Case 1: CO2 (Carbon Dioxide)
  {
    const carbon = new Atom('C', 14);
    const oxygen1 = new Atom('O', 16);
    const oxygen2 = new Atom('O', 16);
    const co2 = new Molecule([carbon, oxygen1, oxygen2], 0);
    const result = calculateLewisStructureDetails(co2);
    const expectedValence = 16;
    const expectedCentralAtomId = carbon.getId();
    const expectedOctetGoals = [
      { atomId: carbon.getId(), goal: 8 },
      { atomId: oxygen1.getId(), goal: 8 },
      { atomId: oxygen2.getId(), goal: 8 }
    ];

    const passedValence = result.totalValenceElectrons === expectedValence;
    const passedCentral = result.centralAtomId === expectedCentralAtomId;
    const passedOctetGoals = result.atomOctetGoals.length === expectedOctetGoals.length &&
                             expectedOctetGoals.every(expectedGoal => 
                               result.atomOctetGoals.some(actualGoal => 
                                 actualGoal.atomId === expectedGoal.atomId && actualGoal.goal === expectedGoal.goal
                               )
                             );

    const valenceMsg = passedValence ? 'OK' : 'Expected ' + expectedValence + ', got ' + result.totalValenceElectrons + '.';
    const centralMsg = passedCentral ? 'OK' : 'Expected ID ' + expectedCentralAtomId + ', got ' + result.centralAtomId + '.';
    const octetMsg = passedOctetGoals ? 'OK' : 'Incorrect octet goals.';

    tests.push({
      title: 'CO2 - Central atom, valence, octet goals',
      passed: passedValence && passedCentral && passedOctetGoals,
      message: passedValence && passedCentral && passedOctetGoals ? 'All aspects correct.' : 
               'Valence: ' + valenceMsg + ' Central: ' + centralMsg + ' Octets: ' + octetMsg
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
    const expectedValence = 8;
    const expectedCentralAtomId = nitrogen.getId();
    const expectedOctetGoals = [
      { atomId: nitrogen.getId(), goal: 8 },
      { atomId: hydrogen1.getId(), goal: 2 },
      { atomId: hydrogen2.getId(), goal: 2 },
      { atomId: hydrogen3.getId(), goal: 2 }
    ];

    const passedValence = result.totalValenceElectrons === expectedValence;
    const passedCentral = result.centralAtomId === expectedCentralAtomId;
    const passedOctetGoals = result.atomOctetGoals.length === expectedOctetGoals.length &&
                             expectedOctetGoals.every(expectedGoal => 
                               result.atomOctetGoals.some(actualGoal => 
                                 actualGoal.atomId === expectedGoal.atomId && actualGoal.goal === expectedGoal.goal
                               )
                             );

    const valenceMsg = passedValence ? 'OK' : 'Expected ' + expectedValence + ', got ' + result.totalValenceElectrons + '.';
    const centralMsg = passedCentral ? 'OK' : 'Expected ID ' + expectedCentralAtomId + ', got ' + result.centralAtomId + '.';
    const octetMsg = passedOctetGoals ? 'OK' : 'Incorrect octet goals.';

    tests.push({
      title: 'NH3 - Central atom, valence, octet goals',
      passed: passedValence && passedCentral && passedOctetGoals,
      message: passedValence && passedCentral && passedOctetGoals ? 'All aspects correct.' : 
               'Valence: ' + valenceMsg + ' Central: ' + centralMsg + ' Octets: ' + octetMsg
    });
  }

  // Test Case 3: H2O (Water)
  {
    const hydrogen1 = new Atom('H', 1);
    const hydrogen2 = new Atom('H', 1);
    const oxygen = new Atom('O', 16);
    const h2o = new Molecule([hydrogen1, hydrogen2, oxygen], 0);
    const result = calculateLewisStructureDetails(h2o);
    const expectedValence = 8;
    const expectedCentralAtomId = oxygen.getId();
    const expectedOctetGoals = [
      { atomId: hydrogen1.getId(), goal: 2 },
      { atomId: hydrogen2.getId(), goal: 2 },
      { atomId: oxygen.getId(), goal: 8 }
    ];

    const passedValence = result.totalValenceElectrons === expectedValence;
    const passedCentral = result.centralAtomId === expectedCentralAtomId;
    const passedOctetGoals = result.atomOctetGoals.length === expectedOctetGoals.length &&
                             expectedOctetGoals.every(expectedGoal => 
                               result.atomOctetGoals.some(actualGoal => 
                                 actualGoal.atomId === expectedGoal.atomId && actualGoal.goal === expectedGoal.goal
                               )
                             );

    const valenceMsg = passedValence ? 'OK' : 'Expected ' + expectedValence + ', got ' + result.totalValenceElectrons + '.';
    const centralMsg = passedCentral ? 'OK' : 'Expected ID ' + expectedCentralAtomId + ', got ' + result.centralAtomId + '.';
    const octetMsg = passedOctetGoals ? 'OK' : 'Incorrect octet goals.';

    tests.push({
      title: 'H2O - Central atom, valence, octet goals',
      passed: passedValence && passedCentral && passedOctetGoals,
      message: passedValence && passedCentral && passedOctetGoals ? 'All aspects correct.' : 
               'Valence: ' + valenceMsg + ' Central: ' + centralMsg + ' Octets: ' + octetMsg
    });
  }

  // Test Case 4: O2 (Oxygen molecule) - No clear central atom, pick first
  {
    const oxygen1 = new Atom('O', 16);
    const oxygen2 = new Atom('O', 16);
    const o2 = new Molecule([oxygen1, oxygen2], 0);
    const result = calculateLewisStructureDetails(o2);
    const expectedValence = 12;
    const expectedCentralAtomId = oxygen1.getId(); // First non-H, first in list
    const expectedOctetGoals = [
      { atomId: oxygen1.getId(), goal: 8 },
      { atomId: oxygen2.getId(), goal: 8 }
    ];

    const passedValence = result.totalValenceElectrons === expectedValence;
    const passedCentral = result.centralAtomId === expectedCentralAtomId;
    const passedOctetGoals = result.atomOctetGoals.length === expectedOctetGoals.length &&
                             expectedOctetGoals.every(expectedGoal => 
                               result.atomOctetGoals.some(actualGoal => 
                                 actualGoal.atomId === expectedGoal.atomId && actualGoal.goal === expectedGoal.goal
                               )
                             );

    const valenceMsg = passedValence ? 'OK' : 'Expected ' + expectedValence + ', got ' + result.totalValenceElectrons + '.';
    const centralMsg = passedCentral ? 'OK' : 'Expected ID ' + expectedCentralAtomId + ', got ' + result.centralAtomId + '.';
    const octetMsg = passedOctetGoals ? 'OK' : 'Incorrect octet goals.';

    tests.push({
      title: 'O2 - No clear central atom, pick first, valence, octet goals',
      passed: passedValence && passedCentral && passedOctetGoals,
      message: passedValence && passedCentral && passedOctetGoals ? 'All aspects correct.' : 
               'Valence: ' + valenceMsg + ' Central: ' + centralMsg + ' Octets: ' + octetMsg
    });
  }

  return tests;
}`;
