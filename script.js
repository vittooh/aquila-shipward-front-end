// Set the dimensions of the map
const width = 960;
const height = 600;

// Create an SVG element
const svg = d3.select(".map")
    .attr("width", width)
    .attr("height", height);

// Define a projection
const projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 1.5]);

// Define a path generator
const path = d3.geoPath().projection(projection);

// Define zoom behavior
const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

// Create a group to hold map elements
const g = svg.append("g");

// Load and display the world map 
function build(response){
    console.log(response)

    d3.json("https://d3js.org/world-110m.v1.json").then(world => {
    const countries = topojson.feature(world, world.objects.countries).features;
    
    g.selectAll(".country")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path);

    // Define your locations
    const locations = [
        { name: "New York", coordinates: [-74.006, 40.7128] },
        { name: "London", coordinates: [-0.1276, 51.5074] },
        { name: "Tokyo", coordinates: [139.6917, 35.6895] }
    ];

    // Add circles for each location
    g.selectAll(".pin")
        .data(response)
        .enter().append("circle", ".pin")
        .attr("r", 5)
        .attr("transform", d => `translate(${projection(d.coordinates)})`)
        .attr("class", "pin")
        .append("title")
        .text(d => d.name);
});
}

// Apply zoom behavior to the SVG
svg.call(zoom);

function zoomed(event) {
    g.attr("transform", event.transform);
}
