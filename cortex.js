// console.log(document.cookie, chrome);

var REGEX_MATCH_NEURON = /[^;]\s*neuron\=[^;]+/;

function dispose_cookie(key) {
  var date = new Date();
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);

  document.cookie = key + '=; path=/; expires=' + date.toGMTString();
}


function set_cookie(key, value) {
  if (typeof value === 'string') {
    value = encodeURIComponent(value);
  }
  document.cookie = key + '=' + value + '; path=/';
}


var handlers = {
  'init':function(){

    if (REGEX_MATCH_NEURON.test(cookie)) {
      dispose_cookie('cortex_combo');
      dispose_cookie('cortex_path');
      dispose_cookie('cortex_compress');
      dispose_cookie('neuron');

      send_icon_message(false);
      location.reload();
    }
  },
  'mode-change': function(message) {
    var cookie = document.cookie;


      if(message.result2==true){set_cookie('cortex_compress', false);}else{dispose_cookie('cortex_compress');}
      if(message.result3==true){set_cookie('cortex_combo', false);}else{dispose_cookie('cortex_combo');}
      if(message.result1==true){set_cookie('cortex_path', 'http://localhost:9074');}else{dispose_cookie('cortex_path');}
      set_cookie('neuron', 'path=http://localhost:9074/mod,ext=.js');

      send_icon_message(true);

    location.reload();
  },

  'test-activate': function(message) {
    send_icon_message(REGEX_MATCH_NEURON.test(document.cookie));
  }
};


function send_icon_message(active) {
  chrome.extension.sendMessage({
    event: 'set-icon',
    active: active
  });
}


chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
  var event = message.event;

  var handler = handlers[event];

  handler && handler(message);
});

