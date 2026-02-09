export const abstractedCode = `class RSAKey {
  constructor(p, q, n, phi) {
    this.p = p;
    this.q = q;
    this.n = n;
    this.phi = phi;
    this.e = null;
    this.d = null;
  }
  
  get modulus() {
    return this.n;
  }
  
  get totient() {
    return this.phi;
  }
  
  setPublicExponent(e) {
    this.e = e;
  }
  
  setPrivateExponent(d) {
    this.d = d;
  }
  
  getPublicKey() {
    return { n: this.n, e: this.e };
  }
  
  getPrivateKey() {
    return { n: this.n, d: this.d };
  }
}

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  const maxIterations = 1000; // Prevent infinite loops
  let iterations = 0;
  while (b !== 0 && iterations < maxIterations) {
    // console.log('GCD Step:', { a, b });
    const temp = b;
    b = a % b;
    a = temp;
    iterations++;
  }
  return a;
}`;
