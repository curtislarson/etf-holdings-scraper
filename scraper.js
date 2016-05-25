var rp = require("request-promise");

function parseHoldingsHtml(stock, html) {
  var startIndex = html.indexOf('Navigation Expander');
  var endIndex = html.indexOf("</tbody></table>");
  var captureRegex = new RegExp("ticker='(.*)'><a.*<td class='col-undefined'>(.*)</td><td class='col-undefined'>(.*)</td><td class='col-undefined'>(.*)</td>");
  html = html.substring(startIndex, endIndex);
  var holdings = [];
  var holdingIndex = 0;
  while (holdingIndex !== -1) {
    holdingIndex = html.indexOf("<div class='symbol-container'", holdingIndex + 1);
    var endHoldingIndex = html.indexOf("<td class='col-symbol'", holdingIndex);
    var holdingHtml = html.substring(holdingIndex, endHoldingIndex);
    var matches = holdingHtml.match(captureRegex);
    if (matches) {
      holdings.push({
        ticker: matches[1],
        company: matches[2],
        type: matches[3],
        weight: matches[4].replace("%", ""),
      });
    }
  }
  return holdings;
}

function getHoldings(stock) {
  var url = "http://research2.fidelity.com/fidelity/screeners/etf/public/etfholdings.asp?symbol=" + stock + "&view=Holdings"
  return rp({
    method: "get",
    url: url,
  }).then(function(html) {
    return parseHoldingsHtml(stock, html);
  }).then(function(holdings) {
    return Promise.resolve({
      stock: stock,
      holdings: holdings,
    });
  });
}

module.exports = {
  getHoldings: getHoldings,
  parseHoldingsHtml: parseHoldingsHtml,
};
