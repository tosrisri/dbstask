var locationUrl1 = "http://192.168.43.53:8080";
$(document).ready(function() {
	$("#calculate").on('click', function() {
		if(validateCalculatorForm()) {
			var inputObj = {};
			var todayDate = new Date();
			todayDate.setDate(todayDate.getDate() + 5);
			inputObj.fromDate = formatDate(new Date());
			inputObj.toDate = formatDate(todayDate);
			inputObj.baseCurrency = $("#baseCurrency1").val();
			inputObj.exchangeCurreny = $("#exchangeCurrency1").val();
			console.log(inputObj);
			getCalculatorExchangeRates(inputObj);
		}
	});
	
	$("#torate").on("focusin", function() {
		$(this).removeClass("error-field");
		$(this).next().html("");
	});
	$('#baseCurrency1').on("select2-open", function() { 
		$('#baseCurrency1').prev().removeClass("error-field");
		$('#baseCurrency1').parent().find(".error-msg").html(""); 
	});
	$('#exchangeCurrency1').on("select2-open", function() { 
		$('#exchangeCurrency1').prev().removeClass("error-field");
		$('#exchangeCurrency1').parent().find(".error-msg").html(""); 
	});
	
	$("#reverseId").on('click', function() {
		baseCurrency = $("#baseCurrency1").select2("data");
		destCurrency = $("#exchangeCurrency1").select2("data"); 
		$("#baseCurrency1").select2("val", destCurrency.id);
		$("#exchangeCurrency1").select2("val", baseCurrency.id);
	});
});

function formatDate(date) {
    var d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function getCalculatorExchangeRates(inputObj) {
	$.ajax({
	  url: locationUrl1+"/api/v1/rightTimeToFx/getExchangeRates",
	  type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(inputObj),
      success: function (data) {
    	console.log(data);
    	displayCalculatorRates(data.exchangeRates);
      },
	});
}

function displayCalculatorRates(exchangeRates) {
	var toRate = $('#trate').val();
	$('.fxrates').html('');
	$.each(exchangeRates, function(i, rate) {
		var finalRate = toRate*rate.exchangeRate;
		finalRate = finalRate.toFixed(2);
		if(i == 0) {
			$('#convertedFrom').html(toRate+" "+rate.baseCurrency);
			$('#convertedTo').html(finalRate+" "+rate.exchangeCurreny);
		} else if(i < 6 ){
			$(".fxrates").append("<li><span>"+rate.date+"</span><span>"+rate.exchangeRate+" "+rate.exchangeCurreny+"</span><span>"+finalRate+"</span></li>")
		} else {
			return false;
		}
	});
}

function displayError($id, $parentId, msg) {
	$id.addClass("error-field");
	$parentId.find(".error-msg").html(msg);
	$parentId.find(".error-msg").css("display", "block");
}

function clearCalculatorFormError() {
	$("#trate").removeClass("error-field");
	$("#trate").next().html("");
	$('#baseCurrency1,#exchangeCurrency1').prev().removeClass("error-field");
	$('#baseCurrency1,#exchangeCurrency1').parent().find(".error-msg").html("");

}

function validateCalculatorForm() {
	var trate = $('#trate').val();
	var baseCurrency = $('#baseCurrency1').val();
	var exchangeCurreny = $('#exchangeCurrency1').val();
	var flag = true;
	clearCalculatorFormError();
	if (trate.length < 1) {
		displayError($('#drate'), $('#drate').parent(), "This field is required");
		flag = false;
	}
	if (baseCurrency.length < 1) {
		displayError($('#baseCurrency1').prev(), $('#baseCurrency1').parent(), "This field is required");
		flag = false;
	} 
	if (exchangeCurreny.length < 1) {
		displayError($('#exchangeCurrency1').prev(), $('#exchangeCurrency1').parent(), "This field is required");
		flag = false;
	} 
	if(flag) {
		if(baseCurrency == exchangeCurreny) {
			displayError($('#baseCurrency1').prev(), $('#baseCurrency1').parent(), "Both currencies cannot be same.");
			displayError($('#exchangeCurrency1').prev(), $('#exchangeCurrency1').parent(), "");
			flag = false;
		}
	}
	return flag;
}

