export const documentationData = [
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
