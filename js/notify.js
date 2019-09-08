var notifcationUrl = "http://192.168.43.53:8081";

$(document).ready(function() {
	/*$("#travelDate").datepicker({
		dateFormat: "yy-mm-dd",
		minDate : new Date(),
		maxDate : "+3m",
		buttonImageOnly: true,
		buttonImage: "calendar.gif",
		buttonText: "Calendar"
	});*/
	$("#notify").on("click", function() {
		if(validateAlertConfigForm()) {
			
			var saveObj = {};
			baseCurrency = $("#alertBaseCurrency").select2("data");
			destCurrency = $("#alertDestCurrency").select2("data");
			saveObj.baseCurrency = baseCurrency.id;
			saveObj.baseCurrencyCountry = baseCurrency.text;
			saveObj.exchangeCurrency = destCurrency.id;
			saveObj.exchangeCurrencyCountry = destCurrency.text;
			saveObj.notificationsRequired = 'Y',
			saveObj.desiredExchangeRate = $("#drate").val();
			saveObj.userId = 123456,
			//saveObj.travelDate = $("#travelDate").val();
			alertConfigs = [];
			alertConfigs.push(saveObj);
			var requestObj  = {};
			requestObj["alertConfigs"] = alertConfigs;
			saveAlertConfigurations(requestObj);
		}
	});
	
	$("#drate").on("focusin", function() {
		$(this).removeClass("error-field");
		$(this).next().html("");
	});
	$('#alertBaseCurrency').on("select2-open", function() { 
		$('#alertBaseCurrency').prev().removeClass("error-field");
		$('#alertBaseCurrency').parent().find(".error-msg").html(""); 
	});
	$('#alertDestCurrency').on("select2-open", function() { 
		$('#alertDestCurrency').prev().removeClass("error-field");
		$('#alertDestCurrency').parent().find(".error-msg").html(""); 
	});
	
	getUserAlertConfigurations();
	
	setInterval(getUserNotifications, 30000);
	
});
function saveAlertConfigurations(saveObj) {
	$.ajax({
		url : notifcationUrl + "/api/v1/fxRateAlert/alertConfigs",
		type : 'post',
		dataType : 'json',
		contentType : 'application/json',
		success : function(data) {
			getUserAlertConfigurations();
		},
		data : JSON.stringify(saveObj)
	});
}

function clearNotificationForm() {
	//$("#travelDate").removeClass("error-field");
	//$("#travelDate").next().html("");
	$("#drate").removeClass("error-field");
	$("#drate").next().html("");
	$('#alertBaseCurrency,#alertDestCurrency').prev().removeClass("error-field");
	$('#alertBaseCurrency,#alertDestCurrency').parent().find(".error-msg").html("");
}

function getUserNotifications() {
	$.ajax({
		url : notifcationUrl + "/api/v1/fxRateAlert/notifications/123456",
		type : 'get',
		dataType : 'json',
		contentType : 'application/json',
		success : function(data) {
			displayExchangeRates(data.message);
		}
	});
}

function displayNotifications() {
	
}

function deleteAlertConfiguration(id, thisObj) {
	$.ajax({
		url : notifcationUrl + "/api/v1/fxRateAlert/alertConfigs/"+id,
		type : 'get',
		dataType : 'json',
		contentType : 'application/json',
		success : function(data) {
			$(thisObj).parents("tr").remove();
		}
	});
}

function getUserAlertConfigurations() {
	$.ajax({
		url : notifcationUrl + "/api/v1/fxRateAlert/alertConfigs/123456",
		type : 'get',
		dataType : 'json',
		contentType : 'application/json',
		success : function(data) {
			displayAlertConfigurations(data.alertConfigs);
		}
	});
}

function displayAlertConfigurations(alertConfigs) {
	$("#alertConfigBody").html("");
	if(alertConfigs.length > 0) {
		$.each(alertConfigs, function(i, config) {
			var markup = "<tr><td>" + config.baseCurrencyCountry + "</td><td>" + config.exchangeCurrencyCountry + 
			"<td class='text-center'>" + config.desiredExchangeRate + "</td>" +
			"<td class='text-center'><a title='Delete' class='deleteConfig' data-id="+config.id+"><img src='images/delete.svg' width='12' height='12'" +
			"alt='=delete'/></a></td></tr>";
			$("#alertConfigBody").append(markup);
		});
		
		$('.deleteConfig').off('click');
		$('.deleteConfig').on('click', function() {
			var id = $(this).attr("data-id"); 
			deleteAlertConfiguration(id, $(this));
		});
		$(".results").show();
	} else {
		$(".results").hide();
	}
	
}

function displayError($id, $parentId, msg) {
	$id.addClass("error-field");
	//$parentId.find(".error-msg").html(msg);
	//$parentId.find(".error-msg").css("display", "block");
}

function validateAlertConfigForm() {
	var trate = $('#drate').val();
	var baseCurrency = $('#alertBaseCurrency').val();
	var exchangeCurreny = $('#alertDestCurrency').val();
	var flag = true;
	clearNotificationForm();
	if (trate.length < 1) {
		displayError($('#drate'), $('#drate').parent(), "This field is required");
		flag = false;
	}
	if (baseCurrency.length < 1) {
		displayError($('#alertBaseCurrency').prev(), $('#alertBaseCurrency').parent(), "This field is required");
		flag = false;
	} 
	if (exchangeCurreny.length < 1) {
		displayError($('#alertDestCurrency').prev(), $('#alertDestCurrency').parent(), "This field is required");
		flag = false;
	} 
	if(flag) {
		if(baseCurrency == exchangeCurreny) {
			displayError($('#alertBaseCurrency').prev(), $('#alertBaseCurrency').parent(), "Both currencies cannot be same.");
			displayError($('#alertDestCurrency').prev(), $('#alertDestCurrency').parent(), "");
			flag = false;
		}
	}
	return flag;
}
