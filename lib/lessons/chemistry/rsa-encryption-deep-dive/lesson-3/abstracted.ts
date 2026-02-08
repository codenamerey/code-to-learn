export const abstractedCode = `class RSAHelper {
  static power(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        result = (result * base) % mod;
      }
      base = (base * base) % mod;
      exp = exp / 2n;
    }
    return result;
  }

  static gcdExtended(a, b) {
    let x = 0n, y = 1n, lastx = 1n, lasty = 0n;
    let temp;
    while (b !== 0n) {
      const quotient = a / b;
      temp = a;
      a = b;
      b = temp % b;

      temp = lastx;
      lastx = x;
      x = temp - quotient * x;

      temp = lasty;
      lasty = y;
      y = temp - quotient * y;
    }
    return { gcd: a, x: lastx, y: lasty };
  }

  static modInverse(e, phi) {
    const { gcd, x } = RSAHelper.gcdExtended(e, phi);
    if (gcd !== 1n) {
      throw new Error('e is not coprime to phi (' + phi + ')');
    }
    return (x % phi + phi) % phi;
  }

  static gcd(a, b) {
    a = BigInt(a);
    b = BigInt(b);
    while (b !== 0n) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  static phi(p, q) {
    p = BigInt(p);
    q = BigInt(q);
    return (p - 1n) * (q - 1n);
  }

  static areCoprime(a, b) {
    return RSAHelper.gcd(a, b) === 1n;
  }
}

class MessageConverter {
  constructor(message) {
    this.message = message;
    this.numericalRepresentation = this._convertToNumber(message);
  }

  _convertToNumber(message) {
    if (message.length === 0) {
      return 0n;
    }
    let numString = '';
    for (let i = 0; i < message.length; i++) {
      numString += message.charCodeAt(i).toString();
    }
    return BigInt(numString);
  }

  getMessage() {
    return this.message;
  }

  getNumericalRepresentation() {
    return this.numericalRepresentation;
  }

  static fromNumber(num) {
    let numStr = num.toString();
    let message = '';
    let i = 0;
    while (i < numStr.length) {
      let charCodeStr;
      if (numStr.length - i >= 3 && numStr.substring(i, i + 3) >= '100') { 
        charCodeStr = numStr.substring(i, i + 3);
        i += 3;
      } else if (numStr.length - i >= 2) {
        charCodeStr = numStr.substring(i, i + 2);
        i += 2;
      } else {
        charCodeStr = numStr.substring(i, i + 1);
        i += 1;
      }
      message += String.fromCharCode(parseInt(charCodeStr, 10));
    }
    return new MessageConverter(message);
  }
}

class RSAKeyPair {
  constructor(p, q, e) {
    this.p = p;
    this.q = q;
    this.n = p * q;
    this.phiN = RSAHelper.phi(p, q);
    this.e = e || this._findE(this.phiN);
    this.d = RSAHelper.modInverse(this.e, this.phiN);

    if (!RSAHelper.areCoprime(this.e, this.phiN)) {
        throw new Error('Chosen e is not coprime to phi(n).');
    }
  }

  _findE(phiN) {
    const commonEs = [3n, 17n, 65537n];
    for (const eVal of commonEs) {
      if (eVal < phiN && RSAHelper.areCoprime(eVal, phiN)) {
        return eVal;
      }
    }
    throw new Error('Could not find a suitable public exponent e from common values.');
  }

  getPublicKey() {
    return { n: this.n, e: this.e };
  }

  getPrivateKey() {
    return this.d;
  }

  encrypt(messageNumber) {
    return RSAHelper.power(messageNumber, this.e, this.n);
  }

  decrypt(cipherNumber) {
    return RSAHelper.power(cipherNumber, this.d, this.n);
  }
}
`;
