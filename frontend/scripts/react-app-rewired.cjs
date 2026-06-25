const { spawnSync } = require("child_process");

const command = process.argv[2] || "start";
const memoryFlag = "--max_old_space_size=4096";
const opensslFlag = "--openssl-legacy-provider";
const existingNodeOptions = process.env.NODE_OPTIONS || "";
const nodeOptions = [existingNodeOptions, opensslFlag, memoryFlag]
  .filter(Boolean)
  .join(" ");

const result = spawnSync(`react-app-rewired ${command}`, {
  env: {
    ...process.env,
    CI: "false",
    NODE_OPTIONS: nodeOptions,
  },
  shell: true,
  stdio: "inherit",
});

process.exit(result.status || 0);
