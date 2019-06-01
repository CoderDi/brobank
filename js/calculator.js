function numSpacing(num) {
  return String(parseInt(num)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
}

function format(digits){
  var value=this;
  if(typeof digits!='undefined'){
    return parseFloat(value).toFixed(digits).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g,'$1 ')
  }
  return parseFloat(value).toLocaleString()
}
Number.prototype.format=format;
String.prototype.format=format;

function normaleNum(num) {
  return parseFloat(num.replace(' ', ''));
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


  function uiSlider(selector) {
    $(selector).each(function (i, b) {
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
  }


  var purchaseCount = 1,
      newId;
  $(".purchase__list").on("click",".purchase-add", function() {
    purchaseCount++;
    newId = "purchase" + purchaseCount;
    var selector = '#' + newId + ' .input-slider';
    $(purchaseBlock).clone().appendTo(".purchase__list")
      .attr("id", newId)
      .find(".purchase__caption span").text(purchaseCount);
    
    uiSlider(selector);
    console.log($(".purchase").length);

    var scTop = $('#' + newId).offset().top - 100;
    console.log(scTop);
    $("html, body").animate({scrollTop: scTop})
  });
  $(".purchase__list").on("click",".purchase-remove", function(){
    purchaseCount--;
    newId = "purchase" + purchaseCount;
    var scTop = $('#' + newId).offset().top - 100;
    console.log(scTop);
    $("html, body").animate({scrollTop: scTop})
    $(this).parents(".purchase").remove();
  });

  var purchaseBlock = $("#purchase1").clone(true);
  uiSlider('.input-slider');
  
  



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

      case "credit":
        var creditPercents = normaleNum($(then).find(".js-percents").val()),
            creditPeriod = normaleNum($(then).find(".js-period").val()),
            creditMethod = normaleNum($(then).find("input[name='method']:checked").val()),
            creditDateStart = $(then).find("select[name='month']").val() + '.' + $(then).find("select[name='year']").val(),
            creditVidPay = $(then).find("input[name='vid-pay']:checked").val();
        if (creditMethod == 0) {
          var creditSumm = normaleNum($(then).find(".js-credit-summ").val());
          calcCreditSumm(creditSumm,creditPercents,creditPeriod,creditDateStart,creditVidPay)
        } else if (creditMethod == 1) {
          var creditPurchaseSumm = normaleNum($(then).find(".js-purchase-summ").val()),
              creditInitialPay = normaleNum($(then).find(".js-initial-pay").val());
          $('.calccredit_diff').text(numSpacing(creditPurchaseSumm - creditInitialPay)); 
          calcCreditSumm(creditPurchaseSumm - creditInitialPay,creditPercents,creditPeriod,creditDateStart,creditVidPay);
        }
        $('.js-periodPay').text(numSpacing(creditPeriod) + " мес."); 
          
        break;

      case "zaym":
        var zaymSumm = normaleNum($(then).find(".js-zaym-summ").val()),
            zaymPeriod = normaleNum($(then).find(".js-zaym-period").val()),
            zaymPercent = normaleNum($(then).find(".js-zaym-percent").val()),
            zaymDateStart = $(then).find("select[name='month']").val() + '.' + $(then).find("select[name='day']").val();
        calcZaym(zaymSumm,zaymPeriod,zaymPercent,zaymDateStart);
        break;
      
      case "refin":
        var refinSumm = normaleNum($(then).find(".js-credit-summ").val()), 
            refinPeriod = normaleNum($(then).find(".js-period").val()), 
            refinPercent = normaleNum($(then).find(".js-percents").val()), 
            refinPercentNew = normaleNum($(then).find(".js-percents-new").val()), 
            refinType = normaleNum($(then).find("input[name='method']:checked").val());
        if (refinType == 0) {
          $(".calculator__res-line0").hide();
          $(".calculator__res-line1").show();
        } else {
          $(".calculator__res-line1").hide();
          $(".calculator__res-line0").show();
        }

        calcRefin(refinSumm,refinPeriod,refinPercent,refinPercentNew,refinType)
        break;
      
      default:
        return;
    }
  });

  /*Calculators*/
  function formatMoney(money, bool) {
    var format  = String(money);
    format = format.replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g,"\$1 ");
    if (bool) {
      return format
    } else {
      return format + ' ₽';;
    }
  }


  function calcCardMinAmount(cardMinAmount,cardCreditSumm,cardMaxLimit,cardPercents) {
    
  }

  function calcCardMonthAmount(cardMonthAmount,cardCreditSumm,cardMaxLimit,cardPercents) {
    
  }
  
  function calcCardYourPeriod(cardYourPeriod,cardCreditSumm,cardMaxLimit,cardPercents) {
    
  }

  // Калькулятор кредита
  function calcCreditSumm(creditSumm,creditPercents,creditPeriod,creditDateStart,creditVidPay) {
    function calcPay(sum, percent, month,  date, type) {
      var calcValue = {};
      calcValue.data = {
        percent:Number(percent/1200),
        inputSum: Number(sum),
        inputMonth: Number(month),
        typeCalc: Number(type),
        date: date
      }
      
      if(calcValue.data.typeCalc == 0) {
        calcValue.monthPay = calcValue.data.inputSum * (calcValue.data.percent + calcValue.data.percent /
          (Math.pow((1 + calcValue.data.percent), calcValue.data.inputMonth) - 1)); // платеж в месяц
        calcValue.totalPay = calcValue.monthPay * calcValue.data.inputMonth;
      } else {
        calcValue.mainPay = calcValue.data.inputSum/calcValue.data.inputMonth;
        calcValue.totalPay = 0;
        for(var i = 1;i<calcValue.data.inputMonth+1;i++){
          calcValue.totalPay = calcValue.totalPay +
            decreasingMonthPay(i, calcValue.data.inputSum, calcValue.data.inputMonth,calcValue.data.percent);
        }
        calcValue.totalPay = calcValue.totalPay + calcValue.data.inputSum;
      }

      calcValue.morePay = calcValue.totalPay-(calcValue.data.inputSum);
      calcValue.overPay = calcValue.morePay/calcValue.data.inputSum*100;

      return calcValue
    }
    //отрисовка значений
    function showValue(data) {
      if(data.data.typeCalc == 0) {
          $('.js-monthPay').text(formatMoney( Math.round(data.monthPay)) );
      }
      else
          $('.js-monthPay').text('от '+formatMoney( Math.round(data.mainPay) ));

      $('.js-totalPay').text(formatMoney( Math.round(data.totalPay)) );
      $('.js-morePay').text(formatMoney( Math.round(data.morePay)) );
    }
    //герерация таблицы
    function generateTable(info) {
      var remTotal = info.data.inputSum,
          remDebt = info.data.inputSum,
          payPercent,paySum,monthPay,pp = 0,
          currDate = new Date("01." + info.data.date);

      $('.grafik__table table').remove();
      $(".grafik").show();


      var table = '<table>' +
          '<tr>' +
          '<th>№, Месяц</th>' +
          '<th><span class="th-desktop">Сумма платежа</span><span class="th-mobile">Платеж</span></th>' +
          '<th>Проценты + долг</th>' +
          '<th>Остаток долга</th>' +
          '</tr>';

      for(var i = 1; i<info.data.inputMonth+1;i++){
        if(info.data.typeCalc == 0) {
            monthPay = info.monthPay;
            payPercent = remDebt * info.data.percent;
            paySum = monthPay-payPercent;
            remDebt = remDebt-paySum;
        }
        else {
            payPercent = decreasingMonthPay(i, remDebt, info.data.inputMonth,info.data.percent);
            monthPay = info.mainPay + payPercent;
            paySum = info.mainPay;
        }
        remTotal= remTotal-paySum;
        currDate.setMonth(currDate.getMonth() + 1);

        var row = '';
        row += '<tr>' +
          '<td>' + i + '. ' + formatDate(currDate)+'</td>'+
          '<td>' +
          '<span class="td-desktop">'+formatMoney( Math.round(monthPay),true )+'</span>' +
          '<span class="td-mobile">'+formatMoney( Math.round(payPercent),true )+ ' + ' +
          formatMoney( Math.round(paySum),true ) + '</span>' +
          '</td>' +
          '<td>' +formatMoney( Math.round(payPercent),true )+ ' + ' +
          formatMoney( Math.round(paySum),true ) + '</td>'+
          '<td>'+formatMoney( Math.round(remTotal),true )+'</td>'+
        '</tr>';
        table += row;
      }
      table +='</table>';
      $('.grafik__table').html(table);
    }
    function decreasingMonthPay(number,sum,month,percent) {
      return (sum - (number-1)* (sum/month))*percent;
    }
    function formatDate(date) {
      var dd = date.getDate();
      if (dd < 10) dd = '0' + dd;
      var mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;
      var yy = date.getFullYear();
      return dd + '.' + mm + '.' + yy;
    }
    
    showValue(calcPay(creditSumm,creditPercents,creditPeriod,creditDateStart,creditVidPay));
    generateTable(calcPay(creditSumm,creditPercents,creditPeriod,creditDateStart,creditVidPay));
  }  

  // Калькулятор займа
  function calcZaym(zaymSumm,zaymPeriod,zaymPercent,zaymDateStart) {
    var now = new Date(zaymDateStart),
        result1 = zaymSumm,
        result2 = zaymSumm+(zaymSumm/100*zaymPercent*zaymPeriod),
        date = new Date(+now+(zaymPeriod*86400*1000)),
        d = date.getDate(),
        m = date.getMonth()+1,
        y = new Date().getFullYear();

    if (d < 10) d = '0'+d;
    if (m < 10) m = '0'+m;

    var result3 = d+'.'+m+'.'+y,
        result4 = zaymPeriod;

    switch (result4 % 10) {
      case 1:
        if (result4 == 11) {
          result4 += " дней";
        } else {
          result4 += " день";
        }
        break;
      case 2:
      case 3:
      case 4:
        if ((result4 > 10)&((result4 < 15))) {
          result4 += " дней";
        } else {
          result4 += " дня";
        }
        break;
      default:
        result4 += " дней";
        break;
    }
    // Вывод
    $('.calczaim_result1').text(result1.format()+' ₽'); // Вы берете
    $('.calczaim_result2').text(result2.format()+' ₽'); // Отдаете
    $('.calczaim_result3').text(result3);                  // Вернуть до
    $('.calczaim_result4').text(result4); 
  }

  // Калькулятор рефинансирования
  function calcRefin(refinSumm,refinPeriod,refinPercent,refinPercentNew,refinType) {
    var debt = refinSumm,
        years = refinPeriod,
        rate = refinPercent,
        rateRefin = refinPercentNew,
        period = years,
        k = rate / 100 / 12,
        kAnnyit = k * Math.pow((1 + k), period) / (Math.pow((1 + k), period) - 1),
        monthlyPayment = kAnnyit * debt,
        overpayment = monthlyPayment * period - debt,
        periodRefin = null,
        kRefin = rateRefin / 100 / 12,
        kAnnyitRefin = null,
        monthlyPaymentRefin = null,
        overpaymentRefin = null,
        yearsDecrease = 0;
  
    if (refinType == 1) {
      kAnnyitRefin = kRefin * Math.pow((1 + kRefin), period) / (Math.pow((1 + kRefin), period) - 1);
      monthlyPaymentRefin = kAnnyitRefin * debt;
      overpaymentRefin = monthlyPaymentRefin * period - debt;
    }

    if (refinType == 0) {
      monthlyPaymentRefin = monthlyPayment;
      periodRefin = Math.log(monthlyPaymentRefin / (monthlyPaymentRefin - debt * kRefin)) / Math.log(kRefin + 1);
      overpaymentRefin = monthlyPaymentRefin * periodRefin - debt;
      yearsDecrease = (period - periodRefin) ;
    }

    var overpaymentDecrease = overpayment - overpaymentRefin,
        monthlyPaymentDecrease = monthlyPayment - monthlyPaymentRefin;

    $('.js-monthly-payment').text(formatMoney( Math.round(monthlyPaymentRefin)) );
    $('.js-overpayment').text(formatMoney( Math.round(overpaymentRefin)) );
    $('.js-overpayment-decrease').text(formatMoney( Math.round(overpaymentDecrease)) );
    $('.js-years-decrease').text(Math.round(yearsDecrease) + ' мес.' );
    $('.js-montlypay-decrease').text(formatMoney(Math.round(monthlyPaymentDecrease)));
  }



});