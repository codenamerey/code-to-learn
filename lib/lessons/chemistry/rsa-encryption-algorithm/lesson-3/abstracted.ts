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
  
  encrypt(message) {
    if (this.e === null) throw new Error('Public exponent not set');
    return modPow(message, this.e, this.n);
  }
  
  decrypt(ciphertext) {
    if (this.d === null) throw new Error('Private exponent not set');
    return modPow(ciphertext, this.d, this.n);
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
  
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function modInverse(a, m) {
  let m0 = m;
  let x0 = 0;
  let x1 = 1;
  
  if (m === 1) return 0;
  
  while (a > 1) {
    const q = Math.floor(a / m);
    let t = m;
    
    m = a % m;
    a = t;
    t = x0;
    
    x0 = x1 - q * x0;
    x1 = t;
  }
  
  if (x1 < 0) x1 += m0;
  
  return x1;
}

function modPow(base, exp, mod) {
  let result = 1;
  base = base % mod;
  
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  
  return result;
}`;
