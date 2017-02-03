/*globals twttr */
/*eslint-env jquery*/

var delay = 10000;
var candidatos = [
	["Bucaram", "Abdalá Bucaram"],
	["Espinel", "Iván Espinel"],
	["Lasso", "Guillermo Lasso"],
	["Moncayo", "Paco Moncayo"],
	["Moreno", "Lenin Moreno"],
	["Pesantez", "Washington Pesántez"],
	["Viteri", "Cynthia Viteri"],
	["Zuquilanda", "Patricio Zuquilanda"]
];

var defaultData = [{
	"label": "ninguno",
	"data": 1,
	"color": "#0d0d0d"
}];

var pieOptions = {
	series: {
		pie: {
			show: true,
			radius: 0.85,
			innerRadius: 0.85*0.45,
			label: {
				show: true,
				radius: 0.85*.725,
				formatter: function(label, series) {
					return "<div class=\"donut-label\">" +
						 parseInt(series.percent) + "%" +
						"</div>";
				}
			}
		}
	},
	legend: {
		show: false
	}
};
var pieOptionsDefault = {
	series: {
		pie: {
			show: true,
			radius: .001,
			innerRadius: .35,
			label: {
				show: true,
				formatter: function(label, series) {
					return "<div style=\"font-size:8pt;text-align:center;padding:2px;color:" + series.color + "\">" +
						label +
						"<br /></div>";
				}
			}
		}
	},
	legend: {
		show: false
	}
};

function paintCharts(data) {
	var max = data.Info.MaxCount;

	for (var i = 0; i < candidatos.length; i++) {
		if (data[candidatos[i][0]]) {
			var tweetCount = data.Info.Candidatos[candidatos[i][0]];
			var placeholder = $("#" + candidatos[i][0])
			$.plot(placeholder, data[candidatos[i][0]], pieOptions);
			//var cont = $("#" +candidatos[i][0] + "-tc" );
			//cont.html("<p>" + data.Info.Candidatos[candidatos[i][0]] + "<br>Tweets</p>");
			placeholder.append("<div class=\"tweet-count\">" + tweetCount + "<br />Tweets</div>");
		} else {
			$.plot("#" + candidatos[i][0], defaultData, pieOptionsDefault);
		}

	}
	setTimeout(getTweetCount, delay);
}

function getTweetCount() {
	$.ajax({
		"url": "/getTweetCount",
		"type": "GET",
		"dataType": "json",
		"success": paintCharts,
		"error": function(result, status) {
			console.log(status + " " + result);
			setTimeout(getTweetCount, delay);
		}
	});
}

function paintPopularTweets() {
	$.ajax({
		"url": "/popularTweet",
		"type": "GET",
		"dataType": "json",
		"success": function(data) {
			var container = $("#TweetPanel");
			var html="";
			for (var i = 0; i < data.length; i++) {
				var idt = data[i].IDTWEET.split(":")[2];
				html+="<div class=\"tweet\" id=\"" + idt + "\"></div>\n";
			}
			container.html(html);
			var tweets = jQuery(".tweet");

			jQuery(tweets).each(function(t, tweet) {

				var id = jQuery(this).attr('id');

				twttr.widgets.createTweet(
					id, tweet, {
						conversation: 'none', // or all
						cards: 'hidden', // or visible
						linkColor: '#cc0000', // default is blue
						theme: 'light' // or dark
					});

			});
		},
		"error": function(result, status) {
			console.log(status + " " + result);
		}
	});
}
