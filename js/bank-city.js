$(document).ready(function () {
  $(".js-bc-plashes").slick({
    dots: false,
    arrows: false,
    variableWidth: true,
    infinite: false,
    responsive: [
      {
        breakpoint: 980,
        settings: {
          arrows: false
        }
      }
    ]
  });

  $(".js-city-choise").click(function(){
    $(".popup-block").hide();
    $("#popup-city").show();
    $(".popup").addClass("popup--show");
  });




});