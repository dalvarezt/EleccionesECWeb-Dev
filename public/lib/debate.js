/*eslint-env jquery*/

var delay=10000;
var candidatos = [["Bucaram","Abdalá Bucaram"], 
	["Espinel","Iván Espinel"], 
	["Lasso","Guillermo Lasso"], 
	["Moncayo","Paco Moncayo"], 
	["Moreno","Lenin Moreno"], 
	["Pesantez","Washington Pesántez"], 
	["Viteri","Cynthia Viteri"], 
	["Zuquilanda","Patricio Zuquilanda"]];

var defaultData=[{"label":"ninguno", "data":1, "color":"#0d0d0d"}];
	
var pieOptions ={ series: {
	pie: {
			show: true,
			radius: .75,
			innerRadius: .35,
			label: {
				show: true,
				formatter: function(label, series) {
					return "<div style=\"font-size:8pt;text-align:center;padding:2px;color:" + series.color + "\">" + 
						label + "<br />" + series.data[0][1] +
						"</div>";
				}
			}	
		}
	},legend:{show:false}
};
var pieOptionsDefault ={ series: {
	pie: {
			show: true,
			radius: .75,
			innerRadius: .35,
			label: {
				show: true,
				formatter: function(label, series) {
					return "<div style=\"font-size:8pt;text-align:center;padding:2px;color:" + series.color + "\">" + 
						label  +
						"<br /></div>";
				}
			}	
		}
	},legend:{show:false}
};

function paintCharts(data) {
	for (var i=0; i<candidatos.length; i++){
		if(data[candidatos[i][0]]) {
			$.plot( "#"+candidatos[i][0], data[candidatos[i][0]], pieOptions);
		} else {
			$.plot( "#"+candidatos[i][0], defaultData, pieOptionsDefault);
		}
	}
	setTimeout(getTweetCount, delay);
}

function getTweetCount() {
	$.ajax( { "url":"/getTweetCount",
		"type":"GET",
		"dataType":"json",
		"success":paintCharts,
		"error": function(result, status) { console.log(status + " " + result);}
	});
}