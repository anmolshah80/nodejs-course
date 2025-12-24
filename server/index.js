// const os = require('os');
const http = require('http');
const express = require('express');
// const fs = require('fs');
// const url = require('url');

// Log the number of CPU cores available
// console.log(os.cpus().length);

// Create an HTTP server using the built-in 'http' module
// and handle incoming requests with 'myHandler' function
// const myHandler = (req, res) => {
//   console.log('Request received');

//   // Source - https://stackoverflow.com/a/19524949
//   const ipAddress =
//     (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
//     req.socket.remoteAddress ||
//     null;

//     const parsedUrl = url.parse(req.url, true);

//   console.log('parsedUrl: ', parsedUrl);

//   fs.appendFile(
//     'log.txt',
//     `${new Date().toISOString()}: ${req.url} from ${ipAddress}\n`,
//     (err) => {
//       if (err) {
//         console.error('Error writing to log file: ', err);
//       }

//       switch (parsedUrl.pathname) {
//         case '/':
//           res.end('Welcome to the homepage!');
//           break;
//         case '/about':
//           res.end('This is the about page.');
//           break;
//         case '/search':
//           const query = parsedUrl.query.search_query;

//           res.end('You searched for: ' + query);

//           break;
//         default:
//           res.end('404 Not Found');
//       }
//     },
//   );
// }

// const server = http.createServer(myHandler);

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

app.get('/about', (req, res) => {
  res.send(`This is the about page ${req.query.name || ''}`);
});

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});
