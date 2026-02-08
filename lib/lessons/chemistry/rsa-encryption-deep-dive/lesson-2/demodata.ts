export const demoData = `const demoBase1 = 3n, demoExp1 = 5n, demoMod1 = 7n;
const demoBase2 = 17n, demoExp2 = 23n, demoMod2 = 31n;

const modExpResult1 = RSAHelper.power(demoBase1, demoExp1, demoMod1);
const modExpResult2 = RSAHelper.power(demoBase2, demoExp2, demoMod2);

const demoValues = [
  { base: demoBase1, exp: demoExp1, mod: demoMod1, result: modExpResult1 },
  { base: demoBase2, exp: demoExp2, mod: demoMod2, result: modExpResult2 }
];`;
