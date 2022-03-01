const { config } = require("./config");

function* cycles() {
  let i = 0;
  while (i < config.cyclesCount) {
    yield i++;
  }
}

function* infiniteCrawler() {
  let index = 0;

  while (true) {
    yield index++;
  }
}

module.exports = {
  cycles,
  infiniteCrawler,
};
