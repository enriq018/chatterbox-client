var app = {
  rooms: [],
  friends: [],
  user: window.location.href.split('=')[1]
};

$( document ).ready(function() {
// YOUR CODE HERE:


  var test = {rooms: ['ford', 'toyota'], message: ['built tough', 'like a rock'], user: 'bob'};

  
  app.init = function () {
    
    for (var i = 0; i < app.rooms.length; i++ ) {
      var room = `<button class="roomButton">${app.rooms[i]}</button>`;
      $('.roomSelector').append(room);
    }
  };
  app.init();    
  // createdAt : "2017-02-08T21:34:13.056Z"
  // objectId : "6fXHtbOuf5" ,
  // roomname : "lobby" ,
  // text : "`var that = this`, never use it." 
  // updatedAt : "2017-02-08T21:34:13.056Z" 
  // username : "fredx"

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
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
   
  };
  var chatData;
  app.fetch = function() {
    $.ajax({
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: {order: '-createdAt'},
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent', data);
        chatData = data;
        var arr = data.results;
        
        for (var i = 0; i < 10; i++ ) {
          var msg = `
            <div class = 'msg'>
              <span class = 'user'> 
                ${'username'} </span>
                ${JSON.stringify(arr[i])} 
            </div>`;
          $('.messageHolder').append(msg);
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
    
  };

  app.fetch();
  $('.roomSelector').on('click', '.newRoom', function() {
    var newRoom = prompt('What is the name of the new room?');
    var room = `<button class="roomButton">${newRoom}</button>`;
    $('.roomSelector').append(room); 
    $('.null').remove();
    app.rooms.push(newRoom);
    console.log(app.rooms);
  });
  
  $('.roomSelector').on('click', '.roomButton', function() {
    //when a button is clicked, it returns a room name
    //this roomname is passed into the fetch function 
    //the fetch will grab the recent chat msgs and filter/append only matchting roomnames 
    app.fetch($(this).text());
    
  });
  
  $('.submit').on('click', function() {
    var message = (document.getElementById('messageText').value);
    app.send('lobby', message, app.user);
    document.getElementById('messageText').value = '';
  }); 

});
