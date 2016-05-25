var argv = require("minimist")(process.argv.slice(2));
var scraper = require("./scraper");

if (argv.s) {
  scraper.getHoldings(argv.s).then(function(holdings) {
    console.log(holdings);
  });
}
