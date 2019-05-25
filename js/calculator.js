function numSpacing(num) {
  return String(parseInt(num)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
}

function initSelectDate() {
  if ($("#day").length > 0) {
    var day = new Date,
          md = (new Date(day.getFullYear(), day.getMonth() + 1, 0, 0, 0, 0, 0)).getDate(),
          $month_name = "января февраля марта апреля мая июня июля августа сентября октября ноября декабря".split(" ");

      function set_select(a, c, d, e) {
          var el = document.getElementsByName(a)[0];
          for (var b = el.options.length = 0; b < c; b++) {
              el.options[b] = new Option(a == 'month' ? $month_name[b] : b + d, b + d);
          }
          el.options[e] && (el.options[e].selected = !0)
      }
      set_select("day", md, 1, day.getDate() - 1);
      set_select("month", 12, 1, day.getMonth());
      
      
      var month = document.getElementById("month");

      function check_date() {
          var a = 0,
              c = month.value | 0;
          md = (new Date(a, c, 0, 0, 0, 0, 0)).getDate();
          a = document.getElementById("day").selectedIndex;
          set_select("day", md, 1, a)
      };

      if (document.addEventListener) {
          month.addEventListener('change', check_date, false);

      } else {
          month.detachEvent('onchange', check_date);
      }
    }
}

$(document).ready(function () {
  
  initSelectDate();

  $(".calculator__method-pay").click(function(){
    $(this).parent(".calculator__flex").find(".calculator__method-pay").removeClass("calculator__method-pay--active");
    $(this).addClass("calculator__method-pay--active");
    var method = $(this).find("input").val();
    console.log(method);
    if (!($(this).hasClass("calculator__method-pay--radio"))) {
      $(this).parents(".calculator__form").find(".calculator__line_change").hide();
      $(this).parents(".calculator__form").find(".calculator__line_" + method).show();
    }    
  });

  $(".calculator__select").click(function(){
    $(this).toggleClass("calculator__select--active");
  });
  $(".calculator__select").focusout(function(){
    $(this).removeClass("calculator__select--active");
  });

  $('.input-slider').each(function (i, b) {
    var max = $(b).data('max'), 
        min = $(b).data('min'), 
        suffix = $(b).data('suffix'),
        value = $(b).data('value'),
        step = $(b).data('step'),
        parent = $(b).parents('.calculator__block'),
        input = $('.calculator__input', parent);
    if (!(suffix)) {
      suffix = '';
    }
    $(b).slider({
      animate: "slow",
      range: "min",
      min: min,
      max: max,
      step: step,
      value: value,
      slide : function(event, ui) {    
        input.val(numSpacing(ui.value) + ' ' + suffix);       
      }
    });
  
    input.val(numSpacing(value) + ' ' + suffix);
  });



  $(".js-calculate").click(function(){
    //Определяем тип калькулятора
    var then = $(this).parents(".calculator__form");
    var calcType = $(then).data("type");
    console.log("calcType = " + calcType);

    switch (calcType) {
      case "card":
        var cardPercents = $(then).find(".js-percents").val(),
            cardMaxLimit = $(then).find(".js-max-limit").val(),
            cardCreditSumm = $(then).find(".js-credit-summ").val(),
            cardMethod = $(then).find("input[name='method']:checked").val();
        console.log("cardMethod = " + cardMethod);
        if (cardMethod == 0) {
          var cardMinAmount = $(then).find(".js-min-amount").val();
          calcCardMinAmount(cardMinAmount,cardCreditSumm,cardMaxLimit,cardPercents);
        } else if (cardMethod == 1) {
          var cardMonthAmount = $(then).find(".js-month-amount").val();
          calcCardMonthAmount(cardMonthAmount,cardCreditSumm,cardMaxLimit,cardPercents);
        } else {
          var cardYourPeriod = $(then).find(".js-your-period").val();
          calcCardYourPeriod(cardYourPeriod,cardCreditSumm,cardMaxLimit,cardPercents);
        }
        break;
      
      default:
        return;
    }
  });

  /*Calculators*/
  function calcCardMinAmount(cardMinAmount,cardCreditSumm,cardMaxLimit,cardPercents) {
    
  }

  function calcCardMonthAmount(cardMonthAmount,cardCreditSumm,cardMaxLimit,cardPercents) {
    
  }
  function calcCardYourPeriod(cardYourPeriod,cardCreditSumm,cardMaxLimit,cardPercents) {
    
  }



});