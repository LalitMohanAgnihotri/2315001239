const Log = require("./logger");

async function run() {
  await Log(
    "backend",
    "info",
    "service",
    "Testing logging middleware"
  );
}

run();