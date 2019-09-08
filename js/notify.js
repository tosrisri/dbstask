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
		var alertConfigs = [];
		alertConfigs.push(saveObj);
		var requestObj  = {};
		requestObj["alertConfigs"] = alertConfigs;
		saveAlertConfigurations(requestObj);
	});
	
	getUserAlertConfigurations();
	
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
	
}