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
			radius: .75,
			innerRadius: .35,
			label: {
				show: true,
				radius: .75,
				formatter: function(label, series) {
					return "<div style=\"font-size:8pt;text-align:center;padding:2px;color:black\">" +
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
			tweetCount = data.Info.Candidatos[candidatos[i][0]];
			//pieOptions.series.pie.radius = tweetCount/max<.20 ? .20 : tweetCount/(parseInt(max)+1) ;
			pieOptions.series.pie.radius = 80 ;
			pieOptions.series.pie.innerRadius = pieOptions.series.pie.radius*.45;
			//pieOptions.series.pie.label.radius = (pieOptions.series.pie.radius*1.15 >=1 ? .9999 : pieOptions.series.pie.radius*1.15);
			pieOptions.series.pie.label.radius = 55;
			console.log(candidatos[i][0] + " - " + pieOptions.series.pie.radius );
			$.plot("#" + candidatos[i][0], data[candidatos[i][0]], pieOptions);
		} else {
			$.plot("#" + candidatos[i][0], defaultData, pieOptionsDefault);
		}
		var cont = $("#" +candidatos[i][0] + "-tc" );
		cont.html("<p>" + data.Info.Candidatos[candidatos[i][0]] + "<br>tweets</p>");
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
