const { io } = require("socket.io-client");
const { Crawler } = require("./crawler");
const { infiniteGenerator } = require("./helpers");

const socket = io(`http://localhost:3000/client`);

/**
 * Launch incognito session
 * Open current target url
 * Navigate on the page
 * Close session
 * Repeat until new target received
 * */
socket.on("targets", async (targets) => {
  const currentTarget = targets.currentTargets[0];
  const crawler = new Crawler(currentTarget);

  try {
    for await (const i of infiniteGenerator()) {
      await crawler.run();
    }
  } catch (e) {
    // pm2 will restart
    process.exit();
  }
});
