export const abstractedCode = `class ScoringMatrix {
  constructor(matchScore, mismatchScore, baseFrequencies) {
    if (typeof matchScore !== 'number' || typeof mismatchScore !== 'number') {
      throw new Error('Match and mismatch scores must be numbers.');
    }
    if (typeof baseFrequencies !== 'object' || Object.keys(baseFrequencies).length === 0) {
      throw new Error('Base frequencies must be a non-empty object.');
    }
    const sumFreq = Object.values(baseFrequencies).reduce((sum, freq) => sum + freq, 0);
    if (Math.abs(sumFreq - 1) > 1e-9) {
      throw new Error('Base frequencies must sum to 1.');
    }

    this.matchScore = matchScore;
    this.mismatchScore = mismatchScore;
    this.baseFrequencies = baseFrequencies;
    this.bases = Object.keys(baseFrequencies).sort(); // Ensure consistent order
  }

  getScore(base1, base2) {
    return (base1 === base2) ? this.matchScore : this.mismatchScore;
  }

  getBaseFrequency(base) {
    return this.baseFrequencies[base];
  }

  getBases() {
    return [...this.bases];
  }

  toString() {
    return 'Scoring Matrix (Match: ' + this.matchScore + ', Mismatch: ' + this.mismatchScore + ')';
  }
}`;
