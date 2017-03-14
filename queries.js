var promise = require('bluebird');
var config = require('config');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);

var dbConfig = config.get('dbConfig');
// var connectionString = 'postgres://localhost:5432/puppies';
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
    db.any('SELECT * FROM view_hourly ORDER BY row_number;')
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
module.exports = {
  getLiveData: getLiveData,
  getHourly: getHourly
};