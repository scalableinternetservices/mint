var width = 960,
    height = 500;

var color = d3.scale.threshold()
    .domain([2, 4, 6, 8, 10])
    .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

var getShadeColor = function(id) {
    if (id < 2)
	return '#f2f0f7';
    if (id < 4)
	return '#dadaeb';
    if (id < 6)
	return '#bcbddc';
    if (id < 8)
	return '#9e9ac8';
    if (id < 10)
	return '#54278f';

};

var path = d3.geo.path();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "http://localhost:8080/us.json")
    .defer(d3.tsv, "http://localhost:8080/unemployment.tsv")
    .await(ready);

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function ready(error, us, unemployment) {
  if (error) throw error;

  var rateById = {};

  unemployment.forEach(function(d) { rateById[d.id] = Math.random()*10;console.log(rateById[d.id]);});
    unemployment.forEach(function(d) {console.log(getShadeColor(rateById[d.id]));});

  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) { return getRandomColor();});//color(rateById[d.id]); });

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }))
      .attr("class", "states")
      .attr("d", path);
}
