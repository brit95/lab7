var fs = require('fs');
var http = require('http');
var url = require('url');
var readline = require('readline');
var ROOT_DIR = "html/";
http.createServer(function(req,res) {
	var urlObj = url.parse(req.url,true,false);
	// If this is our comments REST service
	if(urlObj.pathname.indexOf("comment") != -1) {
		console.log("comment route");
