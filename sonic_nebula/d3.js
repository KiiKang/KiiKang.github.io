// get window size
var plotDiv = document.getElementById("plot");
var windowWidth = plotDiv.clientWidth;
var windowHeight = plotDiv.clientHeight;

// set the dimensions and margins of the graph
const margin = {top: 60, right: 100, bottom: 60, left: 240},
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
    let dot_bg = svg.append('g')
        .selectAll("dot")
        .data(dataFiltered.pts)
        .enter()
        .append("circle")
        .attr("class", "dot_bg")
        .attr("cx", d => {
            return parseInt(x(d.x));
        })
        .attr("cy", d => {
            return parseInt(y(d.y));
        })
        .attr("r", d => {
            return 10+4*r(d.endTime - d.startTime);
        })
    let dot = svg.append('g')
        .selectAll("dot_bg")
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
            return r(d.endTime - d.startTime);
        })
        .attr("fill", 'white')
        .attr("opacity", 0.5)
        .attr("stroke", 'white')
        .attr("stroke-width", 0.5);

    // A function that update the chart

    function update(selectedMethod) {
        console.log("selected method =", selectedMethod)
        let dataFiltered_ = data.filter( d => {return d.mapMethod === selectedMethod})[0]
        console.log(dataFiltered_)

        // Update scale
        x = d3.scaleLinear()
            .domain(d3.extent(
                function(d) { var res = [];
                    d.forEach(function(xy){
                        res = res.concat(xy.x);
                    });
                    return(res);
                }(dataFiltered_.pts)))
            .range([0, width]);
        // Add Y axis
        y = d3.scaleLinear()
            .domain(d3.extent(
                function(d) { var res = [];
                    d.forEach(function(xy){
                        res = res.concat(xy.y);
                    });
                    return(res);
                }(dataFiltered_.pts)))
            .range([0, height]);

        // Give these new data to update line
        line
            .datum(dataFiltered_.pts)
            .transition()
            .duration(1500)
            .attr("d", d3.line()
                .x( d => { return x(d.x); })
                .y( d => { return y(d.y); })
            )
        dot
            .data(dataFiltered_.pts)
            .transition()
            .duration(1500)
            .attr("cx", d => { return x(d.x); })
            .attr("cy", d => { return y(d.y); })

        dot_bg
            .data(dataFiltered_.pts)
            .transition()
            .duration(1500)
            .attr("cx", d => { return x(d.x); })
            .attr("cy", d => { return y(d.y); })

    }

    d3.select("#methodDropDown").on("change", function() {
        var newSelected = d3.select(this).property("value")
        update(newSelected)
    })

};

fetch(jsonRequest)
    .then(response => response.json())
    .then(data => {
        ConnectedScatterPlot(data, "pca");
    })
    .catch(console.error);
