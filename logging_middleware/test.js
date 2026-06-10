const Log = require("./logger");

async function run() {
  try {
    const result = await Log(
      "backend",
      "info",
      "service",
      "Testing logging middleware"
    );

    console.log(result);
  } catch (err) {
    console.log("FULL ERROR:");
    console.log(JSON.stringify(err, null, 2));
  }
}

run();