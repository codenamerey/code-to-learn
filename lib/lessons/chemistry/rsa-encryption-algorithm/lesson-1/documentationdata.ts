export const documentationData = [
  {
    className: "RSAKey",
    description:
      "Represents an RSA key pair with public and private components",
    usage:
      "const key = new RSAKey(p, q, n, phi);\nkey.setPublicExponent(e);\nkey.setPrivateExponent(d);",
    methods: [
      {
        method: "setPublicExponent(e)",
        description: "Sets the public exponent e for the key",
        returnType: "void",
      },
      {
        method: "setPrivateExponent(d)",
        description: "Sets the private exponent d for the key",
        returnType: "void",
      },
      {
        method: "getPublicKey()",
        description: "Returns the public key as an object with n and e",
        returnType: "{ n: number, e: number }",
      },
      {
        method: "getPrivateKey()",
        description: "Returns the private key as an object with n and d",
        returnType: "{ n: number, d: number }",
      },
    ],
    properties: [
      {
        type: "Read-Only",
        property: "p",
        dataType: "number",
        description: "First prime number",
      },
      {
        type: "Read-Only",
        property: "q",
        dataType: "number",
        description: "Second prime number",
      },
      {
        type: "Read-Only",
        property: "n",
        dataType: "number",
        description: "Modulus (p × q)",
      },
      {
        type: "Read-Only",
        property: "phi",
        dataType: "number",
        description: "Euler's totient φ(n) = (p-1)(q-1)",
      },
      {
        type: "Read/Write",
        property: "e",
        dataType: "number",
        description: "Public exponent",
      },
      {
        type: "Read/Write",
        property: "d",
        dataType: "number",
        description: "Private exponent",
      },
      {
        type: "Read-Only",
        property: "modulus",
        dataType: "number",
        description: "Getter for n (modulus)",
      },
      {
        type: "Read-Only",
        property: "totient",
        dataType: "number",
        description: "Getter for φ(n)",
      },
    ],
  },
];
