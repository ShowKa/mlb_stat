const wget = require('node-wget');
const fs = require('fs');
const async = require('async');
const constants = require('./constants.js');
const merge = require('merge');

const tmpDir = "./tmp/";

var TeamStatistics = function(teamId, year) {

    this.teamId = teamId;
    this.year = year;

    var statFilePath = tmpDir + "stat_" + year + "_" + teamId + ".json";

    try {
        var d = fs.readFileSync(statFilePath, {
            encoding: "UTF-8"
        });
        this.stats = JSON.parse(d);

    } catch (e1) {
        // API GET
        var wgetSetting = {
            url: constants.URL + "seasontd/" + year + "/REG/teams/" + teamId + "/statistics.json?api_key=" + constants.API_KEY,
            dest: statFilePath,
            timeout: 20000
        };

        console.log("フィアル取得に失敗したのでAPIから再取得 : " + wgetSetting.url);

        var wfFuncs = [function(next) {
            wget(wgetSetting, function(error, response, body) {
                if (error) {
                    console.log(error);
                }
                next(null, error, response, body);
            });
        }, function(error, response, body, next) {
            this.stats = JSON.parse(body);
            console.log("ファイル取得成功 : " + statFilePath);
            next(null);
        }];

        async.waterfall(wfFuncs);
    }
};

/**
 * ヒッティングデータ取得.
 */
TeamStatistics.prototype.getHititng = function() {
    var d = this.stats;
    var dest = {};

    // チーム名略称
    dest.abbr = d.abbr;

    // 年度
    dest.year = d.season.year;

    merge(dest, createStatisticsJson(d.statistics.hitting, "hitting"));
    merge(dest, createStatisticsJson(d.statistics.hitting.onbase, "hitting.onbase"));
    merge(dest, createStatisticsJson(d.statistics.hitting.runs, "hitting.runs"));
    merge(dest, createStatisticsJson(d.statistics.hitting.outcome, "hitting.outcome"));
    merge(dest, createStatisticsJson(d.statistics.hitting.outs, "hitting.outs"));
    merge(dest, createStatisticsJson(d.statistics.hitting.steal, "hitting.steal"));
    return dest;
}

/**
 * フィールディングデータ取得.
 */
TeamStatistics.prototype.getFielding = function() {
    var d = this.stats;
    var dest = {};

    // チーム名略称
    dest.abbr = d.abbr;

    // 年度
    dest.year = d.season.year;

    merge(dest, createStatisticsJson(d.statistics.fielding, "fielding"));
    return dest;
}

/**
 * ピッチングデータ取得.
 */
TeamStatistics.prototype.getPitching = function() {
    var d = this.stats;
    var dest = {};

    // チーム名略称
    dest.abbr = d.abbr;

    // 年度
    dest.year = d.season.year;

    merge(dest, createStatisticsJson(d.statistics.pitching, "pitching"));
    merge(dest, createStatisticsJson(d.statistics.pitching.onbase, "pitching.onbase"));
    merge(dest, createStatisticsJson(d.statistics.pitching.runs, "pitching.runs"));
    merge(dest, createStatisticsJson(d.statistics.pitching.outcome, "pitching.outcome"));
    merge(dest, createStatisticsJson(d.statistics.pitching.outs, "pitching.outs"));
    merge(dest, createStatisticsJson(d.statistics.pitching.steal, "pitching.steal"));
    merge(dest, createStatisticsJson(d.statistics.pitching.games, "pitching.games"));
    return dest;
}

/**
 * 統計データ等を必要な形に加工しなおす。
 */
function createStatisticsJson(data, newKey) {
    var ret = {};
    for (var _k in data) {
        var _d = data[_k];
        if (typeof _d == "number") {
            ret[newKey + "." + _k] = _d;
        }
    }
    return ret;
}

/**
 * id属性のキーを _id に無理矢理変換(mongoへの挿入を想定して作成)
 */
function converIdKey(jsonData) {
    var idValue = jsonData.id;
    jsonData._id = idValue;
    delete jsonData.id;
    return jsonData;
}

module.exports = TeamStatistics;