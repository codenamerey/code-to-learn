export const lesson = `# DNA Sequencing: Sanger Method

<iframe width="560" height="315" src="https://www.youtube.com/embed/6Udqou3vmng?start=25&end=1304" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Learning Objectives
- Understand the basic chemical principles behind Sanger sequencing.
- Identify the key components and steps involved in a Sanger sequencing reaction.
- Explain how dideoxynucleotides (ddNTPs) terminate DNA synthesis.
- Describe how sequencing gels are read to determine a DNA sequence.

## The Sanger (Chain-Termination) Method
Sanger sequencing, also known as the chain-termination method, was developed by Fred Sanger and his colleagues in 1977. It was the predominant method for DNA sequencing for many years and was instrumental in early genome projects, including the Human Genome Project. The method relies on the use of dideoxynucleotides (ddNTPs), which lack a 3'-hydroxyl group, preventing further elongation of the DNA strand once incorporated.

### Key Components:
1.  **DNA Template**: The single-stranded DNA molecule whose sequence is to be determined.
2.  **Primer**: A short, single-stranded DNA molecule (oligonucleotide) that is complementary to a known region of the template DNA. It provides a starting point for DNA polymerase.
3.  **DNA Polymerase**: An enzyme that synthesizes new DNA strands by adding nucleotides complementary to the template.
4.  **Deoxynucleotides (dNTPs)**: The four standard DNA building blocks (dATP, dCTP, dGTP, dTTP).
5.  **Dideoxynucleotides (ddNTPs)**: Modified nucleotides (ddATP, ddCTP, ddGTP, ddTTP) that lack a 3'-OH group. When a ddNTP is incorporated into a growing DNA strand, synthesis terminates because no phosphodiester bond can be formed with the next incoming nucleotide.

### Steps of Sanger Sequencing:
1.  **Reaction Setup**: Four separate reaction tubes are prepared, each containing:
    -   DNA template
    -   Primer
    -   DNA polymerase
    -   All four dNTPs (in excess)
    -   One type of ddNTP (e.g., ddATP in tube 1, ddCTP in tube 2, etc.) in a much lower concentration than the dNTPs.
2.  **DNA Synthesis**: During the reaction, DNA polymerase extends the primer, incorporating dNTPs until a ddNTP is randomly incorporated. When a ddNTP is incorporated, the chain terminates. This results in a series of DNA fragments of varying lengths, each ending with a specific ddNTP.
3.  **Separation by Size**: The DNA fragments from each reaction are then separated by size using gel electrophoresis. Traditionally, this involved running the contents of each of the four tubes in separate lanes on a polyacrylamide gel. The smallest fragments migrate fastest and appear at the bottom of the gel.
4.  **Sequence Readout**: The sequence is read by identifying the terminal ddNTP of each fragment. By reading the bands from bottom to top across the four lanes, the sequence of the newly synthesized strand (and thus the complementary template strand) can be determined.

### Modern Sanger Sequencing (Capillary Electrophoresis):
To increase efficiency, modern Sanger sequencing often uses fluorescently labeled ddNTPs (each ddNTP type has a different color). All four ddNTPs are added to a single reaction tube. The resulting fragments are then separated by capillary electrophoresis, and a laser detects the color of the fluorescent tag at the end of each fragment as it passes through a detector. This allows for automated, single-lane sequencing.

## Your Challenge
Implement a function that simulates reading a Sanger sequencing gel. Given an array of DNA fragment lengths (representing bands on a gel) and the corresponding terminal base for each fragment, reconstruct the sequence of the *synthesized* DNA strand. Assume the fragments are already sorted by length (shortest first).`;
