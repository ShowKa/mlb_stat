const fs = require('fs');
const json2csv = require('json2csv');
const merge = require('merge');
const argv = require("argv");

const TeamStandings = require("./lib/TeamStandings");
const TeamStatistics = require("./lib/TeamStatistics");

// arg
var year = argv.run().targets[0];
if (!year) {
    console.log("oh, year undefined !!");
    return;
}

// var
var tmpDir = "./tmp/";
var destCsvFilePath = tmpDir + "Dest_" + year + ".csv";

// do it
var ts = new TeamStandings(year);
var allTeams = ts.getAllTeam();
var destData = [];

allTeams.forEach(function(team) {
    var stat = new TeamStatistics(team.id, year);
    var hitting = stat.getHititng();
    var fielding = stat.getFielding();
    var pitching = stat.getPitching();

    var _d = hitting;
    merge(_d, fielding);
    merge(_d, pitching);
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