var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html";
http.createServer(function (req, res) {
	var urlObj = url.parse(req.url,true,false);
	if(urlObj.pathname.indexOf("getcity") !=-1) {	//getcity route
		//Execute the REST service
		var query = urlObj.query["q"];
		fs.readFile('cities.dat.txt', function (err, data) {
  		if(err) throw err;
  		var jsonresult = [];
		if(query!=null)
		{
			cities = data.toString().split("\n");
  			for(var i = 0; i < cities.length; i++) {
    				if(cities[i].substring(0,query.length) == query) {
					//console.log(cities[i]);
					jsonresult.push({city:cities[i]});
				}
  			}
		}
		//console.log(jsonresult);
		res.writeHead(200);
		res.end(JSON.stringify(jsonresult));
		});
	}
	else if(urlObj.pathname.indexOf("comments") != -1) {
		//console.log("comment route");
		if(req.method === "POST") {
			//console.log("POST comment route");
			// First read the form data
			var jsonData = "";
      			req.on('data', function (chunk) {
        			jsonData += chunk;
      			});
      			req.on('end', function () {
        			var reqObj = JSON.parse(jsonData);
        			//console.log(reqObj);
        			//console.log("Name: "+reqObj.Name);
        			//console.log("Comment: "+reqObj.Comment);
				res.writeHead(200);
				res.end();
				
				var MongoClient = require('mongodb').MongoClient;
				MongoClient.connect("mongodb://localhost/weather",function(err, db) {
					if(err) throw err;
					db.collection('comments').insert(reqObj,function(err, records) {
						//console.log("Record added as "+records[0]._id);
					});
				});
			});
			
		}
		else if(req.method === "GET") {
			//console.log("In GET");

			// Read all of the database entries and return them in a JSON array
			var MongoClient = require('mongodb').MongoClient;
			MongoClient.connect("mongodb://localhost/weather", function(err, db) {
				if(err) throw err;
				db.collection("comments", function(err, comments) {
					if(err) throw err;
					comments.find(function(err, items) {
						items.toArray(function(err, itemArr) {
							//console.log("Document Array: ");
							//console.log(itemArr);
							res.writeHead(200);
							res.end(JSON.stringify(itemArr));
						});
					});
				});
			});
		}
	} 
	else {
	//	console.log("About to read file\n");
			
		fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
			if(err) { 
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200);
			res.end(data);
		});
	}
}).listen(80);
