export const defaultCode = `function processNGSReads(rawReads, qualityThreshold) {
  // rawReads is an array of objects like { sequence: 'ATGC', qualityScores: [30, 28, 32, 25] }
  // qualityThreshold is a number indicating the minimum average quality score for a read to be kept.

  // 1. Initialize an empty array to store valid Read objects.
  const validReads = [];

  // 2. Iterate through each raw read.
  for (let i = 0; i < rawReads.length; i++) {
    const rawRead = rawReads[i];

    // 3. Calculate the average quality score for the current raw read.
    let totalQuality = 0;
    for (let j = 0; j < rawRead.qualityScores.length; j++) {
      totalQuality += rawRead.qualityScores[j];
    }
    const averageQuality = totalQuality / rawRead.qualityScores.length;

    // 4. If the average quality score meets or exceeds the qualityThreshold,
    //    create a new Read object and add it to the validReads array.
    //    The Read constructor takes (id, sequence, qualityScores).
    if (averageQuality >= qualityThreshold) {
      validReads.push(new Read(i + 1, rawRead.sequence, rawRead.qualityScores));
    }
  }

  // 5. Return the array of valid Read objects.
  return validReads;
}`;
