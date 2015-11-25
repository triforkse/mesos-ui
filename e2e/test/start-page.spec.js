import Nightmare from 'nightmare';
require('mocha-generators').install();

// Get rid of a warning.
process.setMaxListeners(0);

// Utils
const innerHTML = (selector) => document.querySelector(selector).innerHTML;
const innerText = (selector) => innerHTML(selector).trim();

describe('Start Page', function() {
  this.timeout(15000);

  const hostname = process.env.CLIENT_ADDR || 'localhost';
  const base = "http://" + hostname + ":3001";

  let nightmare;

  beforeEach(function() {
    nightmare = Nightmare();
  });

  afterEach(function * () {
    yield nightmare.end();
  });

  it("should have a title", function * () {
    const title = yield nightmare.goto(base).title();
    expect(title).to.equal('Mesos UI');
  });
});
