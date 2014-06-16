$( function() {
  // store what room we're currently in for easy access
  var roomID = $( "h1:first" ).attr( "data-num" );

  // make an ajax call to get our songs from the database
  $.ajax({
    url: "/rooms/" + roomID + "/songs",
    type: "get",
    dataType: "json",
    context: this
  }).then( displaySongs );

  // set the first timer to move to the next song
  window.setTimeout( nextSong, 5000 );
});

function displaySongs( songs ) {
  // TODO -- preventing duplicates: var playedSongs = [];

  for( i = 0; i < songs.length; i++ ) {
    // TODO -- preventing duplicates playedSongs.push( songs[i].name );

    // display a special design for the first (current) song
    if ( i == 0 )  {
      displaySpotifyWidget( songs[0].spotify_url );
    }
    // subsequent songs just get listed in ordinary form
    else {
      $( '#playlist' ).append(
      '<li id=' + songs[i].spotify_url + ' data-length=' + songs[i].length + '>' + songs[i].name + ' by ' + songs[i].artist + '</li>');
    }
  }
}

// generates a Spotify Widget for the song at a given URL
function displaySpotifyWidget( song_url ) {
  $( '#playlist' ).prepend(
    '<iframe src="' +
    'https://embed.spotify.com/?uri=' + song_url + '"' + 'width="300" height="80" frameborder="0" allowtransparency="true"></iframe>');
}

// updates the Spotify Widget with a new URL
function updateSpotifyWidget( song_url ) {
  newURL = 'https://embed.spotify.com/?uri=' + song_url;
  $( 'li:first' ).attr( 'src', newURL );
}

// moves on to the next song and sets the next timer
function nextSong() {
  // if there are more songs, play the next one
  if ( $( 'li' ).length > 0 ) {
    $( 'iframe:first' ).remove();
    displaySpotifyWidget( $( 'li:first' ).attr( 'id' ) );
    $( 'li:first' ).remove();
  }

  window.setTimeout( nextSong, 5000 );
}
