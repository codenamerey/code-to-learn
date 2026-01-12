import { MoleculeData } from "../page";

export function Output({
  output,
  moleculeData,
}: {
  output: string | null;
  moleculeData: MoleculeData | null;
}) {
  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-sm">Results</h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {output ? (
            <div className="h-full overflow-y-auto">
              {/* Success/Error Status */}
              <div
                className={`px-4 py-2 text-sm font-medium border-b ${
                  output.includes("✅")
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                {output.includes("✅") ? "✅ Accepted" : "❌ Runtime Error"}
              </div>

              {/* Console Output Section */}
              {output.includes("=== CONSOLE OUTPUT ===") && (
                <div className="border-b border-gray-200">
                  <div className="bg-gray-50 px-4 py-1 text-xs font-medium text-gray-700 border-b border-gray-100">
                    Console
                  </div>
                  <div className="p-4">
                    <div className="bg-black text-green-400 p-3 rounded font-mono text-xs">
                      {output
                        .split("=== CONSOLE OUTPUT ===")[1]
                        ?.split("=== UNIT TESTS ===")[0]
                        ?.trim()
                        .split("\n")
                        .map((line, i) => (
                          <div key={i}>{line.replace(/^> /, "")}</div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Test Results Section */}
              {output.includes("=== UNIT TESTS ===") && (
                <div className="border-b border-gray-200">
                  <div className="bg-gray-50 px-4 py-1 text-xs font-medium text-gray-700 border-b border-gray-100">
                    Test Results
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {output
                        .split("=== UNIT TESTS ===")[1]
                        ?.split("\n")
                        .filter((line) => line.trim())
                        .map((line, i) => {
                          if (line.startsWith("Score:")) {
                            return (
                              <div key={i} className="font-bold text-lg mb-3">
                                {line}
                              </div>
                            );
                          }
                          if (line.includes("✅") || line.includes("❌")) {
                            const [status, ...rest] = line.split(": ");
                            return (
                              <div
                                key={i}
                                className="flex items-start gap-2 py-1"
                              >
                                <span
                                  className={`text-sm ${
                                    line.includes("✅")
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {status}
                                </span>
                                <span className="text-sm text-gray-700 flex-1">
                                  {rest.join(": ")}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* Execution Info */}
              {moleculeData && (
                <div>
                  <div className="bg-gray-50 px-4 py-1 text-xs font-medium text-gray-700 border-b border-gray-100">
                    Execution Info
                  </div>
                  <div className="p-4">
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        Central Atom:{" "}
                        <span className="font-mono text-red-600">
                          {moleculeData.central_atom.name}
                        </span>
                      </div>
                      <div>
                        Total Atoms:{" "}
                        <span className="font-mono">
                          {moleculeData.atoms.length}
                        </span>
                      </div>
                      <div>
                        Total Valence Electrons:{" "}
                        <span className="font-mono">
                          {moleculeData.atoms.reduce(
                            (sum, atom) => sum + atom.valence,
                            0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">🚀</div>
                <div className="text-sm">
                  Click "Run Algorithm" to see results
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
