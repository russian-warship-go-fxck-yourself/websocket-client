const { config } = require("./config");

function* cycleGenerator() {
  let i = 0;
  while (i < config.cyclesCount) {
    yield i++;
  }
}

function* infiniteGenerator(initial) {
  yield initial++;
}

module.exports = {
  cycleGenerator,
  infiniteGenerator,
};
