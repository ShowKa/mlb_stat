const argv = require("argv");

const TeamStandings = require("./lib/TeamStandings");
const TeamStatistics = require("./lib/TeamStatistics");

// arg
var year = argv.run().targets[0];
if (!year) {
    console.log("oh, year undefined !!");
    return;
}

// do it
var ts = new TeamStandings(year);
var allTeams = ts.getAllTeam();

var i = 0;
var getTeamStatistics = setInterval(function() {
    if (i == allTeams.length) {
        clearInterval(getTeamStatistics);
        return;
    }
    new TeamStatistics(allTeams[i++].id, year);
}, 1500);