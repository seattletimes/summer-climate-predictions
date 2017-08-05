// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var dot = require("./lib/dot");
var $ = require("./lib/qsa");
var tooltipTemplate = dot.compile(require("./_tooltip.html"));
var tooltipTemplateCurrent = dot.compile(require("./_tooltip2.html"));

var predictions = { "4.5": [], "8.5": [] };

window.climateData.forEach(function(row) {
  predictions[row.emissions].push(row);
})
console.log(predictions);

var emissionsSelect = $.one("select.emissions");
var periodSelect = $.one("select.period");

var svg = $.one("svg");

var lastClicked = null;

var getValues = function() {
  var emissions = $.one(`input[name="emissions"]:checked`).id;
  var period = $.one(`input[name="period"]:checked`).id;
  return { emissions, period };
}

var paint = function() {
  var { emissions, period } = getValues();
  console.log(emissions, period);
  var bucket = predictions[emissions];
  bucket.forEach(function(row) {
    if (row.period != period) return;
    var element = $.one(`#${row.county.replace(" ", "_")}`);
    if (!element) return console.log(`Couldn't find ${row.county}`);
    element.setAttribute("class", row.p50 < 10.1 ? "lowest" : row.p50 < 30.1 ? "low" : row.p50 < 50.1 ? "medium" : "high");
  });
  if (lastClicked) setTooltip(lastClicked);
};

var table = $.one(".table");

$.one(".nav").addEventListener("change", paint);
paint();

var setTooltip = function(id) {
  var { emissions, period } = getValues();
  var bucket = predictions[emissions];
  var matching = bucket.filter(r => r.county.replace(" ", "_") == id);
  var html = tooltipTemplate({ county: id, emissionValue: emissions, rows: matching, period });
  table.innerHTML = html;
  lastClicked = id;
}

var onClick = function(e) {
  e.stopPropagation();
  var id = this.id;
  setTooltip(id);
  console.log(matching);
  // console.log(year);
};

$("[id]", svg).forEach(el => el.addEventListener("click", onClick));
