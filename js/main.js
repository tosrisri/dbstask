var countries;
$(document).ready(function() {
	$("#baseCurrency").select2({
		 ajax: { 
		        url: "http://192.168.43.53:8080/api/v1/rightTimeToFx/getCountriesAndCurrencies",
		        dataType: 'json',
		        quietMillis: 250,
		        results: function (data, page) { 
		            return { results: formatCountriesToSelect2(data.countriesAndCurrencies) };
		        },
		        cache: true
		    }
	});
	$("#exchangeCurrency").select2({
		ajax: { 
	        url: "http://192.168.43.53:8080/api/v1/rightTimeToFx/getCountriesAndCurrencies",
	        dataType: 'json',
	        quietMillis: 250,
	        results: function (data, page) { 
	            return { results: formatCountriesToSelect2(data.countriesAndCurrencies) };
	        },
	        cache: true
	    }
	});
	$("#fromDate").datepicker({
		minDate : new Date(),
		dateFormat: "yy-mm-dd"
	});
	$("#toDate").datepicker({
		dateFormat: "yy-mm-dd",
		minDate : new Date(),
		maxDate : "+3m"
	});
	getCountries();
	
});

function getCountries() {
		$.ajax({
		  type: "application/json",
		  method:"GET",
		  url: "http://192.168.43.53:8080/api/v1/rightTimeToFx/getCountriesAndCurrencies"
		}).done(function(data) {
			countries = data.countriesAndCurrencies;
			formatCountriesToSelect2(data.countriesAndCurrencies);
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