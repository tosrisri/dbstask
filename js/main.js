$(document).ready(function() {
	$("#baseCurrency").select2({
		data : [ {
			"text" : "INDIA",
			"id" : "INR"
		}, {
			"text" : "United States of America",
			"id" : "USD"
		}, {
			"text" : "Singapore",
			"id" : "SGD"
		} ]

	});
	$("#exchangeCurrency").select2({
		data : [ {
			"text" : "INDIA",
			"id" : "INR"
		}, {
			"text" : "United States of America",
			"id" : "USD"
		}, {
			"text" : "Singapore",
			"id" : "SGD"
		} ]
	});
	$("#fromDate").datepicker({
		minDate : new Date()
	});
	$("#toDate").datepicker({
		minDate : new Date(),
		maxDate : "+3m"
	});
});
