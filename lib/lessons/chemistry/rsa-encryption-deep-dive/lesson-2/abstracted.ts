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
        // Handle single digit char codes if they ever occur (unlikely for typical ASCII)
        charCodeStr = numStr.substring(i, i + 1);
        i += 1;
      }
      message += String.fromCharCode(parseInt(charCodeStr, 10));
    }
    return new MessageConverter(message);
  }
}
`;
