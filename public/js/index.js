var provider = new firebase.auth.TwitterAuthProvider();
var database = firebase.database();
var loggedIn = false;
var userId;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    loggedIn = true;
    userId = user.uid;
    $('#login').html('Sign Out');
  } else {
    loggedIn = false;
    $('#login').html('Log In with Twitter <i class="fa fa-twitter" aria-hidden="true"></i>');
  }
});

function login(doSignOut){
  if(!loggedIn){
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      var user = result.user;
      userId = user.uid;
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      console.error(errorCode, errorMessage, email, credential);
    });
  } else if(doSignOut !== false) {
    firebase.auth().signOut().then(function() {
      userId = '';
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  }
}

function search(){
  var location = $('#location')[0].value;
  $.ajax({
    type: 'POST',
    url: '/search',
    data: {
      location: location
    },
    success: function(restaurants){
      $('.places').html('');
      restaurants.forEach(function(rest){
        database.ref('places/' + rest.id).once('value').then(function(snapshot) {
          var going = snapshot.numChildren();
          $('.places').append('<div class="panel panel-default">' +
            '<div class="panel-heading">' +
              '<h3 class="panel-title"><a href="' + rest.url + '">' + rest.name + '</a></h3>' +
            '</div>' +
            '<div class="panel-body">' +
              '<a href="' + rest.url + '" class="thumbnail">' +
                '<img src="' + rest.image_url + '" alt="' + rest.name + '">' +
              '</a>' +
            '</div>' +
            '<table class="table">' +
              '<tr>' +
                '<td>Location</td>' +
                '<td>' + rest.location.display_address[0] + '<br/>' + rest.location.display_address[1] + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>Phone</td>' +
                '<td>' + rest.display_phone + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td>Open Now</td>' +
                '<td>' + (rest.is_closed ? 'No' : 'Yes') + '</td>' +
              '</tr>' +
            '</table>' +
            '<div class="panel-footer">' +
              '<button class="btn btn-primary" id="' + rest.id + '" onclick="going(this.id)">I\'m Going</button>' +
              '<p><span id="'+ rest.id + '-numGoing">' + going + '</span> Going</p>' +
            '</div>' +
          '</div>');
        });
        database.ref('places/' + rest.id).on('value', function(snapshot) {
          $('#' + rest.id + '-numGoing').html(snapshot.numChildren());
        });
      });
    }
  });
}

function going(id) {
  if(!loggedIn){
    login(false);
  } else {
    database.ref('places/' + id).once('value').then(function(snapshot) {
      if(snapshot.val() && snapshot.val().hasOwnProperty(userId)) {
        database.ref('places/' + id + '/' + userId).remove();
      } else {
        var updates = {};
        updates[userId] = true;
        database.ref('places/' + id).update(updates);
      }
    });
  }
}

$("#location").keydown(function(event){
    if(event.keyCode == 13){
        search();
    }
});
