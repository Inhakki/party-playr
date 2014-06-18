$( '.rooms.show' ).ready(function() {
      var scroll_to = $("#already-played-songs").offset().top + $("#already-played-songs").height() + 200;

    $( "#graveyard" ).on("click", function() {
      $( "#already-played-songs" ).slideToggle();
       $( "body" ).animate({
           scrollTop: scroll_to
       }, 1000);
    });

  $('.move').on('click', function(){
    var el = $(this);
    $('.slide-out-div').toggle('slide', {direction: 'left'}, 400);
    el.text() == el.data("text-swap") ? el.text(el.data("text-original")) : el.text(el.data("text-swap"));
  });

});



