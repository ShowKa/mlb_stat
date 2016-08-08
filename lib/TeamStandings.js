const wget = require('node-wget');
const fs = require('fs');
const async = require('async');
const constants = require('./constants.js');

const tmpDir = "./tmp/";

/** チームの強さ基準(これより勝率が高ければAクラス) */
const strengthReference = 0.56;

/**
 * constructor
 */
var TeamStandings = function(year) {

    this.year = year;

    var standingFilePath = tmpDir + "standings_" + year + ".json";

    try {

        var d = fs.readFileSync(standingFilePath, {
            encoding: "UTF-8"
        });
        this.standings = JSON.parse(d);

    } catch (e1) {

        // API GET
        var wgetStandings = {
            url: constants.URL + "seasontd/" + year + "/REG/standings.json?api_key=" + constants.API_KEY,
            dest: tmpDir,
            timeout: 20000
        };

        var wfFuncs = [function(next) {
            wget(wgetStandings, function(error, response, body) {
                next(null, error, response, body);
            });
        }, function(error, response, body, next) {
            this.standings = JSON.parse(body);
            fs.renameSync(response.filepath, standingFilePath);
            next(null);
        }];

        async.waterfall(wfFuncs);
    }
};

/**
 * standingsのJsonからチームデータ抽出。
 */
TeamStandings.prototype.getAllTeam = function() {
    var ret = [];
    this.standings.league.season.leagues.forEach(function(league) {
        league.divisions.forEach(function(division) {
            division.teams.forEach(function(team) {
                if (team.win_p > strengthReference) {
                    team.strength = "A";
                } else {
                    team.strength = "B";
                }
                ret.push(team);
            });
        });
    });
    return ret;
}

/**
 * チームデータ抽出
 */
TeamStandings.prototype.getTeam = function(abbr) {
    var all = this.getAllTeam();
    var ret;
    all.forEach(function(team) {
        if (team.abbr == abbr) {
            ret = team;
        }
    });
    return ret ? ret : {};
}

/**
 * チームデータ抽出
 */
TeamStandings.prototype.getTeamById = function(id) {
    var all = this.getAllTeam();
    var ret;
    all.forEach(function(team) {
        if (team.id == id) {
            ret = team;
        }
    });
    return ret ? ret : {};
}

/**
 * teamID を 配列につめて返却。
 * ヒマがあれば、leagueを指定すればその所属チームのIDだけをできるように拡張する。 
 */
TeamStandings.prototype.getTeamIds = function() {
    var ret = [];
    var teams = this.getAllTeam();
    teams.forEach(function(team) {
        ret.push(team.id);
    });
    return ret;
}

module.exports = TeamStandings;