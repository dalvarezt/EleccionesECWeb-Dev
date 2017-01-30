/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
var logger = require("morgan");
app.use(logger("dev"));
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
	console.log("server starting on " + appEnv.url);
});

//instance DashDB driver
var ibmdb = require("ibm_db");
//TODO: Read from environment variable
var dbConnString = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-dal09-10.services.dal.bluemix.net;PORT=50001;PROTOCOL=TCPIP;UID=dash13400;PWD=74b951a71274;Security=SSL;";
var Pool = ibmdb.Pool,
	pool = new Pool(),
	cn = dbConnString,
	qryTweetCount = "SELECT ELECCIONES.CANDIDATO," +
	"SUM(CASE ELECCIONES.SENTIMIENTO WHEN 'POSITIVE' THEN 1 ELSE 0 END) AS POSITIVOS,\n" +
	"SUM(CASE ELECCIONES.SENTIMIENTO WHEN 'NEGATIVE' THEN 1 ELSE 0 END) AS NEGATIVOS,\n" +
	"SUM(CASE ELECCIONES.SENTIMIENTO WHEN 'NEUTRAL'  THEN 1 ELSE 0 END) AS NEUTRAL,\n" +
	"COUNT(*) AS TOTAL\n" +
	"FROM ELECCIONES\n" +
	"GROUP BY ELECCIONES.CANDIDATO;";

function arrangeTweetCount(data) {
	var result = {};
	for (var k in data) {
		result[data[k].CANDIDATO] = [ {"label": "Positivo", "data": data[k].POSITIVOS, "color":"#0eea57" },
		{"label":"Negativo", "data":data[k].NEGATIVOS, "color":"#f44242" },
		{"label":"Neutral", "data":data[k].NEUTRAL, "color":"#6d6d6d"}];
	}
	return result;
}

app.get("/getTweetCount", function(request, response) {
	pool.open(cn, function(err_conn, db) {
		if (err_conn) {
			console.error("Error getting connection from pool: ", err_conn);
			response.status(500);
			response.setHeader("Content-Type", "text/plain");
			response.write(err_conn.toString());
			response.send();
			return;
		}
		db.query(qryTweetCount, function(error, data){
			if(error){
				console.error("Error executing query: ", error);
				response.status(500);
				response.setHeader("Content-Type", "text/plain");
				response.write(error.toStirng());
				response.send();
			} else {
				response.setHeader("Content-Type","application/json");
				response.write(JSON.stringify(arrangeTweetCount(data)));
				response.send();
			}
			db.close(function(err_cls){if(err_cls){console.error(err_cls);}});
			
		});
	});

});

app.get("/popularTweet", function(request, response){
	var qry="SELECT * FROM POPULARTWEETS";
	if(request.query.candidato) {
		qry+=" WHERE CANDIDATO ='" + request.query.candidato +"'";
	}
	pool.open(cn, function(err_con, db){
		if(err_con) {
			console.error("Error getting connection from pool: ", err_con);
			response.status(500);
			response.setHeader("Content-Type", "text/plain");
			response.write(err_con.toString());
			response.send();
			return;
		}
		db.query(qry, function(err_qry, data){
			if(err_qry){
				console.error("Error ejecutando query: ", err_qry);
				response.status(500);
				response.write("No se pudo obtener tweets populares");
				response.send();
			} else {
				response.status(200);
				response.setHeader("Content-Type", "application/json");
				response.write(JSON.stringify(data));
				response.send();
			}
			db.close(function(err_cls){if(err_cls){console.error(err_cls);}});
		});
		
	});
});