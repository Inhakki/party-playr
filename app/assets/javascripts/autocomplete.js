$( function() {
  var songTitles;
  var last = "";
  var roomID = $( 'h1:first' ).attr( 'data-num' );

  $( '#add-song' ).submit( function( e ) {
    e.preventDefault();

    var query = $( '#song-title-query' ).val().split( ' ' ).join( '+' );

    $.ajax({
      url: "https://ws.spotify.com/search/1/track.json?q=" + query
    }).then( processSong );
  });

  function processSong( res ) {
    if ( $("#" + res.tracks[0].href.replace("spotify:track:", "")).length !== 0 ) {
      alert("Song already exists!");
      return;
    }

    $.ajax({
      url: '/rooms/' + roomID + '/songs',
      type: 'post',
      dataType: 'json',
      data: {
        song: {
          name: res.tracks[0].name,
          artist: res.tracks[0].artists[0].name,
          length: res.tracks[0].length,
          spotify_url: res.tracks[0].href.replace("spotify:track:", ""),
          room_id: roomID
        }
      },
      context: this
    }).then( displaySong );
  }

  function displaySong( song ) {
    $( '#playlist' ).append(
      "<li id=" + song.spotify_url + " class='playlist-item'" + " data-length=" + song.length + ">" + song.name + " by " + song.artist + "</li>");
  }

  $( '#autocomplete-button' ).click( function( e ) {
    if( $( '#song-title-query' ).val() != last) {
      songTitles = [];

      var query = $( '#song-title-query' ).val().split( ' ' ).join( '+' );

      $.ajax({
        url: "https://ws.spotify.com/search/1/track.json?q=" + query,
        context: document.body
      }).then( function ( res ) {
        for ( var i = 0; i < 100; i++ ) {
          songTitles.push( res.tracks[i].name );
        }

        var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });

    cb(matches);
  };
};

        $( '#song-title-query' ).typeahead(null, {
          name: 'songTitles',
          displayKey: 'value',
          source: substringMatcher(songTitles)
        });
      });
    }

    last = $( '#song-title-query' ).val();

  });
});

