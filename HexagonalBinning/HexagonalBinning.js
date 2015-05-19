define(["jquery", "text!./HexagonalBinning.css","./d3.min","./hexbin"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 3,
					qHeight : 1000
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1,
					max: 1
				},
				measures : {
					uses : "measures",
					min : 2,
					max: 2
				},
				sorting : {
					uses : "sorting"
				},
				addons : {
					uses : "addons"
				},
				settings : {
					uses : "settings",
					items : {						
						 colors: {
								  ref: "ColorSchema",
								  type: "string",
								  component: "dropdown",
								  label: "Color",
								  options: 
									[ {
										value: "#ffffe5, #fff7bc, #fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #993404, #662506",
										label: "Sequencial"
									}, {
										value: "#662506, #993404, #cc4c02, #ec7014, #fe9929, #fec44f, #fee391, #fff7bc, #ffffe5",
										label: "Sequencial (Reverse)"
									}, {
										value: "#d73027, #f46d43, #fdae61, #fee090, #ffffbf, #e0f3f8, #abd9e9, #74add1, #4575b4",
										label: "Diverging RdYlBu"
									}, {
										value: "#4575b4, #74add1, #abd9e9, #e0f3f8, #ffffbf, #fee090, #fdae61, #f46d43, #d73027",
										label: "Diverging BuYlRd (Reverse)"
									}, {
										value: "#f7fbff, #deebf7, #c6dbef, #9ecae1, #6baed6, #4292c6, #2171b5, #08519c, #08306b",
										label: "Blues"
									}, {
										value: "#fff5f0, #fee0d2, #fcbba1, #fc9272, #fb6a4a, #ef3b2c, #cb181d, #a50f15, #67000d",
										label: "Reds"
									}, {
										value: "#ffffd9, #edf8b1, #c7e9b4, #7fcdbb, #41b6c4, #1d91c0, #225ea8, #253494, #081d58",
										label: "YlGnBu"
									}
									],
								  defaultValue: "#ffffe5, #fff7bc, #fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #993404, #662506"
							   },
						colorAxis:{
							ref: "colorAxis",
							type: "integer",
							component: "dropdown",
							label: "Color Expression",
							options: 
								[ {
									value: 0,
									label: "x-Axis"
								}, {
									value: 1,
									label: "y-Axis"
								}, {
									value: 2,
									label: "Hexabin Member Count"
								}
								],
							defaultValue: 0
						},							  
						hexbinRadius:{
							ref: "hexbinRadius",
							type: "integer",
							label: "Radius",
							defaultValue: 20,
							expression: "optional"
						},
						fillMesh: {
							ref: "fillMesh",
							type: "boolean",
							component: "switch",
							label: "Fill Mesh",
							options: [{
								value: true,
								label: "On"
							}, {
								value: false,
								label: "Off"
							}],
							defaultValue: false
						},				
						titleLayout:{
							ref: "titleLayout",
							type: "integer",
							component: "dropdown",
							label: "Title Layout",
							options: 
								[ {
									value: 0,
									label: "Hexabin Member Count"
								}, {
									value: 1,
									label: "Hexabin Member Details"
								}
								],
							defaultValue: 0
						},							  
						firstGroup: {
							label: "Static Layout",
							items: {
								useStaticLayout: {
									ref: "useStaticLayout",
									type: "boolean",
									component: "switch",
									label: "Use Static Layout",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: false
								},				
								minXAxis: {
									ref: "minXAxis",
									type: "integer",
									label: "min. Value x-Axis",
									defaultValue: 0,
									expression: "optional",
									show: function(layout) { return layout.useStaticLayout } 
								},				
								minYAxis: {
									ref: "minYAxis",
									type: "integer",
									label: "min. Value y-Axis",
									defaultValue: 0,
									expression: "optional",
									show: function(layout) { return layout.useStaticLayout } 
								},
								maxXAxis: {
									ref: "maxXAxis",
									type: "integer",
									label: "max. Value x-Axis",
									defaultValue: 250,
									expression: "optional",
									show: function(layout) { return layout.useStaticLayout } 
								},				
								maxYAxis: {
									ref: "maxYAxis",
									type: "integer",
									label: "max. Value y-Axis",
									defaultValue: 250,
									expression: "optional",
									show: function(layout) { return layout.useStaticLayout } 
								}
							}
						}	   
					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element,layout) {
		
			var self = this;
			
			// get qMatrix data array
			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			// create a new array that contains the measure labels
			var measureLabels = layout.qHyperCube.qMeasureInfo.map(function(d) {
				return d.qFallbackTitle;
			});
			// Create a new array for our extension with a row for each row in the qMatrix
			// Filter dimesnion Null value 
			var data = qMatrix.filter(function(d) { return d[0].qElemNumber >= 0; } ).map(function(d) {
				// for each element in the matrix, create a new object that has a property
				// for the grouping dimension, the first metric, and the second metric
				return {
					"Dim1":d[0].qText,
					"Dim1_key":d[0].qElemNumber,
					"Metric1":d[1].qNum,
					"Metric2":d[2].qNum
				}
			});

			var colorpalette = layout.ColorSchema.split(", "),
				colorAxis = layout.colorAxis,
				hexbinRadius = layout.hexbinRadius,
				fillMesh = layout.fillMesh,
				titleLayout = layout.titleLayout,
				useStaticLayout = layout.useStaticLayout,
				minXAxis = layout.minXAxis,
				minYAxis = layout.minYAxis,
				maxXAxis = layout.maxXAxis,
				maxYAxis = layout.maxYAxis;
			
			// Get the selected counts for the 2 dimensions, which will be used later for custom selection logic
			var selections = {
				dim1_count: layout.qHyperCube.qDimensionInfo[0].qStateCounts.qSelected,
			};
			 
			// Chart object width
			var width = $element.width();
			// Chart object height
			var height = $element.height();
			// Chart object id
			var id = "container_" + layout.qInfo.qId;
		    		 
			// Check to see if the chart element has already been created
			if (document.getElementById(id)) {
				// if it has been created, empty it's contents so we can redraw it
				$("#" + id).empty();
			}
			else {
				// if it hasn't been created, create it with the appropriate id and size
				//$element.append($('<div />').attr("id", id).width(width).height(height));
				$element.append($('<div />').attr({ "id": id, "class": ".qv-object-HexagonalBinning" }).css({ height: height, width: width }))
			}

			viz(self, data, measureLabels, width, height,id, selections, colorpalette, colorAxis, hexbinRadius, fillMesh, titleLayout, useStaticLayout, minXAxis, minYAxis, maxXAxis, maxYAxis);

		}
	};
});

var viz = function (self, data, labels, width, height, id, selections, colorpalette, colorAxis, hexbinRadius, fillMesh, titleLayout, useStaticLayout, minXAxis, minYAxis, maxXAxis, maxYAxis) {
	
	// Set up index and array to store points data for hexbin
	var index;
	var points = [];

	// Read in the data for each data point
	for (index = 0; index < data.length; ++index) {
		points.push([data[index].Metric1, data[index].Metric2, data[index].Dim1, data[index].Dim1_key]);
	}

	// Set the margins of the object
	var margin = {top: 20, right: 10, bottom: 50, left: 50},
		width = width - margin.left - margin.right,
		height = height - margin.top - margin.bottom;
	
	// Create the hexbin underlying grid
	// Set the radius to a set width of 20 pixels
	var hexbin = d3.hexbin()
		.size([width, height])
		// This solves the scaling problem
		.x(function(d) { return x(d[0]); })
		.y(function(d) { return y(d[1]); })
		.radius(hexbinRadius);
	
	if (useStaticLayout) {
		// Set the x-axis to min and max of Metric 1
		var x = d3.scale.linear()
			.domain([minXAxis, maxXAxis])
			.range([0, width]);
		
		// Set the y-axis to min and max of Metric 2	
		var y = d3.scale.linear()
			.domain([minYAxis, maxYAxis])
			.range([height, 0]); // swap y-Axis	
	} else {
		// Set the y-axis to min and max of Metric 2	
		var x = d3.scale.linear()
			.domain(d3.extent(data, function(d) { return d.Metric1; }))
			.range([0, width]);
		
		// Set the y-axis to min and max of Metric 2	
		var y = d3.scale.linear()
			.domain(d3.extent(data, function(d) { return d.Metric2; }))
			.range([height, 0]); // swap y-Axis
	}
	// Draw the x-axis
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickSize(6, -height);

	// Draw the y-axis	
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickSize(6, -width);

	// Create the svg element	
	var svg = d3.select("#"+id).append("svg:svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Create the mesh for the hexagons
	var mesh = svg.append("svg:defs").append("svg:clipPath")
		.attr("id", "clip")
		.append("svg:rect")
		.attr("class", "mesh")
		.attr("width", width)
		.attr("height", height);
	
	if (fillMesh) {
		// Fill mesh with hexagons
		svg.append("svg:path")
			.attr("clip-path", "url(" + document.location.href + "#clip)")
			.attr("d", hexbin.mesh())
			.style("stroke-width", .5)
			.style("stroke", "grey")
			.style("fill", "none");
	}
	
	var hexBin = hexbin(points);
	
	// Create the underlying mesh grid and the points within each hexagon
	var hexpoints = svg.append("g")
		.attr("clip-path", "url(" + document.location.href + "#clip)")  // fixes AngularJS problem because of: <base href="/">
		.selectAll(".hexagon")
		.data(hexBin);

	// Set the colour scale to mimic Sense Sequential Classes colour scheme
	// var color = d3.scale.linear()
		// .domain([0, 6])
		// .range(["#FEE391", "#993404"])
		// .interpolate(d3.interpolateLab);
	if (colorAxis == 2) {
		var colorScale = d3.scale.quantile()
						.domain([1, d3.max(hexBin, function (d) { return d.length; }) ])
						.range(colorpalette);		
	} else {
		if (useStaticLayout) {
			var colorScale = d3.scale.quantile()
				.domain([(colorAxis == 0 ? minXAxis : minYAxis ), (colorAxis == 0 ? maxXAxis : maxYAxis ) ])
				.range(colorpalette);
		} else {
			var colorScale = d3.scale.quantile()
				.domain([0, d3.mean(data,function(d) { return (colorAxis == 0 ? d.Metric1 : d.Metric2 ); }), d3.max(data, function (d) { return (colorAxis == 0 ? d.Metric1 : d.Metric2 ); })])
				.range(colorpalette);
		}	
	}
	
	
	// Create, transform and colour the hexagons in the mesh, calc Metric average for colorpalette
	var hexpoints2 = hexpoints.enter().append("path")
		.attr("class", "hexagon")
		.attr("d", hexbin.hexagon())
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.style("fill", function(d) { return colorScale((colorAxis == 2 ? d.length : d.reduce(function(sum, a, i, ar) { sum += a[colorAxis];  return i==ar.length-1?(ar.length==0?0:sum/ar.length):sum},0))); });
		
	// Create the y-axis label
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
			  .attr("class", "label")
			  .attr("transform", "rotate(-90)")
			  .attr("y", -40)		  
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text(labels[1]);
	
	// Create the x-axis label 
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
			.append("text")
			  .attr("class", "label")
			  .attr("x", width)
			  .attr("y", 40)
			  .style("text-anchor", "end")
			  .text(labels[0]);
	
	// Create the click function, to enable selections when clicking on a hexagon
	hexpoints2.on("click", function(data) {

		// Set up an array to store the data points in the selected hexagon
		var selectarray = [];
		  
			// Push the Dim1_key from the data array to get the unique selected values
			for (index = 0; index < data.length; ++index) {
				selectarray.push(data[index][3]);	
			}
			
			// Make the selections
			self.backendApi.selectValues(0,selectarray,false);

			// Stop the event propagating in case we add other events later
			d3.event.stopPropagation();
	});

	if (titleLayout == 0) {
		hexpoints2.append("title").text(function(d) { return "Count: " + d.length; } );
	} else {
		hexpoints2.append("title").text(function(d) { return d.map(function(e) { return e[2] + ": " + e[0] + " / " +e[1]; }).join("\n"); } );
	}

}




	
	
