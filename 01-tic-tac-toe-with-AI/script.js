// Events to monitor
$(document).on('click', '#restart', init);
$(document).on('click', '#board button:not(.activated)', mark);
$(window).on('load', init);

// Game definitions
let turn = 'X';
let win_x = 0;
let win_o = 0;
let win_sequence = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Functions
function init() {
  // alert('Start game');
  $('#board button').text('?').removeClass('activated x o');
  turn = 'X';
}

function mark() {
  // alert('Button pressed');
  $(this).addClass('activated');
  if (turn === 'X') {
    $(this).text('X').addClass('x');
    turn = 'O';
  } else if (turn === 'O') {
    $(this).text('O').addClass('o');
    turn = 'X';
  }
  check();

  if (turn === 'O') {
    robot();
  }
}

function check() {
  // Convert board into numbers
  let data_x = [];
  let data_o = [];

  $('#board button.x').each(function () {
    let index = $(this).index('button');
    data_x.push(index);
  });

  $('#log').prepend('\n');
  $('#log').prepend('X: ' + data_x);

  $('#board button.o').each(function () {
    let index = $(this).index('button');
    data_o.push(index);
  });

  $('#log').prepend(' | ');
  $('#log').prepend('O: ' + data_o);

  // Compare to the winning sequence
  let winner = null;
  let count = $('#board button:not(.activated)').length;

  $('#log').prepend(' | ');
  $('#log').prepend('Remaining: ' + count);

  $.each(win_sequence, function (i, seq) {
    const inter_x = seq.filter((value) => data_x.includes(value));
    const inter_o = seq.filter((value) => data_o.includes(value));

    $('#log').prepend('\n');
    $('#log').prepend('INTER_X: ' + inter_x);
    $('#log').prepend(' | ');
    $('#log').prepend('INTER_O: ' + inter_o);

    if (inter_x.length === 3) {
      winner = 'X';
      win_x += 1;
    } else if (inter_o.length === 3) {
      winner = 'O';
      win_o += 1;
    }
  });

  // Announce results
  if (winner !== null) {
    $('#log').prepend('\n');
    $('#log').prepend('WINNER: ' + winner);

    $('#score_x').text(win_x);
    $('#score_o').text(win_o);

    $('#board button').addClass('activated');
  }

  if (count === 0 && winner === null) {
    $('#log').prepend('\n');
    $('#log').prepend('No Winner');
  }
}

function robot() {
  // See which buttons are available
  $('#log').prepend('\n');
  $('#log').prepend('Robot Turn');

  let data_free = [];

  $('#board button:not(.activated)').each(function () {
    let index = $(this).index('button');
    data_free.push(index);
  });

  $('#log').prepend('\n');
  $('#log').prepend('Free: ' + data_free);

  // Choose the most sensible option
  let target = null;

  if (data_free.indexOf(4) > -1) {
    target = 4;
  } else if (data_free.indexOf(0) > -1) {
    target = 0;
  } else if (data_free.indexOf(2) > -1) {
    target = 2;
  } else if (data_free.indexOf(6) > -1) {
    target = 6;
  } else if (data_free.indexOf(8) > -1) {
    target = 8;
  }

  // If desperate, choose any option
  if (target === null) {
    let randomIndex = Math.floor(Math.random() * data_free.length);
    target = data_free[randomIndex];
  }

  $('#log').prepend('\n');
  $('#log').prepend('Target: ' + target);

  $('#board button:eq(' + target + ')').click();
}
