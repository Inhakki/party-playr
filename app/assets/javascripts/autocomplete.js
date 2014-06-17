$( function() {
  // var songTitles;
  // var last = "";
  // var roomID = $( 'h1:first' ).attr( 'data-num' );

  $( "#song-title-query" ).autocomplete({
    source: function( request, response ) {
      var query = $( '#song-title-query' ).val().split( ' ' ).join( '+' );
      $.ajax({
        url: "https://api.spotify.com/v1/search?q=" + query + "&type=track",
        dataType: "json",

        success: function( data ) {
          response( $.map( data.tracks.items, function( track ) {
            return { label: track.name, value: track.name, sid: track.id }
          }));
        }
      });
    },
    minLength: 2,
    select: function( event, ui ) {
      if ( ui.item ) {
        $( "#song-title-query" ).attr( 'data-sid' , ui.item.sid );
        $( '#add-song' ).submit();
      }

      searchbox = $( '#song-title-query' );
      searchbox.val( '' );
      searchbox.attr( 'data-sid', '' );
      return false;

      // console.log( ui.item ?
      //   "Selected: " +  ui.item.sid :
      //   "Nothing selected, input was " + this.value
      //   );
    },
    open: function() {
      $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
      $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  });
});


//   $( '#autocomplete-button' ).click( function( e ) {
//     if( $( '#song-title-query' ).val() != last) {
//       songTitles = [];

//       var query = $( '#song-title-query' ).val().split( ' ' ).join( '+' );

//       $.ajax({
//         url: "https://ws.spotify.com/search/1/track.json?q=" + query,
//         context: document.body
//       }).then( function ( res ) {
//         for ( var i = 0; i < 100; i++ ) {
//           songTitles.push( res.tracks[i].name );
//         }

//         var substringMatcher = function(strs) {
//   return function findMatches(q, cb) {
//     var matches, substringRegex;

//     // an array that will be populated with substring matches
//     matches = [];

//     // regex used to determine if a string contains the substring `q`
//     substrRegex = new RegExp(q, 'i');

//     // iterate through the pool of strings and for any string that
//     // contains the substring `q`, add it to the `matches` array
//     $.each(strs, function(i, str) {
//       if (substrRegex.test(str)) {
//         // the typeahead jQuery plugin expects suggestions to a
//         // JavaScript object, refer to typeahead docs for more info
//         matches.push({ value: str });
//       }
//     });

//     cb(matches);
//   };
// };

//         $( '#song-title-query' ).typeahead(null, {
//           name: 'songTitles',
//           displayKey: 'value',
//           source: substringMatcher(songTitles)
//         });
//       });
//     }

//     last = $( '#song-title-query' ).val();

//   });
// });

