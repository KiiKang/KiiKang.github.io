// get window size
var plotDiv = document.getElementById("plot");
var windowWidth = plotDiv.clientWidth;
var windowHeight = plotDiv.clientHeight;

// set the dimensions and margins of the graph
const margin = {top: 60, right: windowWidth * .1, bottom: 60, left: windowWidth * .1},
    width = windowWidth - margin.left - margin.right,
    height = windowHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

let jsonRequest = new Request('./json/hfc_.json');

// node js
// const fs = Require('fs');

const oscPort = new osc.WebSocketPort({
    url: "ws://localhost:8081", // URL to your Web Socket server.
});
oscPort.open()

var sendOSC = (message) => {
    oscPort.send({
        address: "/pts",
        args: [ { type: "s", value: message } ]
    });
}

function ConnectedScatterPlot(data, mapMethod) {
    var dataFiltered = data.filter( d => {return d.mapMethod === mapMethod})[0]
    console.log(dataFiltered);

    // add the options to the button
    var mapMethods = ["pca", "tsne", "umap"];
    var mapMethods_disp = ["PCA", "t-SNE", "UMAP"];

    d3.select("#methodDropDown")
        .selectAll('myOptions')
            .data(mapMethods)
        .enter()
            .append('option')
        .text( (d, i) => { return mapMethods_disp[i]; })
        .attr("value", d => { return d; })

    // X scale
    let x = d3.scaleLinear()
        .domain(d3.extent(
            function(d) { var res = [];
                d.forEach(function(xy){
                    res = res.concat(xy.x);
                });
                return(res);
            }(dataFiltered.pts)))
        .range([0, width]);

    // Y scale
    let y = d3.scaleLinear()
        .domain(d3.extent(
            function(d) { var res = [];
                d.forEach(function(xy){
                    res = res.concat(xy.y);
                });
                return(res);
            }(dataFiltered.pts)))
        .range([0, height]);

    // r scale
    let r = d3.scaleLinear()
        .domain([0, 1500])
        .range([2, 17]);

    // Add paths
    let line = svg.append("path")
        .datum(dataFiltered.pts)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", 'white')
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.3)
        .attr("stroke-dasharray", "3,3")
        .attr("d", d3.line()
            .x(d => { return x(d.x); })
            .y(d => { return y(d.y); })
        );

    // Add dots

    // let dot_bg = svg.append('g')
    //     .selectAll("dot")
    //     .data(dataFiltered.pts)
    //     .enter()
    //     .append("circle")
    //     .attr("class", "dot_bg")
    //     .attr("cx", d => {
    //         return parseInt(x(d.x));
    //     })
    //     .attr("cy", d => {
    //         return parseInt(y(d.y));
    //     })
    //     .attr("r", d => {
    //         return 10+4*r(d.endTime - d.startTime);
    //     })

    let dot = svg.append('g')
        .selectAll("dot")
        .data(dataFiltered.pts)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => {
            return parseInt(x(d.x));
        })
        .attr("cy", d => {
            return parseInt(y(d.y));
        })
        .attr("r", d => {
            return 5 + 4 * r(d.endTime - d.startTime);
        })
        .style("fill", 'white')
        .style("opacity", 0.5)
        // .attr("stroke", 'white')
        // .attr("stroke-width", 0.5)
        .on('mouseover', function(d) {
            console.log(d.id, d.startTime, d.endTime);
            sendOSC(String(d.id) + ' ' + String(d.startTime) + ' ' + String(d.endTime));
            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", 'red')
                .style("opacity", 1)
                .attr("r", d => {
                    // return 3 + r(d.endTime - d.startTime);
                    return 10 + 4 * r(d.endTime - d.startTime);
                })

                .transition()
                .delay( d.endTime - d.startTime)
                .duration(300)
                .style("fill", 'white')
                .style("opacity", 0.5)
                .attr("r", d => {
                    return 5 + 4 * r(d.endTime - d.startTime);
                })
        })

    // A function that update the chart
    function update(selectedMethod) {
        console.log("selected method =", selectedMethod)
        dataFiltered = data.filter( d => {return d.mapMethod === selectedMethod})[0]
        // Update scale
        x = d3.scaleLinear()
            .domain(d3.extent(
                function(d) { var res = [];
                    d.forEach(function(xy){
                        res = res.concat(xy.x);
                    });
                    return(res);
                }(dataFiltered.pts)))
            .range([0, width]);
        // Add Y axis
        y = d3.scaleLinear()
            .domain(d3.extent(
                function(d) { var res = [];
                    d.forEach(function(xy){
                        res = res.concat(xy.y);
                    });
                    return(res);
                }(dataFiltered.pts)))
            .range([0, height]);

        // Give these new data to update line
        line
            .datum(dataFiltered.pts)
            .transition()
            .duration(1500)
            .attr("d", d3.line()
                .x( d => { return x(d.x); })
                .y( d => { return y(d.y); })
            )
        dot
            .data(dataFiltered.pts)
            .transition()
            .duration(1500)
            .attr("cx", d => { return x(d.x); })
            .attr("cy", d => { return y(d.y); })

        // dot_bg
        //     .data(dataFiltered_.pts)
        //     .transition()
        //     .duration(1500)
        //     .attr("cx", d => { return x(d.x); })
        //     .attr("cy", d => { return y(d.y); })

        d3.selectAll('.dot_in').remove();
        d3.selectAll('.dot_sel').remove();
        d3.selectAll('.circle_range').remove();

    }

    d3.select("#methodDropDown").on("change", function() {
        var newSelected = d3.select(this).property("value")
        update(newSelected)
    })

    function addPt(x, y) {
        svg.append("circle")
            .attr('class', 'dot_in')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 5)
            .attr('fill', 'red')
            .exit();
    }

    function eucDist(ax, ay, bx, by) {
        return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
    }

    var range = 50;
    var increment = 20;
    var interval = 500; // in ms

    function spreadPts(ax, ay) {
        console.log(ax, ay);

        svg.append("circle")
            .attr("class", "circle_range")
            .attr("cx", ax)
            .attr("cy", ay)
            .attr("fill", 'none')
            .attr("stroke", 'white')
            .attr("r", range)
            .transition()
            .delay(interval)
            .duration(2*interval)
            .style("opacity", 0.05);

        svg.selectAll("dot")
            .data(dataFiltered.pts)
            .enter()
            .append("circle")
            .filter( function(d) {
                console.log(ax);
                return eucDist(ax, ay, x(d.x), y(d.y)) < range; })
            .attr("class", "dot_sel")
            .attr("cx", d => {
                return parseInt(x(d.x));
            })
            .attr("cy", d => {
                return parseInt(y(d.y));
            })
            .attr("r", d => {
                return r(d.endTime - d.startTime);
            })
            .style("fill", 'red')
            .each( function(d) {
                sendOSC(String(d.id) + ' ' + String(d.startTime) + ' ' + String(d.endTime));
            })
    }

    d3.select('#plot')
        .on('click', function() {
            var coords = d3.mouse(this);
            addPt(coords[0]-margin['left'], coords[1]-margin['top']);
            spreadPts(coords[0]-margin['left'], coords[1]-margin['top']);
        });

};

fetch(jsonRequest)
    .then(response => response.json())
    .then(data => {
        ConnectedScatterPlot(data, "pca");
    })
    .catch(console.error);
