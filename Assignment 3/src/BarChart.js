class BarChart {
	constructor(_data){
	 this.margin = {top: 20, right: 20, bottom: 110, left: 40};
        this.width = 600 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;

        this.data = _data;

        this.initVis();

	}

	initVis() {
		let vis = this;

		// Select HTML tag with a specific id ``bar", add a SVG container, and set the corresponding attributes.
		//Then add a group and make a translation (e.g., width and height).(5pts)
		// To DO
		vis.svg = d3.select("#bar").append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height",vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform",
				`translate(${vis.margin.left},${vis.margin.top})`);;
		
				
		// Create scales for x and y (15pts)
		
		// To DO
		vis.xScaleFocus = d3.scaleLinear().range([0,vis.width]);
		vis.xScaleFocus2 = d3.scaleLinear().range([0,vis.width]);
		vis.yScaleFocus = d3.scaleLinear().range([vis.height,0]);

		// Place Axis (i.e., x-axis on the bottom and y-axis on the left)

		vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus);

		vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus);

		// Create a container in svg for drawing bar chart
		vis.focus = vis.svg.append("g")
		               .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		vis.focus.attr('id','focus')
		         .append("rect")
		         .attr("width",vis.width)
		         .attr("height",vis.height)
				 .attr("fill","white");

		// Create Axis


		vis.xAxisFocusG = vis.focus.append('g')
		                     .attr('class', 'axis x-axis')
		                     .attr('transform', `translate(0,${vis.height})`);

		vis.yAxisFocusG = vis.focus.append('g')
				.attr('class', 'axis y-axis');

        // Create a bursh variable (5pts). The "bursh" variable will call brushed function
        // To determine whether a brush action is trigger, we can use d3.event.selection to judge
        //so remember to pass this variable into the brushed function


        // To DO
		vis.brush = d3.brushX().extent([[0, 0], [vis.width, vis.height]]).on('end', () => { if (d3.event.selection) vis.brushed(d3.event.selection)});

		vis.brushG = vis.focus.append("g")
						.attr("brush","brush x-brush");


        // Add label for y-axis

        vis.svg.append("text")
               .attr("class", "ylabel")
               .attr("y", 0 - vis.margin.left+15)
               .attr("x", 0 - (vis.height/2))
               .attr("dy", "1em")
               .attr("transform", "rotate(-90)")
               .style("text-anchor", "middle")
               .text("Number of kWhDelivered");

	}

	updateVis(){
		let vis = this;

		// first update the domains for x axis
		vis.xScaleFocus.domain([0, d3.max(vis.data, d => d.kWhDelivered)]);

		// Create a higtogram (5pts) hint: D3.histogram()
		// To DO

		let histogram = d3.histogram()
						.value(d => d.kWhDelivered)
						.domain(vis.xScaleFocus.domain())
						.thresholds(vis.xScaleFocus.ticks(400));

		// Create bins from the histogram (5pts)

		// To DO

		vis.bins = histogram(vis.data);

		// Set the domains for x and y axis (8pts).

		// To DO
		
		vis.yScaleFocus.domain([0,d3.max(vis.bins, d => d.length)]); // update y domain

		vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus);

		vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus);

		vis.renderVis();
		
	}


	renderVis(){
		let vis = this;

		// draw the bar chart from the generated bins (10 pts)

		// To DO
		let x = vis.xScaleFocus;
		let y = vis.yScaleFocus;

		vis.focus.selectAll("rect")
			.data(vis.bins)
			.enter()
			.append("rect")
			.attr('class', 'rect')	// add class rect
			.attr("x",0)
			.attr("transform", function (d) { return `translate(${x(d.x0)} , ${y(d.length)})` }) // translate
			.attr("width", function (d) { return x(d.x1) - x(d.x0) - 1}) //set width
			.attr("height", function (d) { return vis.height - y(d.length); }) //set height
			.style("fill", "#69b3a2");
			// Place x and y axis on the bottom and left, respectively
			vis.xAxisFocusG.call(vis.xAxisFocus);
			vis.yAxisFocusG.call(vis.yAxisFocus);
			
		// call the brush function
        vis.brushG
        	.call(vis.brush);
	}

	brushed(selection){
		let vis = this;
		// console.log(vis);
			//Convert given pixel coordinates (range: [x0,x1]) into a kw (domain: [number,number]) (10pts)
			// To DO
			let ratio = d3.max(vis.data, d => d.kWhDelivered) / vis.width;	// ratio to calculate the domain
			vis.xScaleFocus2.domain([selection[0]*ratio, selection[1]*ratio]);
			// Update x-axis  accordingly (4pts)
			// To DO
			vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus2);

			
			// Based on the selected region to filter the bins (5pts) Hint: use filter() function
			// To Do
			let ratio2 = vis.width / vis.bins.length;	// ratio to filter bins
			vis.updated_bins = vis.bins.filter((d, index) => {return ratio2 * index >= selection[0] && ratio2 * (index+1) <= selection[1]});

			//Redraw the bar chart (10pts)
			// To DO
			vis.yScaleFocus.domain([0, d3.max(vis.updated_bins, d => d.length)]); // first update the y domain
			
			// redraw the chart
			let x = vis.xScaleFocus2;
			let y = vis.yScaleFocus;
			vis.focus.selectAll(".rect")  // select the class rect
				.data(vis.updated_bins)
				.join("rect")  // use join to update data
				.attr("x", 1)
				.attr("transform", function (d) {return `translate(${x(d.x0)} , ${y(d.length)})` })
				.attr("width", function (d) { return x(d.x1) - x(d.x0) - 1})
				.attr("height", function (d) { return vis.height - y(d.length); })
				.style("fill", "#69b3a2");
			
			vis.brushG.remove();  // remoce brushG so that only one brush will be conducted
			
			// Update y-axis accordingly (5pts)
			// To DO
			vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus);
			vis.xAxisFocusG.call(vis.xAxisFocus);
			vis.yAxisFocusG.call(vis.yAxisFocus);
	}
}