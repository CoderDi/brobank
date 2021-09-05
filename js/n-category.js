$(document).ready(function () {
  $(".js-category-card-toggle").on("click", function(){
    $(this).parents(".n-category-card").find(".js-category-card-toggle").toggleClass("active");
    $(this).parents(".n-category-card").find(".n-category-card-more").slideToggle(200)
    $("html, body").animate({scrollTop:  $(this).parents(".n-category-card").find(".n-category-card-more").offset().top});
  });

  $(".js-category-card-calc").on("click", function(){
    $("#popupCalc").addClass("popup--show");
    
  $("#limit-content").css("height", $("#limitem1").outerHeight());
  });

  $(".top__text-more").on("click", function(){
    $(this).hide().parents(".top__text").addClass("active")
  });


  $(document).scroll(function(){
    var w;
    if ($(this).scrollTop() >= $("#offerLink").offset().top - $(window).height()) {
      w = ($(this).scrollTop() - $("#offerLink").offset().top + $(window).height()) / $(window).height() * 100;
      $("#offerLink").css("width", w + "%");
    }

    if ($(this).scrollTop() >= $("#offerLink").offset().top) {
      document.location.href = $("#offerLink").attr('href');
    }
  })

  $(".s-item__top-empty").on("click", function(){
    $("#popupSravnenie").addClass("popup--show")
  });
  $(".js-popup-close").on("click", function(){
    $(".popup").removeClass("popup--show");
  });
  $(window).scroll(function(){
    if ($(".sravnenie").length > 0) {
      if ($(window).scrollTop() > ($(".sravnenie").offset().top + $(".s-item__top").height())) {
        $(".s-item--fixed").addClass("s-item--fixed--show");
      } else {
        $(".s-item--fixed").removeClass("s-item--fixed--show");
      }
    }

    if ($(window).scrollTop() > 0) {
      $(".header-fixed").addClass("header-fixed-scroll");
    } else {
      $(".header-fixed").removeClass("header-fixed-scroll");
    }
  });


});