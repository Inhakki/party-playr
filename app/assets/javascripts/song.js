$( document ).ready( function() {
  // set up the background video, default to Norah Jones
  videoId = '-bAJM3vGl5M';

  //media query: if screen is at least this large, play video
  if (window.matchMedia("screen and (min-width: 450px)").matches) {
    $( '#content' ).tubular( {videoId: '-bAJM3vGl5M'} );
  }
});

$( '.rooms.show' ).ready( function() {
  var songTimer;
  var songLengths = [];

  var refreshFunction = function() {
    refreshSongs();
    refreshHistory();
  }
  var refreshTimer = window.setInterval( refreshFunction, 5000);

  getSongList();
  getHistory();
  setUpSubmitButton();
  setUpSkipButton();
  window.setTimeout( activateFirstSong, 2000 );
  hidePlayButton();
  mobileFormat();
  turnOffFormEnter();

  function hidePlayButton() {
    $( '.tubular-play' ).hide();
  }

  function mobileFormat() {
    if ( !window.matchMedia( 'screen and (min-width: 450px)' ).matches ) {
      $( '#content' ).css( 'margin', '0px' );
      $( '#content' ).css( 'padding', '0px' );
      $( '#content' ).css( 'width', '100%' );
      $( '.slide-out-div' ).css( 'margin-top', '0px' );
    }
  }

  // function bindUpVote() {
  //   var votes = $( '.vote' )
  //   votes.on( 'click', function() {
  //     var $request = $( this ).parent();
  //     $.ajax({
  //       url: '/requests/upvote/' + $request.attr( 'data-request'),
  //       type: 'post',
  //       dataType: 'json'
  //       //don't need to send any data...just love-tapping controller
  //     });
  //     refreshFunction();
  //   });
  // }

  function turnOffFormEnter() {
    $( '#add-song' ).bind( 'keyup keypress' , function( e ) {
      var code = e.keyCode || e.which;
      if (code === 13) {
        e.preventDefault();
        return false;
      }
    });
  }

  // make an ajax call to get our songs from the database
  function getSongList() {
    $.ajax({
      url: "/rooms/" + $( 'h1:first' ).attr( 'data-num' ) + "/playlist",
      type: "get",
      dataType: "json",
      context: this
    }).then( displaySongs );
  }

  function refreshSongs() {
    $.ajax({
      url: "/rooms/" + $( 'h1:first' ).attr( 'data-num' ) + "/playlist",
      type: "get",
      dataType: "json",
      context: this
    }).then( refreshPlaylist );
  }

  function refreshHistory() {
    $.ajax({
      url: "/rooms/" + $( 'h1:first' ).attr( 'data-num' ) + "/history",
      type: "get",
      dataType: "json",
      context: this
    }).then( refreshHistorySongs );
  }

  function refreshSongsIncludingFirst() {
    $.ajax({
      url: "/rooms/" + $( 'h1:first' ).attr( 'data-num' ) + "/playlist",
      type: "get",
      dataType: "json",
      context: this
    }).then( refreshPlaylistIncludingFirst );
  }

  function refreshPlaylistIncludingFirst( response ) {
    for( var i = 0, n = response["requests"].length; i < n; i++ ) {
      // add the song to the list

      displaySong( response["requests"][i].song,  response["requests"][i].id, response["requests"][i].upvotes );

      // save the length of each song
      songLengths.push( response["requests"][i].song.length );
    }

    window.setTimeout( activateFirstSong, 2000 );
  };

  function refreshPlaylist( response ) {
    var toDelete = $( '#playlist li:not(:first)' );

    // if there is a song playing, preserve its length
    if ( songLengths.length !== 0 ) {
      var nowPlayingLength = songLengths[0];
      songLengths = [];
      songLengths.push( nowPlayingLength );
    }

    toDelete.remove();

    for( var i = 1, n = response["requests"].length; i < n; i++ ) {
      // add the song to the list
      displaySong( response["requests"][i].song,  response["requests"][i].id, response["requests"][i].upvotes );

      // save the length of each song
      songLengths.push( response["requests"][i].song.length );
    }

    // window.setTimeout( bindUpVote, 1000 );
  }

  function refreshHistorySongs( response ) {
    $( "#already-played-songs li" ).remove();

    for( var i = 0, n = response["requests"].length; i < n; i++ ) {
      // add the song to the list
      displayPlayedSong( response["requests"][i].song,  response["requests"][i].id );
    }
  }

  function getHistory() {
    $.ajax({
      url: "/rooms/" + $( 'h1:first' ).attr( 'data-num' ) + "/history",
      type: "get",
      dataType: "json",
      context: this
    }).then( displayHistory );
  }

  function displaySongs( response ) {

    for( var i = 0, n = response["requests"].length; i < n; i++ ) {
      // add the song to the list

      displaySong( response["requests"][i].song,  response["requests"][i].id, response["requests"][i].upvotes );
      // save the length of each song
      songLengths.push( response["requests"][i].song.length );
    }

    // window.setTimeout( bindUpVote, 1000 );
  }

  function displayHistory( response ) {
     for( var i = 0, n = response["requests"].length; i < n; i++ ) {
      // add the song to the list
      displayPlayedSong( response["requests"][i].song );
    }
  }

  // moves on to the next song and sets the next timer
  function nextSong() {
    if ( !window.matchMedia( 'screen and (min-width: 450px)' ).matches ) return;

    if ( $( '#playlist li:first' ).length === 0 ) return;

    $.ajax({
      url: '/rooms/' + $( 'h1:first' ).attr( 'data-num' ) + '/requests/' + $( '#playlist li:first' ).attr( 'data-request'),
      type: 'patch',
      dataType: 'json',
      data: { request: { played: true } }
     });

    // if there are more songs, play the next one
    if ( nextSongExists() ) {
      $( '#playlist' ).children().first().remove();
      songLengths.shift();
      activateFirstSong();

      refreshSongs();
      refreshHistory();
    }
  }

  function progressBar(time) {
    $("#progress-bar").animate({
      height: "15px",
      width: "200px",
  }, time);
}

  function activateFirstSong() {
    if ( songLengths.length === 0 ) return;

    // get the spotify id for the first song
    sid = $( '#playlist li:first' ).attr( 'id' );

    // play the song, update the background, set the next timer
    if ( window.matchMedia( 'screen and (min-width: 450px)' ).matches ) {
      $( '#open' ).attr( 'src', "spotify:track:" + sid );
      getCurrentSongInfoForBackground( sid );
      setUpNextSongTimer();
      progressBar(songLengths[0]);
    }
  }

  function processSong( res ) {
    var spotifyID = res.tracks.items[0].id;

    if ( res.tracks.items.length === 0 ) {
     alert( 'No results found!' );
     return;
    }

    // search document for song with the given ID
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
          album_art: res.tracks.items[0].album.images[1]
        }
      },
      context: this
    }).then( function () {
      if ( songsExist() ) {
        refreshSongs();
        refreshHistory();
      } else {
        refreshSongsIncludingFirst();
        // refreshHistoryIncludingFirst();
      }
    });
  }

  function displaySong( song, requestID, upvotes ) {
    var songTitle = (song.name + " by " + song.artist);

    // cut the title down to size if necessary
    if ( songTitle.length > 30 ) {
      songTitle = songTitle.substring(0,27) + '...';
    }

    var listItemHTML = "<li id='" + song.spotify_url +
    "' class='playlist-item'" + " data-length='" +
    song.length + "' data-request='" + requestID +
    "'><img src='" + song.album_art +
    "' class='album-art'><div class='song-title'>" + songTitle +
    "</div><div class='vote'>+1</div><img id='progress-bar' src='http://placehold.it/1x15'></li>";

    var fn = function() { $( '#playlist' ).append( listItemHTML ); }
    window.setTimeout( fn, 0 );
  }

  function displayPlayedSong( song ) {
    var songTitle = (song.name + " by " + song.artist);

    // cut the title down to size if necessary
    if ( songTitle.length > 30 ) {
      songTitle = songTitle.substring(0,27) + '...';
    }

    var listItemHTML = "<li class='playlist-item'><img src=" + song.album_art + " class='album-art'><div class='song-title'>" + songTitle + "</li>";

    $( '#already-played-songs' ).append( listItemHTML );
  }

  function setUpNextSongTimer() {
    window.clearTimeout( songTimer );
    songTimer = window.setTimeout( nextSong, songLengths[0] );
  }

  function setUpSubmitButton() {
    $( '#add-song' ).submit( function( e ) {
      e.preventDefault();

      searchbox = $( '#song-title-query' );

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

    // if we're adding the first song, we have to refresh all of the songs
    var fn = ( songLengths.length === 0 ) ? refreshSongsIncludingFirst : refreshSongs;

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
          album_art: resTrack.album.images[1].url
        }
      },
      context: this
    }).then( fn );
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
    if ( res.feed.entry ) {
      path = res.feed.entry[0].id.$t;
      id = path.substring( path.indexOf( '/videos/' ) + 8 );
      replaceBackgroundByID( id );
    }
  }

  function replaceBackgroundByID( youtubeID ) {
    fn = function() {
      player.loadVideoById( {'videoId': youtubeID } );
    }
    window.setTimeout( fn, 2000 );
  }

  function setUpSkipButton() {
    $( '#skip-button' ).click( nextSong );
  }

  // indicates whether there is a next song queued up
  function nextSongExists() {
    return ( songLengths.length > 1 );
  }

  // indicates whether there is a next song queued up
  function songsExist() {
    return ( songLengths.length > 0 );
  }
});
