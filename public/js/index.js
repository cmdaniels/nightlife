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
            '<p>0 Going</p>' +
          '</div>' +
        '</div>');
      });
    }
  });
}

function going(id) {
  console.log(id);
}

$("#location").keyup(function(event){
    if(event.keyCode == 13){
        $("#search").click();
    }
});
