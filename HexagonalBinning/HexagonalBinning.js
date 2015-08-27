define(["jquery", "text!./HexagonalBinning.css","./d3.min","./hexbin","./lasso_adj","./senseUtils"], function($, cssContent) {'use strict';
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
						binningMode: {
							ref: "binningMode",
							type: "integer",
							component: "dropdown",
							label: "Binning Mode",
							options: 
								[ {
									value: 0,
									label: "Color Binning"
								}, {
									value: 1,
									label: "Area Binning"
								}
								],
							defaultValue: 0
						}, 
						areaColor: {
							ref: "areaColor",
							type: "string",
							label: "Area Color",
							defaultValue: "#d73027",
							expression: "optional",
							show: function(layout) { return layout.binningMode == 1 } 
						}, 
						colors: {
							ref: "ColorSchema",
							type: "string",
							component: "dropdown",
							label: "Color",
							show: function(layout) { return layout.binningMode == 0 },
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
							defaultValue: 0,
							show: function(layout) { return layout.binningMode == 0 }
						},							  
						maxRadius:{
							ref: "maxRadius",
							type: "integer",
							label: "Max. Radius",
							defaultValue: 20,
							expression: "optional"
						},
						minRadius:{
							ref: "minRadius",
							type: "integer",
							label: "Min. Radius",
							defaultValue: 2,
							expression: "optional",
							show: function(layout) { return layout.binningMode == 1 }
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
						},	   
						centerHexagons: {
							ref: "centerHexagons",
							type: "boolean",
							component: "switch",
							label: "Center Hexagons",
							options: [{
								value: true,
								label: "On"
							}, {
								value: false,
								label: "Off"
							}],
							defaultValue: false,
							show: function(layout) { return !layout.useStaticLayout } 
						},				
					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element,layout) {
		
			// Call SenseUtils to page the data for > 10000 points
			senseUtils.pageExtensionData(this, $element, layout, drawHex, self);
			
		}
	};
});

function drawHex($element, layout, fullMatrix, self) {
			
			// get qMatrix data array
			//var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			//create matrix variable
			var qMatrix = fullMatrix;
			
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

			var binningMode = layout.binningMode,
				areaColor = layout.areaColor,
 				colorpalette = layout.ColorSchema.split(", "),
				colorAxis = layout.colorAxis,
				maxRadius = layout.maxRadius,
				minRadius = layout.minRadius,
				fillMesh = layout.fillMesh,
				titleLayout = layout.titleLayout,
				useStaticLayout = layout.useStaticLayout,
				minXAxis = layout.minXAxis,
				minYAxis = layout.minYAxis,
				maxXAxis = layout.maxXAxis,
				maxYAxis = layout.maxYAxis,
				centerHexagons = layout.centerHexagons;
			
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
				$element.append($('<div />').attr({ "id": id, "class": ".qv-object-HexagonalBinning" }).css({ height: height, width: width }))
			}
			
			viz(self, data, measureLabels, width, height, id, selections, binningMode, areaColor, colorpalette, colorAxis, maxRadius, minRadius, fillMesh, titleLayout, useStaticLayout, minXAxis, minYAxis, maxXAxis, maxYAxis, centerHexagons);
	
	
}


var viz = function (self, data, labels, width, height, id, selections, binningMode, areaColor, colorpalette, colorAxis, maxRadius, minRadius, fillMesh, titleLayout, useStaticLayout, minXAxis, minYAxis, maxXAxis, maxYAxis, centerHexagons) {
	
	
	
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
		.radius(maxRadius);
	
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
		var xExt = d3.extent(data, function(d) { return d.Metric1; });
		if (xExt[1] == 0) xExt[1] = maxRadius / 2;
		if (centerHexagons) {
			xExt[0] -= maxRadius / 4;
			xExt[1] += maxRadius / 4;
		} else {
			if (xExt[0] == xExt[1]) {
				xExt[0] -= maxRadius / 4;
				xExt[1] += maxRadius / 4;
			}
		}
		var x = d3.scale.linear()
			.domain(xExt)
			.range([0, width]);
		
		// Set the y-axis to min and max of Metric 2	
		var yExt = d3.extent(data, function(d) { return d.Metric2; });
		if (yExt[1] == 0) yExt[1] = maxRadius / 2;
		if (centerHexagons) {
			yExt[0] -= maxRadius / 4;
			yExt[1] += maxRadius / 4;
		} else {
			if (yExt[0] == yExt[1]) {
				yExt[0] -= maxRadius / 4;
				yExt[1] += maxRadius / 4;
			}
		}
		var y = d3.scale.linear()
			.domain(yExt)
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

	// Lasso functions to execute while lassoing
	var lasso_start = function() {
		// keep mouse cursor arrow instead of text select (auto)
		$("#"+id).css('cursor','default');
		
		// clear all of the fills 
		if (binningMode > 0) {
			// Area binning mode
			lasso.items()
				.style("fill",null);
		}

		lasso.items()
			.classed({"not_possible":true,"selected":false}); // style as not possible
	};

	var lasso_draw = function() {
		// Style the possible dots
		lasso.items().filter(function(d) {return d.possible===true})
			.classed({"not_possible":false,"possible":true});

		// Style the not possible dot
		lasso.items().filter(function(d) {return d.possible===false})
			.classed({"not_possible":true,"possible":false});
	};

	var lasso_end = function(data) {
		var selectedItems = lasso.items().filter(function(d) {return d.selected===true});	
		if (selectedItems[0].length > 0) {
			//console.log(selectedItems[0]);
			
			// Set up an array to store the data points in the selected hexagon
			var selectarray = [];
			//Push the Dim1_key from the data array to get the unique selected values
			for (index = 0; index < selectedItems[0].length; index++) {
				for (item = 0; item < selectedItems[0][index].__data__.length; item++) {
					selectarray.push(selectedItems[0][index].__data__[item][3]);	
				}
			}

			console.log(selectarray);
			
			//Make the selections
			self.backendApi.selectValues(0,selectarray,false);
		} else {
			// nothing in lasso, nothing to select
			// Reset the color
			if (binningMode > 0) {
			// Area binning mode
				lasso.items()
					.style("fill", function(d) { return areaColor; });
			}
		}
	};

	// Create the area where the lasso event can be triggered
	var lasso_area = svg.append("rect")
						  .attr("width",width)
						  .attr("height",height)
						  .style("opacity",0);

	//-----------------------------------------------------
	// Define the lasso
	var lasso = d3.lasso()
		  .closePathDistance(75) // max distance for the lasso loop to be closed
		  .closePathSelect(true) // can items be selected by closing the path?
		  .hoverSelect(true) // can items by selected by hovering over them?
		  .area(lasso_area) // area where the lasso can be started
		  .on("start",lasso_start) // lasso start function
		  .on("draw",lasso_draw) // lasso draw function
		  .on("end",lasso_end); // lasso end function		  
	//-----------------------------------------------------		

		
	// Create the mesh for the hexagons
	var mesh = svg.append("svg:defs").append("svg:clipPath")
		.attr("id", id + "_clip")
		.append("svg:rect")
		.attr("class", "mesh")
		.attr("width", width)
		.attr("height", height);
	
	if (fillMesh) {
		// Fill mesh with hexagons
		svg.append("svg:path")
			.attr("clip-path", "url(" + document.location.href + "#"+id + "_clip)")
			.attr("d", hexbin.mesh())
			.style("stroke-width", .5)
			.style("stroke", "grey")
			.style("fill", "none");
	}
	
	var hexBin = hexbin(points);
	
	// Create the underlying mesh grid and the points within each hexagon
	var hexpoints = svg.append("g")
		.attr("clip-path", "url(" + document.location.href + "#"+id + "_clip)")  // fixes AngularJS problem because of: <base href="/">
		.selectAll(".hexagon")
		.data(hexBin);

			
		
	// Set the colour scale to mimic Sense Sequential Classes colour scheme
	if (binningMode == 0) {
		// Color binning mode

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
			.attr("id", function(d) {  return "path" + d[0][3]; })  // use Dim1_Key as Path ID
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.style("fill", function(d) { return colorScale((colorAxis == 2 ? d.length : d.reduce(function(sum, a, i, ar) { sum += a[colorAxis];  return i==ar.length-1?(ar.length==0?0:sum/ar.length):sum},0))); });
	} else 	{
		var radius = d3.scale.sqrt()
			.domain([1, d3.max(hexBin, function (d) { return d.length; }) ])
			.range([minRadius, maxRadius]);

		// Area binning mode
		var hexpoints2 = hexpoints.enter().append("path")
			.attr("class", "hexagon")
			.attr("d", function(d) { return hexbin.hexagon(radius(d.length)); })
			.attr("id", function(d) {  return "path" + d[0][3]; })  // use Dim1_Key as Path ID
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.style("fill", function(d) { return areaColor; })
			.style("text", function(d) { return "this"; });
	}
	
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


	//console.log(hexpoints2);
	// Init the lasso on the svg:g that contains the dots
	
	svg.call(lasso);	
	lasso.items(d3.selectAll("#"+id+" .hexagon"));

	// Create the click function, to enable selections when clicking on a hexagon
	hexpoints2.on("click", function(data) {

		// Set up an array to store the data points in the selected hexagon
		var selectarray = [];
		  
		// Push the Dim1_key from the data array to get the unique selected values
		for (index = 0; index < data.length; ++index) {
			selectarray.push(data[index][3]);	
		}
		
		console.log(selectarray);
		
		// Make the selections
		self.backendApi.selectValues(0,selectarray,false);

		// Stop the event propagating in case we add other events later
		d3.event.stopPropagation();
	});

	// Add title to svg path
	if (titleLayout == 0) {
		hexpoints2.append("title").text(function(d) { return "Count: " + d.length; } );
	} else {
		hexpoints2.append("title").text(function(d) { 
		return (d.length > 20 
			? d.slice(0,20).map(function(e) { return e[2] + ": " + e[0] + " / " +e[1]; }).join("\n") + "\n+" + (d.length -20) + " members"
			: d.map(function(e) { return e[2] + ": " + e[0] + " / " +e[1]; }).join("\n")); } );
	}

/* 
	// Add text into hexabin 	
	svg.append("g").data(hexBin)
		.append("text")
		.attr("class", "linklabel")
		.style("fill","white")
		.attr("font-size", "10px")
		.attr("x", 1)
		.attr("y", 1)
		//.attr("dy", ".35em")
		.attr("text-anchor", "middle")
		.append("textPath")
//		.attr("xlink:href", function(d) { return "#path" + d[0][3]; })
		.attr("xlink:href", function(d) { return "url(" + document.location.href + "#path" + d[0][3] + ")"; })
		.text(function(d) { return d.length; });
*/

}


