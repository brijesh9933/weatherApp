const fs = require('fs');
const path = require('path');

function parseLcov(lcovPath) {
  const content = fs.readFileSync(lcovPath, 'utf8');

  // totals across all SF blocks
  let totalLines = 0;
  let totalCoveredLines = 0;
  let totalFunctions = 0;
  let totalCoveredFunctions = 0;

  // LCOV format: lines found like `LF:<num>` and `LH:<num>` inside each SF block
  // Functions found like `F:<num>` and `FNDA:<count>`
  // We'll aggregate line coverage and function coverage.

  const blocks = content.split('end_of_record');
  for (const block of blocks) {
    if (!block.trim()) continue;

    const lfMatch = block.match(/\nLF:(\d+)/);
    const lhMatch = block.match(/\nLH:(\d+)/);
    const fMatch = block.match(/\nF:(\d+)/);

    if (lfMatch) totalLines += parseInt(lfMatch[1], 10);
    if (lhMatch) totalCoveredLines += parseInt(lhMatch[1], 10);

    if (fMatch) {
      totalFunctions += parseInt(fMatch[1], 10);
      // Count covered functions from FNDA:
      // FNDA:<count>,<name>
      const covered = block
        .split('\n')
        .filter((l) => l.startsWith('FNDA:'))
        .reduce((acc, line) => {
          const m = line.match(/^FNDA:(\d+),/);
          if (!m) return acc;
          const count = parseInt(m[1], 10);
          return acc + (count > 0 ? 1 : 0);
        }, 0);
      totalCoveredFunctions += covered;
    }
  }

  // Some lcov writers may not include LH/FNDA in the way we expected.
  // Fallback: if function counts are missing, only line coverage is enforced.
  return {
    line: {
      total: totalLines,
      covered: totalCoveredLines
    },
    function: {
      total: totalFunctions,
      covered: totalCoveredFunctions
    }
  };
}

function pct(covered, total) {
  if (!total) return 100;
  return (covered / total) * 100;
}

function main() {
  const lcovPath = process.argv[2] || path.join(__dirname, '..', 'coverage', 'weather', 'lcov.info');
  const minCoverage = Number(process.env.MIN_COVERAGE || 70);

  if (!fs.existsSync(lcovPath)) {
    console.error(`ERROR: LCOV file not found at: ${lcovPath}`);
    process.exit(1);
  }

  const { line, function: fn } = parseLcov(lcovPath);

  const linePct = pct(line.covered, line.total);
  const fnPct = pct(fn.covered, fn.total);

  // Enforce line coverage. Also print function coverage if available.
  console.log('Coverage summary:');
  console.log(`- Line coverage: ${line.covered}/${line.total} => ${linePct.toFixed(2)}%`);

  if (fn.total > 0) {
    console.log(`- Function coverage: ${fn.covered}/${fn.total} => ${fnPct.toFixed(2)}%`);
  } else {
    console.log(`- Function coverage: n/a (no function data found)`);
  }

  if (linePct + 1e-9 < minCoverage) {
    console.error(`ERROR: Line coverage ${linePct.toFixed(2)}% is below threshold ${minCoverage}%`);
    process.exit(1);
  }

  console.log(`PASS: Line coverage >= ${minCoverage}%`);
}

main();

