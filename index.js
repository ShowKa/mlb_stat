const fs = require('fs');
const json2csv = require('json2csv');

const TeamStandings = require("./lib/TeamStandings");
const TeamStatistics = require("./lib/TeamStatistics");

// config
var year = 2015;

var tmpDir = "./tmp/";
var destCsvFilePath = tmpDir + "Dest_" + year + ".csv";

// do it
var ts = new TeamStandings(year);
var allTeams = ts.getAllTeam();
var destData = [];

allTeams.forEach(function(team) {
    var stat = new TeamStatistics(team.id, year);
    var hitting = stat.getHititng();

    var _d = hitting;
    _d.strength = team.strength;

    destData.push(_d);
});

jsonToCsv(destData, destCsvFilePath);

/**
 * jsonをCSVファイルに。
 */
function jsonToCsv(jsonData, csvtmpFileName) {
    var csv = json2csv({ data: jsonData });
    fs.writeFile(csvtmpFileName, csv, function(e) {});
}