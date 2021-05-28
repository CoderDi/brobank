$(document).ready(function () {
  function windowsSlider() {
    if (window.innerWidth <= 1170) {
      $(".js-bc-plashes").addClass("slider");
      if (($(".js-bc-plashes").length != 0) && !($(".js-bc-plashes").hasClass("slick-slider"))) {
        $(".js-bc-plashes").slick({
          dots: false,
          arrows: false,
          variableWidth: true,
          infinite: false,
          slidesToShow: 4,
          responsive: [
            {
              breakpoint: 900,
              settings: {
                slidesToShow: 3,
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 5,
              }
            },
            {
              breakpoint: 620,
              settings: {
                slidesToShow: 4,
              }
            },
            {
              breakpoint: 500,
              settings: {
                slidesToShow: 3,
              }
            },
            {
              breakpoint: 380,
              settings: {
                slidesToShow: 2,
              }
            }
          ]
        });
      }
    } else {
      $(".js-bc-plashes").removeClass("slider");
      if (($(".js-bc-plashes").length != 0) && ($(".js-bc-plashes").hasClass("slick-slider"))){
        $(".js-bc-plashes").slick('unslick');
      }
    }

  }
  windowsSlider();
  $(window).resize(function(){
    windowsSlider();
  });

  $(".js-city-choise").click(function(){
    $(".popup-block").hide();
    $("#popup-city").show();
    $(".popup").addClass("popup--show");
  });




});