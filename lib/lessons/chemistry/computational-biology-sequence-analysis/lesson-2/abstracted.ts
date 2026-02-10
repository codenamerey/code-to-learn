export const abstractedCode = `class Read {
  constructor(id, sequence, qualityScores) {
    if (typeof id !== 'number' || id < 1) {
      throw new Error('Read ID must be a positive number.');
    }
    if (typeof sequence !== 'string' || !/^[ACGT]+$/.test(sequence)) {
      throw new Error('Read sequence must be a string containing only A, C, G, T.');
    }
    if (!Array.isArray(qualityScores) || qualityScores.some(q => typeof q !== 'number' || q < 0)) {
      throw new Error('Quality scores must be an array of non-negative numbers.');
    }
    if (sequence.length !== qualityScores.length) {
      throw new Error('Sequence length and quality scores length must match.');
    }

    this.id = id;
    this.sequence = sequence;
    this.qualityScores = qualityScores;
  }

  getId() {
    return this.id;
  }

  getSequence() {
    return this.sequence;
  }

  getQualityScores() {
    return this.qualityScores;
  }

  getAverageQuality() {
    if (this.qualityScores.length === 0) return 0;
    const sum = this.qualityScores.reduce((acc, score) => acc + score, 0);
    return sum / this.qualityScores.length;
  }

  toString() {
    return 'Read ' + this.id + ' (Seq: ' + this.sequence + ', Avg Qual: ' + this.getAverageQuality().toFixed(2) + ')';
  }
}`;
