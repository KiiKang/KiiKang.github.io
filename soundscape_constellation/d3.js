// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 800 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

let jsonRequest = new Request('./json/hfc.json');

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
            }(dataFiltered.coor)))
        .range([0, width]);
    // Y scale
    let y = d3.scaleLinear()
        .domain(d3.extent(
            function(d) { var res = [];
                d.forEach(function(xy){
                    res = res.concat(xy.y);
                });
                return(res);
            }(dataFiltered.coor)))
        .range([0, height]);
    // r scale
    // let r = d3.scaleLinear()
    //     .domain([0, 1000])
    //     .range([0, 10]);
    // Add paths
    let line = svg.append("path")
        .datum(dataFiltered.coor)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", 'black')
        .attr("opacity", 0.5)
        .attr("stroke-width", 0.5)
        .attr("d", d3.line()
            .x(d => { return x(d.x); })
            .y(d => { return y(d.y); })
        );
    // Add dots
    let dot = svg.append('g')
        .selectAll("dot")
        .data(dataFiltered.coor)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => {
            return parseInt(x(d.x));
        })
        .attr("cy", d => {
            return parseInt(y(d.y));
        })
        .attr("r", 5)
        .attr("fill", 'white')
        .attr("stroke", 'black')
        .attr("stroke-width", 2);

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
                }(dataFiltered_.coor)))
            .range([0, width]);
        // Add Y axis
        y = d3.scaleLinear()
            .domain(d3.extent(
                function(d) { var res = [];
                    d.forEach(function(xy){
                        res = res.concat(xy.y);
                    });
                    return(res);
                }(dataFiltered_.coor)))
            .range([0, height]);

        // Give these new data to update line
        line
            .datum(dataFiltered_.coor)
            .transition()
            .duration(1500)
            .attr("d", d3.line()
                .x( d => { return x(d.x); })
                .y( d => { return y(d.y); })
            )
        dot
            .data(dataFiltered_.coor)
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
