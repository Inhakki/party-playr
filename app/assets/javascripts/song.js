$( function() {
 var roomID = $( "h1:first" ).attr( "data-num" );

  $.ajax({
    url: "/rooms/" + roomID + "/songs",
    type: "get",
    dataType: "json",
    context: this
  }).then( displaySongs );

  var currentSong = $( 'li:first' );
  window.setTimeout( nextSong, 5000 );

  // $current_song.length * 1000
  // window.setTimeout( , $current_song.length * 1000 );
});

function displaySongs( songs ) {
  var playedSongs = [];

  for( i = 0; i < songs.length; i++ ) {
    playedSongs.push( songs[i].name );

    if ( i == 0) {
      displaySpotifyWidget( songs[0].spotify_url );
    } else {
      $( '#playlist' ).append(
      '<li id=' + songs[i].spotify_url + ' data-length=' + songs[i].length + '>' + songs[i].name + ' by ' + songs[i].artist + '</li>');
    }
  }
}

function displaySpotifyWidget( song_url ) {
  $( '#playlist' ).prepend(
    '<iframe src="' +
    'https://embed.spotify.com/?uri=' + song_url + '"' + 'width="300" height="80" frameborder="0" allowtransparency="true"></iframe>');
}

function updateSpotifyWidget( song_url ) {
  newURL = 'https://embed.spotify.com/?uri=' + song_url;
  $( 'li:first' ).attr( 'src', newURL );
}

function nextSong() {
  // if there are more songs, play the next one
  if ( $( 'li' ).length > 0 ) {
    $( 'iframe:first' ).remove();
    displaySpotifyWidget( $( 'li:first' ).attr( 'id' ) );
    $( 'li:first' ).remove();
  }

  window.setTimeout( nextSong, 5000 );
}

// function debug() {
//   debugger
// }
