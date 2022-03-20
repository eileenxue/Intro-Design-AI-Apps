// Events

$(document).on('click', '#start', start);
$(document).on('click', '#detect', detect);

// Functions
function start() {
  handsfree.start();
  handsfree.showDebugger();
  $('#debug').append(handsfree.debug.$wrap);

  setInterval(detect, 500);
}

function detect() {
  let url = $('.handsfree-canvas-video')[0].toDataURL();

  // $('#log').text(url);

  let payload = {
    image: url,
  };

  $.ajax({
    url: 'https://ocadu.goodcodeclub.com/sentiment/send.php',
    type: 'POST',
    data: payload,
    success: emote,
  });
}

function emote(data) {
  $('#emoji').empty();
  $('#log').text(data);

  if (data.indexOf('sorrow') > -1) {
    $('#emoji').append('😭');
  }

  if (data.indexOf('anger') > -1) {
    $('#emoji').append('😡');
  }

  if (data.indexOf('joy') > -1) {
    $('#emoji').append('😀');
  }

  if (data.indexOf('surprise') > -1) {
    $('#emoji').append('😮');
  }

  if (data === '') {
    $('#emoji').text('😐');
  }
}

let option = {
  facemesh: true,
  setup: {
    video: {
      $el: document.querySelector('#player'),
    },
  },
};
let handsfree = new Handsfree(option);

handsfree.use('logger', (data) => {
  if (typeof data.facemesh !== 'undefined' && typeof data.facemesh.multiFaceLandmarks !== 'undefined') {
    let position = data.facemesh.multiFaceLandmarks[0][0];
    let json = JSON.stringify(position);

    // $('#log').text(json);

    let x = position.x * 100;
    let y = position.y * 100;

    $('#emoji').css('left', x + '%');
    $('#emoji').css('top', y + '%');
  }
});

$(document).on('click', '#next', () => {
  let ogURL =
    'https://ocadu.goodcodeclub.com/video/?path=https://player.vimeo.com/external/365690002.sd.mp4?s=029fd5766f7cd67fcbf422f882dfd8f06bcb470c&profile_id=139&oauth2_token_id=57447761';
  let newURL =
    'https://player.vimeo.com/external/531011449.sd.mp4?s=0d756c37527011c0f445a931f9890b764b97dd0a&profile_id=164&oauth2_token_id=57447761';
  let proxy = 'https://ocadu.goodcodeclub.com/video/?path=' + newURL;

  if ($('#player').prop('src') === ogURL) {
    $('#player').attr('src', proxy);
  } else {
    $('#player').attr('src', ogURL);
  }
});
