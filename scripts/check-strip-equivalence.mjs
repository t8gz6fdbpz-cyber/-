import fs from "node:fs";
import assert from "node:assert/strict";

/** Permit only the audited debug guards; keep every renderer/input/motion line locked. */
export function checkStripEquivalence(baselinePath, currentPath) {
  const normalize = source => source.replace(/\r/g, "")
    .replace(/  \/\/ Detailed frame snapshots are for local acceptance only, never production\.\n  const diagnostics = import\.meta\.env\.DEV;\n/, "")
    .replace(/    if \(!diagnostics\) return;\n/g, "")
    .replace("    // No per-frame JSON projection or DOM writes in the shipped renderer.",
      "    // Read-only DOM diagnostics used by browser acceptance. No mutation hooks.");
  assert.equal(normalize(fs.readFileSync(currentPath, "utf8")),
    normalize(fs.readFileSync(baselinePath, "utf8")), "Only production debug guards may differ from the approved strip renderer");
}

if (process.argv[2] && process.argv[3]) {
  checkStripEquivalence(process.argv[2], process.argv[3]);
  console.log("PASS: approved renderer, curvature, textures, input and autoplay logic unchanged; production diagnostics only.");
}
