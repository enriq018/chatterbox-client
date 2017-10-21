// createdAt : "2017-02-08T21:34:13.056Z"
// objectId : "6fXHtbOuf5" ,
// roomname : "lobby" ,
// text : "`var that = this`, never use it." 
// updatedAt : "2017-02-08T21:34:13.056Z" 
// username : "fredx"

var app = {
  rooms: ['lobby'],
  friends: [],
  currentRoom: 'lobby',
  user: window.location.href.split('=')[1]
};

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
          if (arr[i].roomname === 'lobby') {
            var msg = `
            <div class = 'msg'>
              <span class = '${arr[i].username}'> 
                Username:${arr[i].username} </span>
                ${arr[i].text} 
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
      //data: {order: '-createdAt'},
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent', data);
        //$('.messageHolder *').remove();
        app.clearMessages();
        chatData = data;
        var arr = data.results;
        
        for (var i = 0; i < 100; i++ ) {
          console.log('roomName:', arr[i].roomname);
          if (arr[i].roomname === roomName) {
            var msg = `
            <div class = 'msg'>
              <span class = 'userName'> 
                ${arr[i].username}: </span>
                ${arr[i].text}, ${arr[i].createdAt}
            </div>`;
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
    app.send(app.currentRoom, message, app.user);
    document.getElementById('messageText').value = '';
  }); 
  
  $('.messageHolder').on('click', '.userName', function() {
    var user = ($(this).text().trim().split(':')[0]);
    if (!app.friends.includes(user)) {
      app.friends.push(user);
        
    }
     console.log(app.friends)
  });
  
  app.fetch('lobby');
  console.log(app.currentRoom);
 

});
