export const lesson = `# Next-Generation Sequencing (NGS) Overview

<iframe width="560" height="315" src="https://www.youtube.com/embed/6Udqou3vmng?start=1342&end=3107" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learning Objectives
- Understand the fundamental differences between Sanger sequencing and NGS.
- Identify the core principle of 'massively parallel sequencing'.
- Describe the general steps involved in common NGS platforms (e.g., Illumina).
- Recognize the advantages and disadvantages of NGS compared to Sanger sequencing.

## The Rise of Next-Generation Sequencing
While Sanger sequencing was revolutionary, its limitations in throughput and cost per base became apparent as researchers aimed to sequence entire genomes and perform large-scale genomic studies. This led to the development of Next-Generation Sequencing (NGS) technologies, which enabled 'massively parallel sequencing' – the ability to sequence millions to billions of DNA fragments simultaneously.

### Fundamental Differences from Sanger:
1.  **Massive Parallelism**: Instead of sequencing one DNA fragment at a time, NGS platforms sequence millions to billions of fragments in parallel.
2.  **Shorter Reads**: NGS typically produces shorter read lengths (tens to hundreds of bases) compared to Sanger (hundreds to ~1000 bases).
3.  **Cost-Effectiveness**: The cost per base of NGS is orders of magnitude lower than Sanger sequencing, making large-scale projects feasible.
4.  **Data Volume**: NGS generates vastly more data (gigabases to terabases) per run.

### General Steps in NGS (e.g., Illumina Sequencing by Synthesis):
Most NGS platforms follow a general workflow, though specific chemistries and methods vary:

1.  **Library Preparation**: 
    -   DNA (or RNA, converted to cDNA) is fragmented into smaller pieces.
    -   Adapter sequences are ligated to both ends of the fragments. These adapters are crucial for binding to the sequencing platform and for primer annealing.
    -   (Optional) Barcodes can be added to adapters to multiplex multiple samples in a single run.

2.  **Cluster Generation/Amplification**: 
    -   The prepared library fragments are loaded onto a solid surface (e.g., a flow cell for Illumina, beads for 454/Roche).
    -   Fragments bind to complementary adapter sequences on the surface.
    -   Local amplification (e.g., bridge amplification for Illumina, emulsion PCR for 454) creates millions of identical copies of each fragment, forming 'clusters' or 'colonies'. This amplification is necessary to generate a strong enough signal for detection.

3.  **Sequencing by Synthesis**: 
    -   A sequencing primer anneals to the adapter.
    -   DNA polymerase and modified, fluorescently labeled nucleotides are added. These nucleotides often have a reversible terminator group and a unique fluorescent tag for each base (A, C, G, T).
    -   In each cycle, only one nucleotide is incorporated per growing strand in each cluster due to the reversible terminator.
    -   After incorporation, the flow cell is imaged to detect the fluorescent signal from each cluster, identifying the incorporated base.
    -   The fluorescent tag and terminator are chemically cleaved, allowing the next cycle of synthesis to occur.
    -   This process is repeated for many cycles, building up the sequence one base at a time.

4.  **Data Analysis**: 
    -   The raw image data is processed to generate base calls (identifying the sequence of each read).
    -   These 'reads' are then typically aligned to a reference genome or assembled *de novo* to reconstruct the original genomic sequence.

### Advantages of NGS:
-   **High Throughput**: Billions of bases per run.
-   **Low Cost per Base**: Enables large-scale studies.
-   **Versatility**: Applicable to various applications (whole-genome sequencing, RNA-seq, ChIP-seq, metagenomics, etc.).

### Disadvantages of NGS:
-   **Shorter Read Lengths**: Can make *de novo* assembly challenging and lead to issues with repetitive regions.
-   **Higher Error Rates (per base)**: Though overall accuracy is high due to high coverage, individual base calls can be less accurate than Sanger. Error types vary by platform (e.g., substitutions for Illumina, indels for 454).
-   **Computational Intensity**: Requires significant computational resources for data storage and analysis.

## Your Challenge
Simulate the initial step of NGS data processing: converting raw base call data (e.g., from an Illumina run) into \`Read\` objects. Each \`Read\` object will represent a short sequence of DNA obtained from a single cluster. You'll also need to identify and filter out low-quality reads based on a simple quality score threshold.`;
