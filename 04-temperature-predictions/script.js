// Events

$(document).on('input', "input[type='range']", display);
$(document).on('change', "input[type='range']", analyze);

// Functions

function display() {
  let m = $('#month').val().padStart(2, '0');
  let d = $('#day').val().padStart(2, '0');
  let h = $('#hour').val().padStart(2, '0');

  $('#display-month').text(m);
  $('#display-day').text(d);
  $('#display-hour').text(h);
}

function analyze() {
  let m = $('#month').val().padStart(2, '0');
  let d = $('#day').val().padStart(2, '0');
  let h = $('#hour').val().padStart(2, '0');

  let mdh = m + d + h;
  $('#display-temp').text('...');

  let path = 'eileen.xue/temperature/main.py';
  let input = mdh;

  $.ajax({
    url: 'https://ocadu.goodcodeclub.com/temperature/?path=' + path + '&input=' + input,
    success: drawPrediction,
  });
}

function drawPrediction(data) {
  data = parseFloat(data);

  let m = $('#month').val().padStart(2, '0');
  let d = $('#day').val().padStart(2, '0');
  let h = $('#hour').val().padStart(2, '0');

  let mdh = m + d + h;

  svg.selectAll('circle.current').remove();

  $('#display-temp').text(data.toFixed(2));

  svg
    .append('circle')
    .attr('class', 'current')
    .attr('cx', function () {
      return x(mdh);
    })
    .attr('cy', function () {
      return y(data);
    })
    .attr('r', 2)
    .style('fill', 'navy');
}

// https://ocadu.goodcodeclub.com/temperature/?path=eileen.xue/temperature/main.py&input=050112

// D3 Code
let width = 300;
let height = 200;

let x = d3
  .scaleLinear()
  .domain([0, 123223])
  .range([20, width - 10]);

let y = d3
  .scaleLinear()
  .domain([40, -40])
  .range([0, height - 20]);

let svg = d3.select('#graph').append('svg').attr('width', width).attr('height', height);

svg.append('g').call(d3.axisLeft(y)).attr('transform', 'translate(30, 10)');

let href = 'https://ocadu.goodcodeclub.com/temperature/data.csv';

function drawDots(dot) {
  // console.log(dot);

  svg
    .append('circle')
    .attr('cx', function () {
      return x(dot.monthdayhour);
    })
    .attr('cy', function () {
      return y(dot.DegreeC);
    })
    .attr('r', 1)
    .style('fill', 'pink');
}

d3.csv(href, drawDots);
