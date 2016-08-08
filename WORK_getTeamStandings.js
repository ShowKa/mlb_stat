const argv = require("argv");

const TeamStandings = require("./lib/TeamStandings");

// arg
var year = argv.run().targets[0];
if (!year) {
    console.log("oh, year undefined !!");
    return;
}

// do it
var ts = new TeamStandings(year);