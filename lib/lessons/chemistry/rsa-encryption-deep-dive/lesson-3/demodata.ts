export const demoData = `const p_demo = 61n;
const q_demo = 53n;

const demoKeyPair = new RSAKeyPair(p_demo, q_demo);
const demoPublicKey = demoKeyPair.getPublicKey();
const demoPrivateKey = demoKeyPair.getPrivateKey();

const demoValues = [
  { label: 'Prime P', value: p_demo },
  { label: 'Prime Q', value: q_demo },
  { label: 'Modulus N (P*Q)', value: demoPublicKey.n },
  { label: 'Phi(N) ((P-1)*(Q-1))', value: RSAHelper.phi(p_demo, q_demo) },
  { label: 'Public Exponent E', value: demoPublicKey.e },
  { label: 'Private Exponent D', value: demoPrivateKey }
];`;
