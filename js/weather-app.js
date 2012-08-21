/* Author: Peter Nolan
*/

// namespace
if (!window.WeatherApp) {
    window.WeatherApp = {}
}

/*
 * Weather App
 */

 // The Modal
WeatherApp.Weather = Backbone.Model.extend({

    url: function () {
        // parameters taken from the model,  this = WeatherApp.Weather
        var lat = this.get("lat");
        var lng = this.get("lng");

        var url = "http://free.worldweatheronline.com/feed/weather.ashx?";
        url += "q="+lat+","+lng+"&";
        url += "&format=json";
        url += "&num_of_days=5";
        url += "&key=e4719dfd64205903122206";
        url += "&includeLocation=yes";

        // jQuery JSONP
        url += "&callback=?";
        return url;
    }
});

// The View
WeatherApp.WeatherView = Backbone.View.extend({

    // method call on creation of the View
    initialize: function () {

        // create the Handlebars templates
		var today_template   = Utils.tpl.get("weather-today");
		this.todayTemplate = Handlebars.compile(today_template);

		var forecast_template   = Utils.tpl.get("weather-forecast");
		this.forecastTemplate = Handlebars.compile(forecast_template);

        var buttons_template   = Utils.tpl.get("buttons");
        this.buttonsTemplate = Handlebars.compile(buttons_template);

        // get the user location
        var app = this;
        window.Geo.go(function(lat, lng){
            app.model.set("lat",lat);
            app.model.set("lng",lng);
            
            // listen for changes on the model
            app.model.bind("change", app.render, app);

            // fetch the JSON data  (HTTP GET)
            app.model.fetch();

            console.log('Loaded geo location: ' + lat + "," + lng);
        });        
    },
    render: function () {

        var json = this.model.toJSON();

        // using the updated model, generate the HTML
        var html = this.buttonsTemplate(json);
        $(".nav-btns").html(html);

        var html = this.todayTemplate(json);
        $(".today").html(html);
        this.conditions(0); // default to the current weather

        html = this.forecastTemplate(json);
        $(".forecasts").hide().html(html).fadeIn('slow');

        this.initButtons();

        return this;
    },
    initButtons: function () {

        // bind a click event tp the buttons
        var app = this;
        $(".nav-btns div").click(function (btn) {
            var index = $(".nav-btns div").index(this);
            $(".weather").hide();
            var el = $(".weather").get(index)
            $(el).fadeIn("slow");
            app.conditions(index);
        })
    },
    conditions: function(index){

        // update the background image based on the weather conditions code
        var c = $($(".conditionCode").get(index)).html();
        var img = this.codes(c);
        $("body").css("background-image", "url(" + img  + ")");
    },
    codes : function(c){
        var img = WeatherApp.weathercodes[c];
        if (img == 'undefined'){
            img = "img/clouds.jpg";
        }
        return img;
    }
});

// .. and The Controller
var AppRouter = Backbone.Router.extend({
  routes: {
  },
  initialize: function() {

    // load the HTML for the UI templates and then create the app objects when loaded
    Utils.tpl.loadTemplates(['weather-today', 'weather-forecast', 'buttons'], function(){
        weather = new WeatherApp.Weather;
        weatherView = new WeatherApp.WeatherView({
            model: weather
        });
        console.log('WeatherApp loaded');
    });
  }
});

/*
 * Handlebars helper function to give day of week label value
 */
Handlebars.registerHelper('dayOfWeek', function(day) {
  
	var d = new Date(day);

	var weekday=new Array(7);
	weekday[0]="Sunday";
	weekday[1]="Monday";
	weekday[2]="Tuesday";
	weekday[3]="Wednesday";
	weekday[4]="Thursday";
	weekday[5]="Friday";
	weekday[6]="Saturday";

	var n = weekday[d.getDay()];
	return n;
});

// bootstap the app
jQuery(document).ready(function ($) {

    //http://www.worldweatheronline.com/feed/wwoConditionCodes.xml
    WeatherApp.weathercodes = new Array();
    WeatherApp.weathercodes["113"] = "img/sun.jpg";
    WeatherApp.weathercodes["176"] = "img/sun.jpg";
    WeatherApp.weathercodes["116"] = "img/partly-cloudy.jpg";
    WeatherApp.weathercodes["266"] = "img/rain.jpg";
    WeatherApp.weathercodes["263"] = "img/rain.jpg";
    WeatherApp.weathercodes["293"] = "img/rain.jpg";
    WeatherApp.weathercodes["296"] = "img/rain.jpg";
    WeatherApp.weathercodes["308"] = "img/rain.jpg";
    WeatherApp.weathercodes["305"] = "img/rain.jpg";
    WeatherApp.weathercodes["302"] = "img/rain.jpg";
    WeatherApp.weathercodes["299"] = "img/rain.jpg";
    WeatherApp.weathercodes["353"] = "img/rain.jpg";

    // create the app
    new AppRouter();
});