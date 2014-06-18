$( document ).ready( function() {
  var song_length;

  // $.noConflict();
  getSongList();
  setUpSubmitButton();
  setUpNextSongTimer();
  setUpSkipButton();

  // set up the background video, default to Norah Jones
  videoId = '-bAJM3vGl5M';
  //media query: if screen is at least this large, play video
  if (window.matchMedia("screen and (min-width: 450px)").matches) {
    $('#content').tubular( {videoId: '-bAJM3vGl5M'} );
  };
  // $( '.clickable' ).click();
});


// function debug() {

// }

// make an ajax call to get our songs from the database
function getSongList() {
  $.ajax({
    url: "/rooms/" + $( 'h1:first' ).attr( 'data-num' ) + "/playlist",
    type: "get",
    dataType: "json",
    context: this
  }).then( displaySongs );
}

function displaySongs( response ) {
  for( i = 0; i < response["requests"].length; i++ ) {
    // display a special design for the first (current) song
    if ( i === 0 )  {
      displaySpotifyWidget( response["requests"][0].song.spotify_url );
    }
    // subsequent songs just get listed in ordinary form
    else {
      displaySong( response["requests"][i].song );
    }
  }
}

// generates a Spotify Widget for the song at a given URL
function displaySpotifyWidget( song_url ) {
  getCurrentSongInfoForBackground( song_url );
  // debugger
  $( '#playlist' ).prepend(
    '<iframe src="' +
    'https://embed.spotify.com/?uri=spotify:track:' + song_url + '"' + 'id="' + song_url +'"' + 'width="320" height="380" frameborder="0" allowtransparency="true"></iframe>');
}

// updates the Spotify Widget with a new URL
function updateSpotifyWidget( song_url ) {
  newURL = 'https://embed.spotify.com/?uri=spotify:track:' + song_url;
  $( 'li:first' ).attr( 'src', newURL );
}

// moves on to the next song and sets the next timer
function nextSong() {
  // if there are more songs, play the next one
  if ( nextSongExists() ) {
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
        album_art: res.tracks.items[0].album.images[0].url
      }
    },
    context: this
  }).then( displaySong );
}

function displaySong( song ) {
  var songTitle = (song.name + " by " + song.artist);

  if ( songTitle.length > 30 ) {
    songTitle = songTitle.substring(0,27) + '...';
  }

  if ( $( '#playlist' ).children().length === 0 ) {
    // location.replace( 'spotify:track:' + song.spotify_url )
    displaySpotifyWidget( song.spotify_url );
  } else {
    $( '#playlist' ).append(
    "<li id=" + song.spotify_url + " class='playlist-item'" + " data-length=" + song.length + "><img src='http://placehold.it/40x40' class='album-art'><div class='song-title'>" + songTitle + "</div><div class='vote'>+1</div></li>");
  }

  song_length = song.length;
}

function setUpNextSongTimer() {
  if ( nextSongExists() ) {
    window.setTimeout( nextSong, song_length );
  }
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
        album_art: resTrack.items[0].album.images[0].url
      }
    },
    context: this
  }).then( displaySong );
}

function getCurrentSongInfoForBackground( spotifyID ) {
  $.ajax({
        url: "https://api.spotify.com/v1/tracks/" + spotifyID,
      type: 'get',
      dataType: 'json',
      context: this
    }).then( getBackgroundImageURL );
}

function getBackgroundImageURL( res ) {
  name = res.name;
  artist = res.artists[0].name;
  query = escape( name ) + "+" + escape( artist ) + "+live";
  url = "https://gdata.youtube.com/feeds/api/videos?q=" + query + "&alt=json";

  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    context: this
  }).then( changeBackgroundImageURL );
}

function changeBackgroundImageURL( res ) {
  path = res.feed.entry[0].id.$t;
  id = path.substring( path.indexOf( '/videos/' ) + 8 );
  replaceBackgroundByID( id );
}

function replaceBackgroundByID( youtubeID ) {
  player = $( '#tubular-player' );
  oldSRC = player.attr( 'src' );

  front = oldSRC.substring( 0, oldSRC.indexOf( '/embed/' ) + 7);
  back = oldSRC.substring( oldSRC.indexOf( '?' ) );

  newSRC = front + youtubeID + back
  player.attr( 'src', newSRC );
}

function setUpSkipButton() {
  $( '#skip-button' ).click( function() {
    if ( $( '#playlist' ).children().length > 1 ) {
      nextSong();
    }
  });
}

// function setUpMuteButton() {
//   $('#content').tubular( { mute: false } );
// }

// indicates whether there is a next song queued up
function nextSongExists() {
  return $( '#playlist' ).children().length > 1;
}
