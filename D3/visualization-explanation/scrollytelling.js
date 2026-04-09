// NOTE - This section is unused and likely to be deprecated, code taken from https://pudding.cool/process/introducing-scrollama/

var container = d3.select('#scroll')
var graphic = container.select('.graphic')
var chart = graphic.select('.chart')
var text = container.select('.scroll-text')
var step = text.selectAll('.step')

var scroller = scrollama()


function handleResize() {
	// 1. update height of step elements for breathing room between steps
    var stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style('height', stepHeight + 'px');

	// 2. update height of graphic element
    var bodyWidth = d3.select('body').node().offsetWidth;

    graphic
		.style('height', window.innerHeight + 'px');

	// 3. update width of chart by subtracting from text width
	var chartMargin = 32;
	var textWidth = $text.node().offsetWidth;
	var chartWidth = $graphic.node().offsetWidth - textWidth - chartMargin;
	// make the height 1/2 of viewport
	var chartHeight = Math.floor(window.innerHeight / 2);

	chart
		.style('width', chartWidth + 'px')
		.style('height', chartHeight + 'px');

	// 4. tell scrollama to update new element dimensions
	scroller.resize();
}


function handleStepEnter() {
    // response = { element, direction, index }

	// fade in current step
	$step.classed('is-active', function (d, i) {
		return i === response.index;
	})

	// update graphic based on step here
	var stepData = $step.attr('data-step')
	...
}

function handleContainerEnter(response) {
	// response = { direction }

	// sticky the graphic
	$graphic.classed('is-fixed', true);
	$graphic.classed('is-bottom', false);
}

function handleContainerExit(response) {
	// response = { direction }

	// un-sticky the graphic, and pin to top/bottom of container
	$graphic.classed('is-fixed', false);
	$graphic.classed('is-bottom', response.direction === 'down');
}


function handleContianerEnter() {

}


function handleContainerExit() {

}


function init() {
    handleResize()

    scroller
        .setup({
            container : "#scroll",
            graphic : ".graphic",
            text : ".scroll-text",
            step : ".scroll-text .step",
            offset : 0.5,
            debug: true
        })
        .onStepEnter(handleStepEnter)
        .onContainerEnter(handleContianerEnter)
        .onContainerExit(handleContainerExit)

    window.addEventListener("resize", handleResize)
}

init()