// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
var dot = require("./lib/dot");
var $ = require("./lib/qsa");
var tooltipTemplate = dot.compile(require("./_tooltip.html"));

var predictions = { "4.5": [], "8.5": [] };

window.climateData.forEach(function(row) {
  predictions[row.emissions].push(row);
})
console.log(predictions);

var emissionsSelect = $.one("select.emissions");
var periodSelect = $.one("select.period");

var svg = $.one("svg");

var paint = function() {
  var bucket = predictions[emissionsSelect.value];
  var period = periodSelect.value;
  bucket.forEach(function(row) {
    if (row.period != period) return;
    var element = $.one(`#${row.county.replace(" ", "_")}`);
    if (!element) return console.log(`Couldn't find ${row.county}`);
    element.setAttribute("class", row.p50 < 10 ? "lowest" : row.p50 < 30 ? "low" : row.p50 < 50 ? "medium" : "high");
  })
};

var tooltipContainer = $.one(".tooltipContainer");

// for (var p in predictions) {
//   var county = predictions[p];
//   tooltipContainer.innerHTML = tooltipTemplate({county});
// }

emissionsSelect.addEventListener("change", paint);
periodSelect.addEventListener("change", paint);
paint();

var onClick = function(e) {
  e.stopPropagation();
  var id = this.id;
  var emission = emissionsSelect.value;
  var bucket = predictions[emission];
  var matching = bucket.filter(r => r.county == id);
  var html = tooltipTemplate({ county: id, rows: matching });
  tooltipContainer.innerHTML = html;
};

$("[id]", svg).forEach(el => el.addEventListener("click", onClick));
