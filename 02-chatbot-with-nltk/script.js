// Events
$(document).on('click', '#speak', recognize);
$(document).on('submit', '#user', send);

// Variables
let recognition = new webkitSpeechRecognition();

recognition.onresult = function (e) {
  // console.log(e.results);

  let transcript = e.results[0][0].transcript;

  $('#msg').val(transcript);
  recognition.stop();
  $('#speak').removeClass('activated').text('🎙 Speak');
  $('#user').submit();
};

// Functions
function recognize() {
  // alert('!');
  recognition.start();
  $(this).addClass('activated').text('🎧 Listening...');
}

function send(e) {
  e.preventDefault();

  let msg = $('#msg').val();

  if (msg === '') {
    return false;
  }
  $('#chat').append('YOU: ');
  $('#chat').append(msg);
  $('#chat').append('\n');

  $('#msg').val('');

  let path = 'eileen.xue/eliza/chat.py';
  let url = 'https://ocadu.goodcodeclub.com/chat?path=' + path + '&msg=' + msg;

  $.ajax({
    url: url,
    success: insert,
  });
}

function insert(output) {
  $('#chat').append('BOT: ');
  $('#chat').append(output);
  $('#chat').append('\n');
  $('#chat').scrollTop(99999999);
}
