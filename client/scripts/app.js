// createdAt : "2017-02-08T21:34:13.056Z"
// objectId : "6fXHtbOuf5" ,
// roomname : "lobby" ,
// text : "`var that = this`, never use it." 
// updatedAt : "2017-02-08T21:34:13.056Z" 
// username : "fredx"

var app = {
  server: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
  rooms: ['lobby'],
  friends: [],
  currentRoom: 'lobby',
  user: window.location.href.split('=')[1]
};
app.renderMessage = function(){};
app.clearMessages = function () {
  $('.messageHolder *').remove();
};

$( document ).ready(function() {
  
  app.init = function () {
    
    $.ajax({
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: {order: '-createdAt'},
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent', data);
        chatData = data;
        var arr = data.results;
        for (var i = 0; i < 100; i++ ) {
          var safeMsg = xssEscape(arr[i].text);
          var safeFriend = xssEscape(arr[i].username);
          if (arr[i].roomname === 'lobby') {
            var msg = `
            <div class = 'msg'>
              <span class = '${safeFriend}'> 
                Username:${safeFriend} </span>
                ${safeMsg} 
            </div>`;
            $('.messageHolder').append(msg);
          }
          if (arr[i].roomname && !app.rooms.includes(arr[i].roomname)) {
            app.rooms.push(arr[i].roomname);
            var room = `<button class="roomButton">${arr[i].roomname}</button>`;
            $('.roomSelector').append(room);
          }
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };
  app.init();    
  
  app.send = function(rm, txt, user) {
    var sendThis = {roomname: rm, text: txt, username: user};
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(sendThis),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent', data);
        app.fetch(rm);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };
  var chatData;
  app.fetch = function(roomName) {
    $.ajax({
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: {order: '-createdAt'},
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent', data);
        //$('.messageHolder *').remove();
        app.clearMessages();
        chatData = data;
        var arr = data.results;
        
        for (var i = 0; i < 100; i++ ) {
          var safeMsg = xssEscape(arr[i].text);
          var safeFriend = xssEscape(arr[i].username);
          if (arr[i].roomname === roomName) {
            var msg = `
            <div class = 'msg'>
              <span class = 'userName'> 
                ${safeFriend}: </span>
                ${safeMsg}, ${arr[i].createdAt}
            </div>`;
            if (app.friends.includes(arr[i].username)) {
              msg = `
            <div class = 'msg'>
              <span class = 'friends'> 
                ${safeFriend}: </span>
                ${safeMsg}, ${arr[i].createdAt}
            </div>`;

              
            }

            
              console.log(msg)
            $('.messageHolder').append(msg);
          }
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
    
  };

  $('.roomSelector').on('click', '.newRoom', function() {
    var newRoom = prompt('What is the name of the new room?');
    var room = `<button class="roomButton">${newRoom}</button>`;
    $('.roomSelector').append(room); 
    $('.null').remove();
    app.rooms.push(newRoom);
    app.currentRoom = newRoom;
    app.fetch(newRoom);
  });
  
  $('.roomSelector').on('click', '.roomButton', function() {
    app.currentRoom = $(this).text();
    app.fetch($(this).text());
  });
  
  $('.submit').on('click', function() {
    var message = (document.getElementById('messageText').value);
    var safeMessage = xssEscape(message);
    app.send(app.currentRoom, safeMessage, app.user);
    document.getElementById('messageText').value = '';
  }); 
  
  $('.messageHolder').on('click', '.userName', function() {
    var user = ($(this).text().trim().split(':')[0]);
    if (!app.friends.includes(user)) {
      app.friends.push(user);
      app.fetch(app.currentRoom);
        
    }
    
  });
  
  app.fetch('lobby');
  console.log(app.currentRoom);
 

});
