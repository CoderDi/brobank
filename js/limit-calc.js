var currentQuestNum = 1,
    questCount = 10,
    scoringOver = 700,
    scoringCurrent = -565,
    totalSumm = $(".limit").data("total");
    infoArray = new Array();


function calculateLimit() {
  $("input:checked").each(function(i, el){
    var text = $(el).parents(".limit-label").find(".hidden_info").text();
    if (text) {
      infoArray.push();
    }
  
    scoringCurrent += parseInt($(el).val());
  });

  if (scoringCurrent <= 0) {
    $("#limitem-sum").text('0 ₽');
    return;
  }

  var format  = String(Math.trunc(scoringCurrent / scoringOver * totalSumm));
  format = format.replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g,"\$1 ");
  
  $("#limitem-sum").text(format + ' ₽');
  
  if (infoArray.length) {
    $("#result-text").text(infoArray[0]);
  }
}


function loadRotate() {
  var temp = "00:00",
      loadSecond = 0,
      secRandom = Math.ceil(Math.random()*3);
  $("#load-time").text(temp);
  var intervalID = setInterval(function() {
    if (loadSecond > secRandom) {
      $(".limitem-load-content").hide();

      calculateLimit();

      $("#limitem-load").css("position", "relative"); 
      $("#limitem-result").show();
      $("#limit-content").css("height", "auto");

      clearInterval(intervalID);
      return;
    }
    loadSecond++;
    if (loadSecond > 9) {
      temp = "00:" + loadSecond;
    } else {
      temp = "00:0" + loadSecond;
    }
    $("#load-time").text(temp);
  }, 1000);
}



$(".js-limit-new").click(function(){
  //возврат всех параметров в исходное значение
  $(".limitem").css("left","100%");
  $("#limitem-load").css("left", "100%");
  $("#limitem-load").css("position", "absolute"); 
  $(".limit-header").show();
  $(".limit-footer").show();
  $(".limitem-load-content").show();
  $("#limitem-result").hide();
  $("#limit-content").css("height", $("#limitem1").outerHeight());
  $(".limit-footer").addClass("limit-footer--first");
  $("#limit-quest").text($("#limitem1 .limitem-quest").text());
  $("#limit-curr-num").text(1);
  $("#limit-line").css("width", "0%");
  $("#limitem1").css("left","0");
  $(".limit-label").find("input:checked").prop('checked',false);
  currentQuestNum = 1;
  scoringCurrent = -565;
  infoArray = new Array();
});


$("#limit-content").css("height", $("#limitem1").outerHeight());

$(".js-limit-prev").click(function(){
  var scTop = $('#limit-calc').offset().top - 100;
  $("html, body").animate({scrollTop: scTop})

  $("#limitem" + currentQuestNum).css("left", "100%");
  currentQuestNum--;
  $("#limit-content").css("height", $("#limitem" + currentQuestNum).outerHeight());
  $("#limitem" + currentQuestNum).css("left", "0");

  if (currentQuestNum == 1) {
    $(this).parents(".limit-footer").addClass("limit-footer--first");
  }

  $("#limit-quest").text($("#limitem" + currentQuestNum + " .limitem-quest").text());
  $("#limit-curr-num").text(currentQuestNum);
  $("#limit-line").css("width", (currentQuestNum / questCount * 100) + "%");
});


$(".js-limit-next").click(function(){
  var scTop = $('#limit-calc').offset().top - 100;
  $("html, body").animate({scrollTop: scTop});

  $("#limitem" + currentQuestNum).css("left", "-100%");
  currentQuestNum++;
  
  if (currentQuestNum > 10) {
    $("#limitem-load").css("left", "0");    
    $("#limit-content").css("height", $("#limitem-load").outerHeight());
    $(".limit-header").hide();
    $(".limit-footer").hide();
    loadRotate();
    return;
  }
  $("#limit-content").css("height", $("#limitem" + currentQuestNum).outerHeight());
  $("#limitem" + currentQuestNum).css("left", "0");
  
  if (currentQuestNum == 2) {
    $(this).parents(".limit-footer").removeClass("limit-footer--first");
  }
  

  $("#limit-quest").text($("#limitem" + currentQuestNum + " .limitem-quest").text());
  $("#limit-curr-num").text(currentQuestNum);
  if ($("#limitem" + currentQuestNum + " input:checked").length) {
    $("#limit-line").css("width", (currentQuestNum / questCount * 100) + "%");
  }
  
});

$(".limit-label").click(function(){
  $("#limit-line").css("width", (currentQuestNum / questCount * 100) + "%");
});



$(".limit-label--openCredit").click(function(){
  $("#limit-label--openCredit").show();
  $("#limit-content").css("height", $("#limitem" + currentQuestNum).outerHeight());
});
$(".limit-label--hideCredit").click(function(){
  $("#limit-label--openCredit").hide();
  $("#limit-label--summCredit").hide();
  $("#limit-label--openCredit").find("input:checked").prop('checked',false);
  $("#limit-content").css("height", $("#limitem" + currentQuestNum).outerHeight());
});
$(".limit-label--showSumm").click(function(){
  $("#limit-label--summCredit").show();
  $("#limit-content").css("height", $("#limitem" + currentQuestNum).outerHeight());
});
$(".limit-label--hideSumm").click(function(){
  $("#limit-label--summCredit").hide();
  $("#limit-content").css("height", $("#limitem" + currentQuestNum).outerHeight());
});

$(".limit-delay-open").click(function(){
  $("#limit-delay").show();
  $("#limit-content").css("height", $("#limitem" + currentQuestNum).outerHeight());
});
$(".limit-delay-hide").click(function(){
  $("#limit-delay").hide();
  $("#limit-content").css("height", $("#limitem" + currentQuestNum).outerHeight());
});

$(".limit-auto-open").click(function(){
  $("#limit-auto").show();
  $("#limit-content").css("height", $("#limitem" + currentQuestNum).outerHeight());
});
$(".limit-auto-hide").click(function(){
  $("#limit-auto").hide();
  $("#limit-content").css("height", $("#limitem" + currentQuestNum).outerHeight());
});