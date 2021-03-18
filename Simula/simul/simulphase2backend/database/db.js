const mysql = require('mysql');

const connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'thisIsASimulPassword1!',
  database  : 'simul'
});

connection.connect(function(err) {
  if (err) throw err;
});

module.exports = (req, res, next) => {
  req.db = connection;
  next();
}
