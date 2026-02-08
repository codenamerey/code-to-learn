export const documentationData = [
  {
    "className": "RSAHelper",
    "description": "A static utility class providing mathematical functions essential for RSA encryption, such as modular exponentiation, GCD, and Euler's Totient function.",
    "usage": "const result = RSAHelper.power(2n, 10n, 5n);\nconst phiN = RSAHelper.phi(11n, 13n);\nconst gcdVal = RSAHelper.gcd(10n, 15n);",
    "methods": [
      {
        "method": "static power(base, exp, mod)",
        "description": "Calculates (base^exp) % mod using modular exponentiation. All arguments and return values are BigInts.",
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
    "usage": "const converter = new MessageConverter('Hello');\nconst numRep = converter.getNumericalRepresentation();\n// To convert back:\nconst originalMessageConverter = MessageConverter.fromNumber(numRep);\nconst originalMessage = originalMessageConverter.getMessage();",
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
  }
];
