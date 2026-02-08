export const abstractedCode = `class MessageConverter {
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
      if (numStr.length - i >= 3 && numStr.substring(i, i + 3) >= '100') { // Assume ASCII codes are 2 or 3 digits
        charCodeStr = numStr.substring(i, i + 3);
        i += 3;
      } else {
        charCodeStr = numStr.substring(i, i + 2);
        i += 2;
      }
      message += String.fromCharCode(parseInt(charCodeStr, 10));
    }
    return new MessageConverter(message);
  }
}
`;
