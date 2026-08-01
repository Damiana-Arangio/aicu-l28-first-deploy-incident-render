const major = Number.parseInt(process.versions.node.split(".")[0], 10);

if (!Number.isInteger(major) || major < 24 || major >= 27) {
  console.error(
    `Node runtime non compatibile: ${process.version}. Il progetto richiede Node >=24 <27.`,
  );
  process.exit(1);
}

console.log(`Node runtime compatibile: ${process.version}.`);
