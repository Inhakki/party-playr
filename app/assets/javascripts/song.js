$( function() {
 var roomID = $( "h1:first" ).attr( "data-num" );

  $.ajax({
    url: "/rooms/" + roomID + "/songs",
    type: "get",
    dataType: "json",
    context: this
  }).then( displaySongs );

function displaySongs( songs ) {
  var playedSongs = [];

  for( i=0; i < songs.length; i++ ) {
    playedSongs.push( songs[i].name )

    $( '#playlist' ).append(
      '<li>' + songs[i].name + ' by ' + songs[i].artist +
      '(' + songs[i].length + ') ' + songs[i].spotify_url + '</li>');
  }
}

  $current_song = $("li").first().text();
}
