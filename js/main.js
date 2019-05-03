$(document).ready(function () {

  $(".js-slider").slick({
    dots: true,
    autoPlay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 980,
        settings: {
          arrows: false
        }
      }
    ]
  });

  $(".butter").click(function(){
    $(this).toggleClass("butter-active");
    $(".mobile").toggleClass("mobile-active");
  });





















  $(".new-carousel__item").css("opacity", "1");


  $(".new-card__rating").each(function(){
    $(this).find(".new-card__rating_line").css("width", parseFloat($(this).find(".new-card__rating_num").text())*20 + 2 + "%");
  });

  $(".js-new-carousel").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 980,
        settings: {
          variableWidth: true,
          arrows: false,
          dots: true,
        }
      }
    ]
  });

  $(".new-slider").slick({
    dots: true
  });

  $(".new-drop__value").click(function(){
    var hasClas = 0;
    if (($(this).parent(".new-drop").hasClass("new-drop--active"))) {
      hasClas = 1;
    } else {
      hasClas = 0;
    }
    $(".new-drop").removeClass("new-drop--active");
    $(".new-search__drops").removeClass("new-search__drops--hide");
    if (!(hasClas)) {
      $(this).parent(".new-drop").addClass("new-drop--active");
      $(this).parents(".new-search__drops").addClass("new-search__drops--hide");
    }
    $(".search--back--btn").removeClass("search--back--btn--hide");
    
  });

  $(document).mouseup(function (e) {
    if ($(window).width() > 768) {
      var container = $(".new-drop");
      if (container.has(e.target).length === 0){
          container.removeClass("new-drop--active");
      }
      var container = $(".s-item__drop");
      if (container.has(e.target).length === 0){
          container.removeClass("s-item__drop--show");
      }
    }
  });



  $(".new-drop__list_item").click(function(){
    $(this).parents(".new-drop").find(".new-drop__value").val($(this).text());
    $(this).parents(".new-drop").removeClass("new-drop--active");
    $(this).parents(".new-search__drops").removeClass("new-search__drops--hide");
    $(".search--back--btn").addClass("search--back--btn--hide");
  });
  $(".search--back--btn").click(function(){
    $(".new-drop").removeClass("new-drop--active");
    $(".new-search__drops").removeClass("new-search__drops--hide");
    $(this).addClass("search--back--btn--hide");
  });

  if ($(".new-calc").length > 0) {
    $("#polzunokSumCredit").slider({
      animate: "slow",
      range: "min",    
      value: 50000,
      min: 1000,
      max: 500000,
      slide : function(event, ui) {    
          $("#sumCredit").val(ui.value);        
      }
    });
    $( "#sumCredit" ).val($( "#polzunokSumCredit" ).slider( "value" )); 

    $("#polzunokSrokCredit").slider({
      animate: "slow",
      range: "min",    
      value: 12,
      min: 1,
      max: 60,
      slide : function(event, ui) {    
          $("#srokCredit").val(ui.value);        
      }
    });
    $( "#srokCredit" ).val($( "#polzunokSrokCredit" ).slider( "value" )); 

    $("#polzunokPercentCredit").slider({
      animate: "slow",
      range: "min",    
      value: 12,
      min: 4,
      max: 30,
      slide : function(event, ui) {    
          $("#percentCredit").val(ui.value);        
      }
    });
    $( "#percentCredit" ).val($( "#polzunokPercentCredit" ).slider( "value" )); 

    $("#polzunokMinCredit").slider({
      animate: "slow",
      range: "min",    
      value: 8,
      min: 1,
      max: 15,
      slide : function(event, ui) {    
          $("#minCredit").val(ui.value);        
      }
    });
    $( "#minCredit" ).val($( "#polzunokMinCredit" ).slider( "value" )); 
  }


  $(".new-search__btn a").click(function(){
    $(".new-search-fixed").addClass("new-search-fixed--show");
  });
  $(".search-fixed-close").click(function(){
    $(".new-search-fixed").removeClass("new-search-fixed--show");
    $(".s-item__drop").removeClass("s-item__drop--show");
  });

  $(window).scroll(function(){
    if ($(".sravnenie").length > 0) {
      if ($(window).scrollTop() > ($(".sravnenie").offset().top + $(".s-item__top").height())) {
        $(".s-item--fixed").addClass("s-item--fixed--show");
      } else {
        $(".s-item--fixed").removeClass("s-item--fixed--show");
      }
    }
  });

  $(".s-item__name").click(function(){
    var elem = $(this).parent(".s-item__top").find(".s-item__drop");
    
    $(elem).css("top", $(this).parent(".s-item__top").find(".s-item__img").height());
    $(elem).addClass("s-item__drop--show");
  });
  $(".s-item__drop_item").click(function(){
    $(this).parents(".s-item__drop").removeClass("s-item__drop--show");
  });


  $("a[href^='#']").click(function(){
    var _href = $(this).attr("href");
    $("html, body").animate({scrollTop: $(_href).offset().top});
    return false;
  });
  
  
  $(function() {
    $("[type=tel]").mask("+7 (999) 999-99-99");
  });



});