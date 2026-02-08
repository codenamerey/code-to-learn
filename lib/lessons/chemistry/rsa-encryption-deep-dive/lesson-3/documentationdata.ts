export const documentationData = [
  {
    "className": "RSAHelper",
    "description": "A static utility class providing mathematical functions essential for RSA encryption, such as modular exponentiation, GCD, Euler's Totient function, and modular inverse.",
    "usage": "const result = RSAHelper.power(2n, 10n, 5n);\nconst phiN = RSAHelper.phi(11n, 13n);\nconst d = RSAHelper.modInverse(3n, phiN);",
    "methods": [
      {
        "method": "static power(base, exp, mod)",
        "description": "Calculates (base^exp) % mod using modular exponentiation. All arguments and return values are BigInts.",
        "returnType": "BigInt"
      },
      {
        "method": "static gcdExtended(a, b)",
        "description": "Implements the Extended Euclidean Algorithm to find gcd(a,b) and coefficients x,y such that ax + by = gcd(a,b).",
        "returnType": "{gcd: BigInt, x: BigInt, y: BigInt}"
      },
      {
        "method": "static modInverse(e, phi)",
        "description": "Calculates the modular multiplicative inverse of e modulo phi using the Extended Euclidean Algorithm. Returns d such that (e * d) % phi = 1.",
        "returnType": "BigInt"
      },
      {
        "method": "static gcd(a, b)",
        "description": "Calculates the Greatest Common Divisor of two BigInts.",
        "returnType": "BigInt"
      },
      {
        "method": "static phi(p, q)",
        "description": "Calculates Euler's Totient function φ(n) for n = p * q, where p and q are distinct primes. Returns (p-1)*(q-1).",
        "returnType": "BigInt"
      },
      {
        "method": "static areCoprime(a, b)",
        "description": "Checks if two BigInts are coprime (their GCD is 1).",
        "returnType": "boolean"
      }
    ],
    "properties": []
  },
  {
    "className": "MessageConverter",
    "description": "A utility class for converting messages to their numerical BigInt representation and vice-versa. Each character's ASCII value is concatenated to form the numerical string.",
    "usage": "const converter = new MessageConverter('Hello');\nconst numRep = converter.getNumericalRepresentation();",
    "methods": [
      {
        "method": "getMessage()",
        "description": "Returns the original message string.",
        "returnType": "string"
      },
      {
        "method": "getNumericalRepresentation()",
        "description": "Returns the BigInt numerical representation of the message.",
        "returnType": "BigInt"
      },
      {
        "method": "static fromNumber(num)",
        "description": "Creates a MessageConverter instance from a BigInt numerical representation, attempting to reconstruct the original message.",
        "returnType": "MessageConverter"
      }
    ],
    "properties": [
      {
        "type": "Read-Only",
        "property": "message",
        "dataType": "string",
        "description": "The original message string."
      },
      {
        "type": "Read-Only",
        "property": "numericalRepresentation",
        "dataType": "BigInt",
        "description": "The BigInt numerical representation of the message."
      }
    ]
  },
  {
    "className": "RSAKeyPair",
    "description": "Represents an RSA key pair, encapsulating the public (n, e) and private (d) keys, along with methods for encryption and decryption.",
    "usage": "const keyPair = new RSAKeyPair(11n, 13n);\nconst publicKey = keyPair.getPublicKey();\nconst privateKey = keyPair.getPrivateKey();\nconst encrypted = keyPair.encrypt(10n);\nconst decrypted = keyPair.decrypt(encrypted);",
    "methods": [
      {
        "method": "getPublicKey()",
        "description": "Returns an object containing the public modulus 'n' and public exponent 'e'.",
        "returnType": "{n: BigInt, e: BigInt}"
      },
      {
        "method": "getPrivateKey()",
        "description": "Returns the private exponent 'd'.",
        "returnType": "BigInt"
      },
      {
        "method": "encrypt(messageNumber)",
        "description": "Encrypts a numerical message using the public key (e, n).",
        "returnType": "BigInt"
      },
      {
        "method": "decrypt(cipherNumber)",
        "description": "Decrypts a numerical ciphertext using the private key (d, n).",
        "returnType": "BigInt"
      }
    ],
    "properties": [
      {
        "type": "Read-Only",
        "property": "p",
        "dataType": "BigInt",
        "description": "The first prime number used for key generation."
      },
      {
        "type": "Read-Only",
        "property": "q",
        "dataType": "BigInt",
        "description": "The second prime number used for key generation."
      },
      {
        "type": "Read-Only",
        "property": "n",
        "dataType": "BigInt",
        "description": "The modulus, product of p and q."
      },
      {
        "type": "Read-Only",
        "property": "phiN",
        "dataType": "BigInt",
        "description": "Euler's Totient function of n, (p-1)*(q-1)."
      },
      {
        "type": "Read-Only",
        "property": "e",
        "dataType": "BigInt",
        "description": "The public exponent."
      },
      {
        "type": "Read-Only",
        "property": "d",
        "dataType": "BigInt",
        "description": "The private exponent."
      }
    ]
  }
];
