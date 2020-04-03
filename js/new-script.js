$(document).ready(function () {

  $(".f-region__title").click(function(){
    $(".f-cities").not($(this).parent(".f-region").find(".f-cities")).slideUp(200);
    $(".f-region__title").not($(this)).removeClass("active");
    $(this).toggleClass("active");
    $(this).parent(".f-region").find(".f-cities").slideToggle(200);
  });

  $(".f-drop__title").click(function(){
    $(this).parent(".f-drop").toggleClass("active");
  });

  $(".f-drop__item").click(function(){
    $(this).parents(".f-drop").find(".f-drop__title strong").text($(this).text());
    $(this).parents(".f-drop").find(".f-drop__item").removeClass("active");
    $(this).addClass("active");
    $(this).parents(".f-drop").removeClass("active");
  });

  $(".filter-drop__item").click(function(){
    $(this).parents(".filter-item").find(".filter-item__value").val($(this).text());
    $(this).parents(".filter-item").find(".filter-drop__item").removeClass("active");
    $(this).addClass("active");
    $(this).parents(".filter-item").removeClass("active");
  });

  $(".filter-item__top").click(function(){
    $(".filter-item").not($(this).parent(".filter-item")).removeClass("active");
    $(this).parents(".filter-item").toggleClass("active");
  });

  $(".f-ready__link--top").click(function(){
    $(this).parents(".f-ready__item").toggleClass("active");
    $(this).parents(".f-ready__item").find(".f-ready__item_content").slideToggle(200);
  });

  $(".f-rubrics__title").click(function(){
    // $(this).parents(".f-rubrics").toggleClass("active");
    $(this).parents(".f-rubrics").find(".rubrics__list").slideToggle(200);
  });
});