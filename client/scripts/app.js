var app = {
  rooms: [],
  message: [],
  friends: [],
  user: window.location.href.split('=')[1]
};

$( document ).ready(function() {
// YOUR CODE HERE:


  var test = {rooms: ['ford', 'toyota'], message: ['built tough', 'like a rock'], user:'bob'}

  
  app.init = function () {
    app.rooms.push(test.rooms[0], test.rooms[1]);
    app.message.push(test.message[0], test.message[1]);
    app.user = test.user;
    
    
    for (var i = 0; i < app.rooms.length; i++ ) {
      var room = `<button class="${app.rooms[i]}">${app.rooms[i]}</button>`;
      $('.roomSelector').append(room);
    }
    
    
    for (var i = 0; i < app.message.length; i++ ) {
      console.log('msg========', app.message[i]);
      var msg = `
            <div class = 'msg'>
              <span class = 'user'> 
                ${'username'} </span>
                ${app.message[i]} 
            </div>`;
      
      $('.messageHolder').append(msg);
    }
  };
        

  app.send = function() {
   
  };

  app.fetch = function() {
  };


  $('.roomSelector').on('click', '.newRoom', function() {
    var newRoom = prompt('What is the name of the new room?');
    var room = `<button class="${newRoom}">${newRoom}</button>`;
    $('.roomSelector').append(room); 
    $('.null').remove();
    app.rooms.push(newRoom);
    console.log(app.rooms)
  });

  

});
