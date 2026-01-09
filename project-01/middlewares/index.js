const fs = require('fs');

function logRequestDetails(filename) {
  return (req, res, next) => {
    const logData = `\n${Date.now()}: ${req.method} ${req.url} from IP ${
      req.ip
    }`;

    fs.appendFile(filename, logData, (error) => {
      if (error) {
        console.log('Error logging the request info: ', error);
      }

      next();
    });
  };
}

module.exports = {
  logRequestDetails,
};
