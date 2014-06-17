$( function() {
  getSongList();
  setUpSubmitButton();
  setUpNextSongTimer();
});

// make an ajax call to get our songs from the database
function getSongList() {
  $.ajax({
    url: "/rooms/" + $( 'h1:first' ).attr( 'data-num' ) + "/songs",
    type: "get",
    dataType: "json",
    context: this
  }).then( displaySongs );
}

function displaySongs( songs ) {
  for( i = 0; i < songs.length; i++ ) {
    // display a special design for the first (current) song
    if ( i === 0 )  {
      displaySpotifyWidget( songs[0].spotify_url );
    }
    // subsequent songs just get listed in ordinary form
    else {
      $( '#playlist' ).append(
      "<li id=" + songs[i].spotify_url + " class='playlist-item'" + " data-length=" + songs[i].length + ">" + songs[i].name + " by " + songs[i].artist + "</li>");
    }
  }
}

// generates a Spotify Widget for the song at a given URL
function displaySpotifyWidget( song_url ) {
  $( '#playlist' ).prepend(
    '<iframe src="' +
    'https://embed.spotify.com/?uri=spotify:track:' + song_url + '"' + 'id="' + song_url +'"' + 'width="300" height="80" frameborder="0" allowtransparency="true"></iframe>');
}

// updates the Spotify Widget with a new URL
function updateSpotifyWidget( song_url ) {
  newURL = 'https://embed.spotify.com/?uri=spotify:track:' + song_url;
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

  setUpNextSongTimer();
}

function processSong( res ) {

  var spotifyID = res.tracks.items[0].id;

  if ( $( '#' + spotifyID ).length !== 0 ) {
     alert( 'Song already exists!' );
     return;
  }

  $.ajax({
    url: '/rooms/' + $( 'h1:first' ).attr( 'data-num' ) + '/songs',
    type: 'post',
    dataType: 'json',
    data: {
      song: {
        name: res.tracks.items[0].name,
        artist: res.tracks.items[0].artists[0].name,
        length: res.tracks.items[0].duration_ms,
        spotify_url: spotifyID,
        room_id: $( 'h1:first' ).attr( 'data-num' )
      }
    },
    context: this
  }).then( displaySong );
}

function displaySong( song ) {
  $( '#playlist' ).append(
    "<li id=" + song.spotify_url + " class='playlist-item'" + " data-length=" + song.length + ">" + song.name + " by " + song.artist + "</li>");
debugger
}

function setUpNextSongTimer() {
  //window.setTimeout( nextSong, 8000 );
}

function setUpSubmitButton() {
  $( '#add-song' ).submit( function( e ) {
    e.preventDefault();

    var query = $( '#song-title-query' ).val().split( ' ' ).join( '+' );

    $.ajax({
      // url: "https://ws.spotify.com/search/1/track.json?q=" + query 
      url: "https://api.spotify.com/v1/search?q=" + query + "&type=track"
    }).then( processSong );
  });
}
