function parseArgs(argv) {
  const args = {};

  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function requireArgs(args, names, usage) {
  const missing = names.filter((name) => !args[name]);
  if (!missing.length) return;

  console.error(`Parametri mancanti: ${missing.map((name) => `--${name}`).join(", ")}`);
  console.error(usage);
  process.exit(1);
}

module.exports = {
  parseArgs,
  requireArgs
};
