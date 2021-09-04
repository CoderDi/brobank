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


});