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
    // console.log(method);
    if (!($(this).hasClass("calculator__method-pay--radio"))) {
      $(this).parents(".calculator__form").find(".calculator__line_change").hide();
      $(this).parents(".calculator__form").find(".calculator__line_" + method).show();
    }    
    calculate();
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
          calculate();       
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

    var scTop = $('#' + newId).offset().top - 100;
    $("html, body").animate({scrollTop: scTop})
  });
  $(".purchase__list").on("click",".purchase-remove", function(){
    purchaseCount--;
    newId = "purchase" + purchaseCount;
    var scTop = $('#' + newId).offset().top - 100;
    $("html, body").animate({scrollTop: scTop})
    $(this).parents(".purchase").remove();
  });

  var purchaseBlock = $("#purchase1").clone(true);
  uiSlider('.input-slider');
  
  $(".zaym-checkbox input:checkbox").on("change", function(){
    calculate();
  });

  var clickOrChange = 0;

  function calculate() {
    
    //Определяем тип калькулятора
    var then = $(".calculator__form"),
        calcType = $(then).data("type");
    // console.log("calcType = " + calcType);

    if ((clickOrChange == 0)&((calcType == "zaym")||(calcType == "refin"))) {
      $(".calculator__line--pb30").hide();
      return;
    } else {
      $(".calculator__line--pb30").show();
    }

    switch (calcType) {
      case "card":
        var cardPercents = normaleNum($(then).find(".js-percents").val()),
            cardMaxLimit = normaleNum($(then).find(".js-max-limit").val()),
            cardCreditSumm = normaleNum($(then).find(".js-credit-summ").val()),
            cardMethod = normaleNum($(then).find("input[name='method']:checked").val());
        if (cardCreditSumm > cardMaxLimit) {
          alert('Максимальная сумма кредита не может превышать ' + cardMaxLimit + ' рублей!');
          return;
        }
        if (cardMethod == 0) {
          var cardMinAmount = normaleNum($(then).find(".js-min-amount").val());
          calcCardMinAmount(cardMinAmount,cardCreditSumm,cardMaxLimit,cardPercents);
        } else if (cardMethod == 1) {
          var cardMonthAmount = normaleNum($(then).find(".js-month-amount").val());
          calcCardMonthAmount(cardMonthAmount,cardCreditSumm,cardMaxLimit,cardPercents);
        } else {
          var cardYourPeriod = normaleNum($(then).find(".js-your-period").val());
          calcCardYourPeriod(cardYourPeriod,cardCreditSumm,cardMaxLimit,cardPercents);
        }
        break;

      case "credit":
        var creditPercents = normaleNum($(then).find(".js-percents").val()),
            creditPeriod = normaleNum($(then).find(".js-period").val()),
            creditMethod = normaleNum($(then).find("input[name='method']:checked").val()),
            creditDateStart = '01.' + $(then).find("select[name='month']").val() + '.' + $(then).find("select[name='year']").val(),
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
            zaymDateStart = moment($(then).find("select[name='month']").val() + '.' + $(then).find("select[name='day']").val(),"MM.DD").format("DD.MM.YYYY");
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

      case "rassrochka":
        var rassSumm,
            rassPeriod,
            rassPercent,
            rassDateStart,
            rassArray = new Array();
        
        $(".purchase").each(function (i, b) {
          var arrayOnePurchase = new Array();
          rassSumm = normaleNum($(b).find(".js-rass-summ").val());
          rassPeriod = normaleNum($(b).find(".js-rass-period").val());
          rassPercent = normaleNum($(b).find(".js-rass-percent").val());
          if ($(b).find("select[name='month']").hasClass("hidden")) {
            var arr=[
              'Январь',
              'Февраль',
              'Март',
              'Апрель',
              'Май',
              'Июнь',
              'Июль',
              'Август',
              'Сентябрь',
              'Октябрь',
              'Ноябрь',
              'Декабрь',
            ];
            rassDateStart = moment().set('date', 1).set('month', arr.indexOf($(b).find(".js-month-res").text())).format("MM.DD.YYYY");
            // console.log($(b).find(".js-month-res").text());
        
          } else {
            rassDateStart = $(b).find("select[name='month']").val() + '.01.' + $(b).find("select[name='year']").val();
          }
          arrayOnePurchase.push(rassSumm, rassPeriod, rassPercent, rassDateStart);
          rassArray.push(arrayOnePurchase);
        }); 


        calcRassrochka(rassArray);
        break;

      case "calcPay":
        var paySumm = normaleNum($(then).find(".js-pay-summ").val()),
            payPeriod = normaleNum($(then).find(".js-pay-period").val()),
            payPercent = normaleNum($(then).find(".js-pay-percent").val()),
            payDateStart = moment().format("DD.MM.YYYY");
        calcPay(payPeriod,paySumm,payDateStart,payPercent);
        break;

      case "calcZaym":
        var zaymSumm = normaleNum($(then).find(".js-zaym-summ").val()),
            zaymPeriod = normaleNum($(then).find(".js-zaym-period").val()),
            zaymPercent = normaleNum($(then).find(".js-zaym-percent").val()),
            zaymDateStart = moment().format("DD.MM.YYYY"),
            zaymFirst = $(then).find(".js-first").is(":checked");
        calcPageZaym(zaymSumm,zaymPeriod,zaymPercent,zaymDateStart,zaymFirst);
        break;
      
      default:
        return;
    }

    clickOrChange = 0;
  }

  $(".js-calculate").click(function(){
    if ($(this).hasClass("table--open")) {
      $(this).removeClass("table--open");
      $(this).find('span').text('Рассчитать');
      $(".grafik").hide();

      var scTop = $('.calculator').offset().top - 30;
      $("html, body").animate({scrollTop: scTop})
    } else {
      $(this).addClass("table--open");
      if (!($(this).hasClass("js-nochange"))) {
        $(this).find('span').text('Скрыть график');
      }
      $('.grafik__table table').remove();
      $(".grafik").show();

      clickOrChange = 1;
      calculate();
    }
  });

  $("body").on("click", ".js-month-res", function(){
    $(this).parents(".ras-month").find(".ras-month__list").addClass("ras-month__list--open");
    $(this).addClass("ras-month__current--open");
  });
  $("body").on("click", ".ras-month__item", function(){
    $(this).parents(".ras-month").find(".js-month-res").removeClass("ras-month__current--open");
    $(this).parents(".ras-month").find(".js-month-res").text($(this).text());
    $(this).parents(".ras-month").find(".ras-month__list").removeClass("ras-month__list--open");
    calculate();
  });

  $(".calculator__method-pay--three").click(function(){
    $(".js-calculate").removeClass("table--open");
    $(".js-calculate").find('span').text('Рассчитать');
    $(".grafik").hide();
  });
  $(".calculator__method-pay--half").click(function(){
    $(".js-calculate").removeClass("table--open");
    $(".js-calculate").find('span').text('Рассчитать');
    $(".grafik").hide();
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
  function formatDate(date) {
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    var yy = date.getFullYear();
    return dd + '.' + mm + '.' + yy;
  }

  function calcCardMinAmount(cardMinAmount,cardCreditSumm,cardMaxLimit,cardPercents) {
    
    var table = '<table>' +
        '<tr>' +
        '<th>№, Месяц</th>' +
        '<th><span class="th-desktop">Сумма платежа</span><span class="th-mobile">Платеж</span></th>' +
        '<th>Проценты + долг</th>' +
        '<th>Остаток долга</th>' +
        '</tr>';

    var currentPay, 
        currentPercent, 
        currentDolg, 
        countMonth = 0, 
        row,
        currDate = new Date(),
        minPay = cardCreditSumm,
        totalPay = 0,
        beginSum = cardCreditSumm;

    while (cardCreditSumm > 0) {
      countMonth++;
      if (countMonth > 50) {
        alert('Ошибка! Неверные данные!');
        return;
      }
      currentPercent = Math.round(cardCreditSumm / 1200 * cardPercents);
      currentDolg = Math.round(cardCreditSumm / 100 * cardMinAmount);
      if (currentDolg < 500) currentDolg = 500;
      if ((cardCreditSumm < currentDolg)||(countMonth == 36)) {
        currentDolg = cardCreditSumm
      }    
      currentPay = currentPercent + currentDolg;
      totalPay += currentPay; 
      if (minPay > currentPay) {
        minPay = currentPay;
      }
      cardCreditSumm -= currentDolg;
      if (cardCreditSumm < 0) cardCreditSumm = 0;
      currDate.setMonth(currDate.getMonth() + 1);

      row = '';
      row += '<tr>' +
        '<td>' + countMonth + '. ' + formatDate(currDate)+'</td>'+
        '<td>' +
        '<span class="td-desktop">'+formatMoney( Math.round(currentPay),true )+'</span>' +
        '<span class="td-mobile">'+formatMoney( Math.round(currentPercent),true )+ ' + ' +
        formatMoney( Math.round(currentDolg),true ) + '</span>' +
        '</td>' +
        '<td>' +formatMoney( Math.round(currentPercent),true )+ ' + ' +
        formatMoney( Math.round(currentDolg),true ) + '</td>'+
        '<td>'+formatMoney( Math.round(cardCreditSumm),true )+'</td>'+
      '</tr>';
      table += row;
    }

    $('.js-month-pay').text('от '+formatMoney( Math.round(minPay) ));
    $('.js-month-count').text(countMonth + ' мес.');
    $('.js-total-pay').text(formatMoney( Math.round(totalPay)) );
    $('.js-over-pay').text(formatMoney( Math.round(totalPay - beginSum)) );

    table +='</table>';
    $('.grafik__table').html(table);
  }

  function calcCardMonthAmount(cardMonthAmount,cardCreditSumm,cardMaxLimit,cardPercents) {
    
    var table = '<table>' +
        '<tr>' +
        '<th>№, Месяц</th>' +
        '<th><span class="th-desktop">Сумма платежа</span><span class="th-mobile">Платеж</span></th>' +
        '<th>Проценты + долг</th>' +
        '<th>Остаток долга</th>' +
        '</tr>';

    var currentPay, 
        currentPercent, 
        currentDolg, 
        countMonth = 0, 
        row,
        currDate = new Date(),
        minPay = cardMonthAmount,
        totalPay = 0,
        beginSum = cardCreditSumm;

    while (cardCreditSumm > 0) {
      countMonth++;
      if (countMonth > 50) {
        alert('Ошибка! Неверные данные!');
        return;
      }
      currentPercent = Math.round(cardCreditSumm / 1200 * cardPercents);
      currentDolg = Math.round(cardMonthAmount - currentPercent);
      if (currentDolg < 500) currentDolg = 500;
      if ((cardCreditSumm < currentDolg)||(countMonth == 36)) {
        currentDolg = cardCreditSumm
      }    
      currentPay = currentDolg + currentPercent;
      totalPay += currentPay; 
      cardCreditSumm -= currentDolg;
      if (cardCreditSumm < 0) cardCreditSumm = 0;
      currDate.setMonth(currDate.getMonth() + 1);

      row = '';
      row += '<tr>' +
        '<td>' + countMonth + '. ' + formatDate(currDate)+'</td>'+
        '<td>' +
        '<span class="td-desktop">'+formatMoney( Math.round(currentPay),true )+'</span>' +
        '<span class="td-mobile">'+formatMoney( Math.round(currentPercent),true )+ ' + ' +
        formatMoney( Math.round(currentDolg),true ) + '</span>' +
        '</td>' +
        '<td>' +formatMoney( Math.round(currentPercent),true )+ ' + ' +
        formatMoney( Math.round(currentDolg),true ) + '</td>'+
        '<td>'+formatMoney( Math.round(cardCreditSumm),true )+'</td>'+
      '</tr>';
      table += row;
    }

    $('.js-month-pay').text(formatMoney( Math.round(minPay) ));
    $('.js-month-count').text(countMonth + ' мес.');
    $('.js-total-pay').text(formatMoney( Math.round(totalPay)) );
    $('.js-over-pay').text(formatMoney( Math.round(totalPay - beginSum)) );

    table +='</table>';
    $('.grafik__table').html(table);
  }
  
  function calcCardYourPeriod(cardYourPeriod,cardCreditSumm,cardMaxLimit,cardPercents) {
    
    var table = '<table>' +
        '<tr>' +
        '<th>№, Месяц</th>' +
        '<th><span class="th-desktop">Сумма платежа</span><span class="th-mobile">Платеж</span></th>' +
        '<th>Проценты + долг</th>' +
        '<th>Остаток долга</th>' +
        '</tr>';

    var currentPay, 
        currentPercent, 
        currentDolg, 
        countMonth = 0, 
        row,
        currDate = new Date(),
        minPay = cardCreditSumm,
        totalPay = 0,
        beginSum = cardCreditSumm;

    while (countMonth < cardYourPeriod) {
      countMonth++;
      if (countMonth > 50) {
        alert('Ошибка! Неверные данные!');
        return;
      }
      currentPercent = Math.round(cardCreditSumm / 1200 * cardPercents);
      currentDolg = Math.round(beginSum / cardYourPeriod);
      if (countMonth == cardYourPeriod) {
        currentDolg = cardCreditSumm;
        cardCreditSumm = 0;
      }
      currentPay = currentDolg + currentPercent;
      totalPay += currentPay; 
      cardCreditSumm -= currentDolg;
      if (cardCreditSumm < 0) cardCreditSumm = 0;
      currDate.setMonth(currDate.getMonth() + 1);
      if (minPay > currentPay) {
        minPay = currentPay;
      }

      row = '';
      row += '<tr>' +
        '<td>' + countMonth + '. ' + formatDate(currDate)+'</td>'+
        '<td>' +
        '<span class="td-desktop">'+formatMoney( Math.round(currentPay),true )+'</span>' +
        '<span class="td-mobile">'+formatMoney( Math.round(currentPercent),true )+ ' + ' +
        formatMoney( Math.round(currentDolg),true ) + '</span>' +
        '</td>' +
        '<td>' +formatMoney( Math.round(currentPercent),true )+ ' + ' +
        formatMoney( Math.round(currentDolg),true ) + '</td>'+
        '<td>'+formatMoney( Math.round(cardCreditSumm),true )+'</td>'+
      '</tr>';
      table += row;
    }

    $('.js-month-pay').text(formatMoney( Math.round(minPay) ));
    $('.js-month-count').text(countMonth + ' мес.');
    $('.js-total-pay').text(formatMoney( Math.round(totalPay)) );
    $('.js-over-pay').text(formatMoney( Math.round(totalPay - beginSum)) );

    table +='</table>';
    $('.grafik__table').html(table);
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
          currDate = moment(info.data.date,"DD.MM.YYYY").format("DD.MM.YYYY");

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
        // currDate.setMonth(currDate.getMonth() + 1);
        currDate = moment(currDate, "DD.MM.YYYY").add(1, "month").format("DD.MM.YYYY");

        var row = '';
        row += '<tr>' +
          '<td>' + i + '. ' + currDate+'</td>'+
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
    
    showValue(calcPay(creditSumm,creditPercents,creditPeriod,creditDateStart,creditVidPay));
    generateTable(calcPay(creditSumm,creditPercents,creditPeriod,creditDateStart,creditVidPay));
  }  

  // Калькулятор займа
  function calcZaym(zaymSumm,zaymPeriod,zaymPercent,zaymDateStart) {
    var now = zaymDateStart,
        result1 = zaymSumm,
        result2 = zaymSumm+(zaymSumm/100*zaymPercent*zaymPeriod),
        date = moment(now, "DD.MM.YYYY").add(zaymPeriod*86400*1000).format("DD.MM.YYYY");
    //     d = date.getDate(),
    //     m = date.getMonth()+1,
    //     y = new Date().getFullYear();

    // if (d < 10) d = '0'+d;
    // if (m < 10) m = '0'+m;

    var result3 = date,
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
  
    var refSrok = {
          year: 0,
          month: 0
        };
    refSrok.year = Math.floor(refinPeriod / 12);
    refSrok.month = refinPeriod % 12;
    if (refSrok.month == 0) {
      refSrok.month = '';
    } else {
      refSrok.month += " мес.";
    }

    if (refSrok.year == 0) {
      refSrok.year = '';
    } else {
      if (refSrok.year == 1) {
        refSrok.year += " год ";
      } else if (((refSrok.year == 2)||(refSrok.year == 3)||(refSrok.year == 4)) & ((refSrok.year > 20)||(refSrok.year < 10))) {
        refSrok.year += " года ";
      } else {
        refSrok.year += " лет ";
      }
    }
    
    

    $("#calc-refin-srok").text(refSrok.year + refSrok.month);

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

  function diffDate(date1, date2){
    return date1.getDate() - date2.getDate()
       + (12 * (date1.getFullYear() - date2.getFullYear()));
  };
  // Калькулятор рассрочки
  function calcRassrochka(rassArray) {
    // console.log(rassArray[0][3], rassArray[1][3]);

    var table = '<table>' +
        '<tr>' +
        '<th>№, Месяц</th>' +
        '<th><span class="th-desktop">Сумма платежа</span><span class="th-mobile">Платеж</span></th>' +
        '<th>Проценты + долг</th>' +
        '<th>Остаток долга</th>' +
        '</tr>';

    var arrayTable = new Array(),
        dateBegin = moment(rassArray[0][3]);
        // alert(dateBegin);
        // console.log(rassArray);
    for (var i = 0; i < rassArray.length; i++) {
      var arrayLocaleTable = new Array(),
          currentPay, 
          currentPercent, 
          currentDolg, 
          countMonth = 0, 
          row,
          currDate = moment(rassArray[i][3]).format("DD.MM.YYYY"),
          minPay = rassArray[i][0],
          totalPay = 0,
          beginSum = rassArray[i][0];

      while (countMonth < rassArray[i][1]) {
        countMonth++;
        if (countMonth > 50) {
          alert('Ошибка! Неверные данные!');
          return;
        }
        currentPercent = Math.round(rassArray[i][0] / 1200 * rassArray[i][2]);
        currentDolg = Math.round(beginSum / rassArray[i][1]);
        if (countMonth == rassArray[i][1]) {
          currentDolg = rassArray[i][0];
          rassArray[i][0] = 0;
        }
        currentPay = currentDolg + currentPercent;
        totalPay += currentPay; 
        rassArray[i][0] -= currentDolg;
        if (rassArray[i][0] < 0) rassArray[i][0] = 0;
        currDate = moment(currDate, "DD.MM.YYYY").add(1, "month").format("DD.MM.YYYY");
        if (minPay > currentPay) {
          minPay = currentPay;
        }

        arrayLocaleTable.push(new Array(currDate,
          Math.round(currentPay),
          Math.round(currentPercent),
          Math.round(currentDolg),
          Math.round(rassArray[i][0]))
        );
      }

      $(".purchase").each(function (k, b) {
        if (k == i) {
          $(b).find(".js-month-pay").text('от ' + formatMoney(minPay));
          $(b).find(".js-over-pay").text(formatMoney(totalPay - beginSum));
          var arr=[
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь',
          ];
          $(b).find(".js-month-res").text(arr[moment(rassArray[k][3]).month()]);
          // console.log($(b).find(".js-month-res").text());
          $(b).find(".js-total").text(formatMoney($(b).find(".js-total-limit").val() - beginSum));
        }
      });
      
      /*/
        Суммирование массивов покупок
      */

      if (arrayTable.length == 0) {
        arrayTable = arrayLocaleTable;
      } else {
        // определяем с какого момента даты будут пересекаться
        var date1 = new Date(arrayTable[0][0]),
            date2 = new Date(arrayLocaleTable[0][0]),
            diff2 = 0,
            diff = diffDate(date1, date2);
        if (date1 > date2) {
          for (var i = 0; i < diff; i++) {
            arrayTable.unshift(undefined);
          }
          // console.log(arrayTable);
        }
        if (date1 < date2) {
          diff2 = diff - 1;
        }

       

        // for (var i = 0; i < arrayLocaleTable.length; i++) {
        //   for (var j = 0; j < arrayLocaleTable[i].length; j++) {
        //     if (!(arrayTable[i + diff2])) arrayTable[i + diff2] = new Array();
        //     if (!(arrayTable[i + diff2][j])) arrayTable[i + diff2][j] = 0;
        //     if (j > 0) {              
        //       arrayTable[i + diff2][j] += arrayLocaleTable[i][j]
        //     } else {
        //       arrayTable[i + diff2][j] = arrayLocaleTable[i][j]
        //     }
        //   }
        // }

        for (var i = 0; i < arrayLocaleTable.length; i++) {
          for (var j = 0; j < arrayLocaleTable[i].length; j++) {
            if (!(arrayTable[i])) arrayTable[i] = new Array();
            if (!(arrayTable[i][j])) arrayTable[i][j] = 0;
            if (j > 0) {              
              arrayTable[i][j] += arrayLocaleTable[i][j]
            } else {
              arrayTable[i][j] = arrayLocaleTable[i][j]
            }
          }
        }
        // console.log(arrayTable);

      }

    }   

    // $('.js-month-pay').text(formatMoney( Math.round(minPay) ));
    // $('.js-month-count').text(countMonth + ' мес.');
    // $('.js-total-pay').text(formatMoney( Math.round(totalPay)) );
    // $('.js-over-pay').text(formatMoney( Math.round(totalPay - beginSum)) );
    
    
    for (var i = 0; i < arrayTable.length; i++) {
      row = '';
      row += '<tr>' +
        '<td>' + (i+1) + '. ' + arrayTable[i][0] +'</td>'+
        '<td>' +
        '<span class="td-desktop">'+formatMoney( arrayTable[i][1],true )+'</span>' +
        '<span class="td-mobile">'+formatMoney( arrayTable[i][2],true )+ ' + ' +
        formatMoney( arrayTable[i][3],true ) + '</span>' +
        '</td>' +
        '<td>' +formatMoney( arrayTable[i][2],true )+ ' + ' +
        formatMoney( arrayTable[i][3],true ) + '</td>'+
        '<td>'+formatMoney( arrayTable[i][4],true )+'</td>'+
      '</tr>';
      table += row;
    }
    table +='</table>';
    $('.grafik__table').html(table);
  }

  function calcPay(cardYourPeriod,cardCreditSumm,cardMaxLimit,cardPercents) {
    var table = '<table>' +
        '<tr>' +
        '<th>№, Месяц</th>' +
        '<th><span class="th-desktop">Сумма платежа</span><span class="th-mobile">Платеж</span></th>' +
        '<th>Проценты + долг</th>' +
        '<th>Остаток долга</th>' +
        '</tr>';

    var currentPay, 
        currentPercent, 
        currentDolg, 
        countMonth = 0, 
        row,
        currDate = moment().format("DD.MM.YYYY"),
        minPay = cardCreditSumm,
        totalPay = 0,
        beginSum = cardCreditSumm;
    while (countMonth < cardYourPeriod) {
      countMonth++;
      if (countMonth > 80) {
        alert('Ошибка! Неверные данные!');
        return;
      }
      currentPercent = Math.round(cardCreditSumm / 1200 * cardPercents);
      currentDolg = Math.round(beginSum / cardYourPeriod);
      if (countMonth == cardYourPeriod) {
        currentDolg = cardCreditSumm;
        cardCreditSumm = 0;
      }
      currentPay = currentDolg + currentPercent;
      totalPay += currentPay; 
      cardCreditSumm -= currentDolg;
      if (cardCreditSumm < 0) cardCreditSumm = 0;
      currDate = moment(currDate, "DD.MM.YYYY").add(1, "month").format("DD.MM.YYYY");
      if (minPay > currentPay) {
        minPay = currentPay;
      }

      row = '';
      row += '<tr>' +
        '<td>' + countMonth + '. ' + currDate+'</td>'+
        '<td>' +
        '<span class="td-desktop">'+formatMoney( Math.round(currentPay),true )+'</span>' +
        '<span class="td-mobile">'+formatMoney( Math.round(currentPercent),true )+ ' + ' +
        formatMoney( Math.round(currentDolg),true ) + '</span>' +
        '</td>' +
        '<td>' +formatMoney( Math.round(currentPercent),true )+ ' + ' +
        formatMoney( Math.round(currentDolg),true ) + '</td>'+
        '<td>'+formatMoney( Math.round(cardCreditSumm),true )+'</td>'+
      '</tr>';
      table += row;
    }

    $('.js-month-pay').text('от ' + formatMoney( Math.round(minPay) ));
    $('.js-percents').text(cardPercents + '% годовых');
    $('.js-total-pay').text(formatMoney( Math.round(totalPay)) );
    $('.js-over-pay').text(formatMoney( Math.round(totalPay - beginSum)) );

    table +='</table>';
    $('.grafik__table').html(table);
  }

  function calcPageZaym(zaymSumm,zaymPeriod,zaymPercent,zaymDateStart,zaymFirst) {
    if (zaymFirst) {
      zaymPercent = 0;
    }
    // console.log(zaymFirst);
    var now = zaymDateStart,
        result1 = zaymSumm,
        result2 = zaymSumm+(zaymSumm/100*zaymPercent*zaymPeriod),
        date = moment(now, "DD.MM.YYYY").add(zaymPeriod*86400*1000).format("DD.MM.YYYY");
        // d = date.getDate(),
        // m = date.getMonth()+1,
        // y = new Date().getFullYear();

    // if (d < 10) d = '0'+d;
    // if (m < 10) m = '0'+m;

    // var result3 = d+'.'+m+'.'+y
    var result3 = date;

    
    // Вывод
    $('.js-sumBegin').text(result1.format()+' ₽'); // Вы берете
    $('.js-totalPay').text(result2.format()+' ₽'); // Отдаете
    $('.js-date').text(result3);                  // Вернуть до
    $('.js-percent').text(zaymPercent + '% в день');
  }



});