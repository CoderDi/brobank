$(document).ready(function(){
  $(".js-experts-slider").slick({
    infinite: false,
    arrows: false,
    speed: 300,
    slidesToShow: 6,
    variableWidth: true
  });

  $(".js-getexpert").on("click", function(){
    $(".popup-block").hide();
    $("#popup-expert").show();
    $(".popup").addClass("popup--show");
  });

  $(".js-getquest").on("click", function(){
    $(".popup-block").hide();
    $("#popup-quest").show();
    $(".popup").addClass("popup--show");
  });

  $(".js-getanswer").on("click", function(){
    $(".popup-block").hide();
    $("#popup-answer").show();
    $(".popup").addClass("popup--show");
  });
});