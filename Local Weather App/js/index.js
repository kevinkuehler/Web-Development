/* getting and setting client time */
var monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];

var $_unit = $('#unit-degree');
var $_main_temp = $('#temp-val');
var $_wind = $('#wind-speed');
var $_humidity = $('#humidity-percent');
var $_description = $("#weather-description");
var $_icon = $('#weather-icon');
var $_weather_box = $('#weather-box');
var $_sunrise = $('#sunrise-time');
var $_sunset = $('#sunset-time');

// get client's date and time
function updateTime() {
	var today = new Date();
	var hr = formatHour(today.getHours());
	$('#local-date-time').html(monthNames[today.getMonth()] +
		" " + today.getDate() + " " + today.getFullYear() + ", " + addZero(hr[0]) + ":" + addZero(today.getMinutes()) + " " + hr[1]);

	setTimeout(updateTime, 1000);
}

function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

updateTime();
$.getJSON("http://ip-api.com/json/?callback=?", function(ipdata) {
	$('#user-location').html(ipdata.city + ", " + ipdata.regionName);
	getWeather(ipdata);
});

function getWeather(data) {
	var MY_ID = '39d424a6d572f732b64aa19703ede02a';
	var query_info = data.city + "," + data.countryCode;
	var default_units = 'imperial';

	var dailyWeather =
		$.getJSON('http://api.openweathermap.org/data/2.5/weather?', {
			q: query_info,
			units: default_units,
			appid: MY_ID
		});

	//api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
	var weeklyForcast =
		$.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily', {
			q: query_info,
			cnt: '7',
			units: default_units,
			appid: MY_ID
		});

	dailyWeather.done(function(data) {

		// daily temp variables
		var dailyTempFahr = Math.round(data.main.temp);
		var dailyTempCel = fahrToCel(dailyTempFahr);

		$_weather_box.on('click', convert);

		$_main_temp.html(dailyTempFahr);
		$_wind.html(data.wind.speed);
		$_humidity.html(data.main.humidity);
		setWeatherIcon(data.weather[0].id);
		$_description.html(adjustCaps(data.weather[0].description));
		
		// get sunrise + sunset times
		var sun = new Date(data.sys.sunrise*1000);
		var sunriseHr = formatHour(sun.getHours());
		$_sunrise.html(addZero(sunriseHr[0]) + ":" + sun.getMinutes() + " " + sunriseHr[1]);
		sun = new Date(data.sys.sunset*1000);
		var sunsetHr = formatHour(sun.getHours());
		$_sunset.html(addZero(sunsetHr[0]) + ":" + sun.getMinutes() + " " + sunsetHr[1]);
		
		var fahr = true; // app starts in fahr
		function convert() {
			if (fahr) {
				$_main_temp.html(dailyTempCel);
				$_unit.html('C');
			} else {
				$_main_temp.html(dailyTempFahr);
				$_unit.html('F');
			}
			fahr = !fahr;
		}
	});

	weeklyForcast.done(function(data) {
		$_weather_box.on('click', convert);

		var table = document.getElementById("weekly-weather").rows[0];
		var f_weeklyHolder = [];
		var c_weeklyHolder = [];

		for (var i = 0, cell; cell = table.cells[i]; i++) {
			var low = Math.round(data.list[i].temp.min);
			var high = Math.round(data.list[i].temp.max);
			cell.getElementsByClassName('day-temp-high')[0].innerHTML = high;
			cell.getElementsByClassName('day-temp-low')[0].innerHTML = low;
			// store temps
			f_weeklyHolder.push({
				"high": high,
				"low": low
			});
			c_weeklyHolder.push({
				"high": fahrToCel(high),
				"low": fahrToCel(low)
			});
		}

		// on click fahr -> cel
		var fahr = true; // app starts in fahr
		function convert() {
			var holder = [];

			if (fahr)
				holder = c_weeklyHolder;
			else
				holder = f_weeklyHolder;
			fahr = !fahr;

			for (var i = 0, cell; cell = table.cells[i]; i++) {
				cell.getElementsByClassName('day-temp-high')[0].innerHTML = holder[i].high;
				cell.getElementsByClassName('day-temp-low')[0].innerHTML = holder[i].low;
			}
		}
	});
};
/* 
	converts fahrenheit to celsuis
	*T(°C) = (T(°F) - 32) × 5/9 
*/
function fahrToCel(f) {
	return Math.round((f - 32) * 5 / 9);
}

/* returns correct icon for corresponding Open Weather code */
function setWeatherIcon(code) {
	if (code >= 951) {
		$_icon.addClass("wi-cloudy-gusts");
	} else if (code >= 900) {
		$_icon.addClass("wi-storm-warning");
	} else if (code > 800) {
		$_icon.addClass("wi-cloudy");
	} else if (code === 800) {
		$_icon.addClass("wi-day-sunny");
	} else if (code >= 700) {
		$_icon.addClass("wi-fog");
	} else if (code >= 600) {
		$_icon.addClass("wi-snow");
	} else if (code >= 500) {
		$_icon.addClass("wi-rain");
	} else if (code >= 300) {
		$_icon.addClass("wi-sprinkle");
	} else if (code >= 200) {
		$_icon.addClass("wi-thunderstorm");
	}
}
function formatHour(hour) {
	var AoP = "A.M.";
	if (hour === 0) return [12,AoP];
	else if (hour > 11) {
		AoP = "P.M.";
		if (hour !== 12) hour -= 12;
	}
	return [hour,AoP];
}
/* capitalizes the first letter of every word in string */
function adjustCaps(str) {
	str = str.split(' ');
	for (var i = 0; i < str.length; i++)
		str[i] = str[i][0].toUpperCase() + str[i].substring(1);

	return str.join(' ');
}