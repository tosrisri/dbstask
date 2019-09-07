var countries;
var locationUrl = "http://192.168.43.53:8080";

$(document).ready(function() {
	$("#fromDate").datepicker({
		minDate : new Date(),
		maxDate : "+3m",
		dateFormat: "yy-mm-dd",
		buttonImageOnly: true
	});
	$("#toDate").datepicker({
		dateFormat: "yy-mm-dd",
		minDate : new Date(),
		maxDate : "+3m",
		buttonImageOnly: true,
		buttonImage: "calendar.gif",
		buttonText: "Calendar"
	});
	getCountries();

	$("#submit").on('click', function() {
		if(validateForm()) {
			var inputObj = {};
			inputObj.fromDate = $("#fromDate").val();
			inputObj.toDate = $("#toDate").val();
			inputObj.baseCurrency = $("#baseCurrency").val();
			inputObj.exchangeCurreny = $("#exchangeCurrency").val();
			console.log(inputObj);
			getExchangeRates(inputObj);
		}
	});
	
	/*$("#fromDate").on('change', function(){
		var minDate = new Date($(this).val());
		var maxDate = new Date($(this).val());
		maxDate.setMonth(maxDate.getMonth() + 3);
		$('#toDate').val("");
		$('#toDate').datepicker('option', { minDate: minDate,
			maxDate : maxDate});
	})*/
	
	$("#reset").on('click', function() {
		$("#fromDate,#toDate").val("");
		$("#exchangeCurrency,#baseCurrency").select2("val", "");
		$(".predictions").html("");
		clearError();
	});
	
	$("#fromDate,#toDate").on("focusin", function() {
		$(this).removeClass("error-field");
		$(this).next().html("");
	});
	$('#baseCurrency').on("select2-open", function() { 
		$('#baseCurrency').prev().removeClass("error-field");
		$('#baseCurrency').parent().find(".error-msg").html(""); 
	});
	$('#exchangeCurrency').on("select2-open", function() { 
		$('#exchangeCurrency').prev().removeClass("error-field");
		$('#exchangeCurrency').parent().find(".error-msg").html(""); 
	});
	
});

function displayError($id, $parentId, msg) {
	$id.addClass("error-field");
	$parentId.find(".error-msg").html(msg);
	$parentId.find(".error-msg").css("display", "block");
}

function clearError() {
	$("#fromDate,#toDate").removeClass("error-field");
	$("#fromDate,#toDate").next().html("");
	$('#baseCurrency,#exchangeCurrency').prev().removeClass("error-field");
	$('#baseCurrency,#exchangeCurrency').parent().find(".error-msg").html("");

}

function validateForm() {
	var fromDate = $('#fromDate').val();
	var toDate = $('#toDate').val();
	var baseCurrency = $('#baseCurrency').val();
	var exchangeCurreny = $('#exchangeCurrency').val();
	var flag = true;
	clearError();
	if (fromDate.length < 1) {
		displayError($('#fromDate'), $('#fromDate').parent(), "This field is required");
		flag = false;
	}
	if (toDate.length < 1) {
		displayError($('#toDate'), $('#toDate').parent(), "This field is required");
		flag = false;
	}
	if (baseCurrency.length < 1) {
		displayError($('#baseCurrency').prev(), $('#baseCurrency').parent(), "This field is required");
		flag = false;
	} 
	if (exchangeCurreny.length < 1) {
		displayError($('#exchangeCurrency').prev(), $('#exchangeCurrency').parent(), "This field is required");
		flag = false;
	} 
	if(flag) {
		if(baseCurrency == exchangeCurreny) {
			displayError($('#baseCurrency').prev(), $('#baseCurrency').parent(), "Both currencies cannot be same.");
			displayError($('#exchangeCurrency').prev(), $('#exchangeCurrency').parent(), "");
			flag = false;
		}
	}
	if(flag) {
		var formattedFromDate = new Date(fromDate);
		var formattedToDate = new Date(toDate);
		if(formattedFromDate > formattedToDate) {
			displayError($('#fromDate'), $('#fromDate').parent(), "From date cannot be greater than to date");
			displayError($('#toDate'), $('#toDate').parent(), "");
			flag = false;
		}
	}
	return flag;
}

function getExchangeRates(inputObj) {
		$.ajax({
		  url: locationUrl+"/api/v1/rightTimeToFx/getExchangeRates",
		  type: 'post',
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
        	displayExchangeRates(data.exchangeRates);
          },
          data: JSON.stringify(inputObj)
		});
}

function getCountries() {
	$.ajax({
		url: locationUrl+"/api/v1/rightTimeToFx/getCountriesAndCurrencies",
        dataType: 'json'
	}).done(function(data) {
		formatCountries = formatCountriesToSelect2(data.countriesAndCurrencies);
		$("#baseCurrency,#exchangeCurrency,#baseCurrency1,#exchangeCurrency1,#alertBaseCurrency,#alertDestCurrency").select2({
			 data: formatCountries
		});
	});
}


function displayExchangeRates(exchangeRates) {
	$("#fromSpan").html("from "+$("#fromDate").val());
	$("#toSpan").html(" to "+$("#toDate").val());
	$(".predictions").html("");
	$.each(exchangeRates, function(i, rate) {
		$(".predictions").append("<li><span>"+rate.date+"</span>"+rate.exchangeRate+" "+rate.exchangeCurreny+"</li>")
	});	
}

function formatCountriesToSelect2(countriesAndCurrencies) {
	var formatCountries = [];
	$.each(countriesAndCurrencies, function(i, country){
		var obj = {};
		obj["id"] =  country.currency;
		obj["text"] = country.country;
		formatCountries.push(obj);
	});
	return formatCountries;
}
