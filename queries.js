var promise = require('bluebird');
var config = require('config');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);

var dbConfig = config.get('dbConfig');
var db = pgp(dbConfig);

// add query functions

function getLiveData(req, res, next) {
    db.any('SELECT * FROM electricity.view_live_data')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved live data'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getHourly(req, res, next) {
    db.any('SELECT * FROM electricity_plotting.electricity_hourly_season;')
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved hourly data'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getHour(req, res, next) {
    var hour = parseInt(req.params.hour);
    db.one('SELECT * FROM view_hourly WHERE label = $1', hour)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved one hour of data'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}


module.exports = {
  getLiveData: getLiveData,
  getHourly: getHourly,
  getHour: getHour
};