/**
Aleah Crawford & Nate Peters
CSC 337 Final Project
Spring 2019

Provides backend functionality of the web page. Listens for 
get/post requests, writes/appends/reads from files, and makes
json objects from files or api.
**/

"use strict";
(function() {

    const express = require("express");
    const app = express();

    var fs = require("fs");


    const bodyParser = require('body-parser');
    const jsonParser = bodyParser.json();

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", 
                    "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(express.static('public'));

    /**
    If get request is made, either a json object is made
    from api, or json object is made from file, and then sent
    to the frontend. 
    **/
    app.get('/', function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        if (req.query.mode == undefined) {
	        let json = {"breweries": req.body};
	        res.send(JSON.stringify(json));

    	}
    	else if (req.query.mode == "comments"){
        	let filename = "brewery_" + req.query.id + "_comments.txt";
        	let directory = "./public/";

	        let file = fs.readFileSync(filename, 'utf8');
	        let lines = file.split("\n");
	        let comments = [];
	        for (var i=0; i < lines.length; i++) {
	            let line = lines[i].split(":::");
	            if ((line[0] != "") && (line[1] != "")){
	                let comment = {};
	                comment["name"] = line[0].trim();
	                comment["comment"] = line[1].trim();
	                comments.push(comment);
	            }
	        }
	        let json = {"comments": comments};  	
	        res.send(JSON.stringify(json));
    	}

    });

    /**
    If post request is made, writes data from json object and
    writes it to a file.  
    **/
    app.post('/', jsonParser, function(req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        const name = req.body.name;
        const comment = req.body.comment;
        const id = req.body.id;

        let filename = "brewery_" + id + "_comments.txt";
        let directory = "./public";

        fs.appendFile(filename, name + ":::" + comment + "\r\n", function(err) {
            if(err) {
                return console.log(err);
            }
            res.send(filename + " updated.");
        });

    });
    app.listen(process.env.PORT);

})();
