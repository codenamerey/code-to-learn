export const abstractedCode = `class DNAFragment {
  constructor(id, length, terminalBase) {
    this.id = id;
    this.length = length;
    this.terminalBase = terminalBase;
  }

  getLength() {
    return this.length;
  }

  getTerminalBase() {
    return this.terminalBase;
  }

  toString() {
    return 'Fragment ' + this.id + ' (Length: ' + this.length + ', Terminal Base: ' + this.terminalBase + ')';
  }
}

function visualizeSequence(sequence) {
  if (typeof sequence !== 'string') {
    return { elements: [] };
  }
  
  return {
    elements: sequence.split('').map((base, index) => ({
      value: base,
      index: index,
      state: 'default',
      type: base
    })),
    metadata: {
      length: sequence.length,
      title: 'Reconstructed DNA Sequence'
    }
  };
}`;
