var song_length;

$( function() {
  getSongList();
  setUpSubmitButton();
  setUpNextSongTimer();
  $('#content').tubular( {videoId: '-bAJM3vGl5M'} );
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
      displaySong( songs[i] );
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
    $( '#playlist iframe:first' ).remove();
    displaySpotifyWidget( $( 'li:first' ).attr( 'id' ) );
    $( '#playlist li:first' ).remove();
  }

  setUpNextSongTimer();
}

function processSong( res ) {

  if ( res.tracks.items.length === 0 ) {
   alert( 'No results found!' );
   return;
  }


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
        // room_id: $( 'h1:first' ).attr( 'data-num' )
      }
    },
    context: this
  }).then( displaySong );
}

function displaySong( song ) {
  var songTitle = (song.name + " by " + song.artist);

  if (songTitle.length > 30) {
    songTitle = songTitle.substring(0,27) + '...';
  }

  $( '#playlist' ).append(
    "<li id=" + song.spotify_url + " class='playlist-item'" + " data-length=" + song.length + "><img src='http://placehold.it/40x40' class='album-art'><div class='song-title'>" + songTitle + "</div><img src='http://www.charbase.com/images/glyph/9651' class='vote'></li>");

    song_length = song.length;
}

function setUpNextSongTimer() {

  window.setTimeout( nextSong, song_length );

}

function setUpSubmitButton() {
  $( '#add-song' ).submit( function( e ) {
    e.preventDefault();

    searchbox = $( '#song-title-query' )

    var query = searchbox.val().split( ' ' ).join( '+' );
    var sid = searchbox.attr( 'data-sid' );

    // if we have an ID for the song, search on that
    if ( sid !== '' ) {
      $.ajax({
        url: "https://api.spotify.com/v1/tracks/" + sid
      }).then( processTrackGet );
    } else {
      $.ajax({
        url: "https://api.spotify.com/v1/search?q=" + query + "&type=track"
      }).then( processSong );
    }

    searchbox.val( '' );
    searchbox.attr( 'data-sid', '' );

  });
}

function processTrackGet( resTrack ) {
  var spotifyID = resTrack.id;

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
        name: resTrack.name,
        artist: resTrack.artists[0].name,
        length: resTrack.duration_ms,
        spotify_url: spotifyID,
        room_id: $( 'h1:first' ).attr( 'data-num' )
      }
    },
    context: this
  }).then( displaySong );
}
