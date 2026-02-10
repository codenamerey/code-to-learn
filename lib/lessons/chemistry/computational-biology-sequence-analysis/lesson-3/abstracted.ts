export const abstractedCode = `class AlignmentResult {
  constructor(score, queryStart, subjectStart, length) {
    this.score = score;
    this.queryStart = queryStart;
    this.subjectStart = subjectStart;
    this.length = length;
  }

  getScore() {
    return this.score;
  }

  getQueryStart() {
    return this.queryStart;
  }

  getSubjectStart() {
    return this.subjectStart;
  }

  getLength() {
    return this.length;
  }

  toString() {
    if (this.score === 0 && this.length === 0) {
      return 'No significant ungapped local alignment found.';
    }
    return 'Score: ' + this.score + 
           ', Query Start: ' + this.queryStart + 
           ', Subject Start: ' + this.subjectStart + 
           ', Length: ' + this.length;
  }
}`;
