const fs = require('fs');

// fs.writeFileSync(
//   'test.txt',
//   'Hello, this is a test file created using Node.js fs module (synchronously).',
// );

// fs.writeFile(
//   'test-async.txt',
//   'Hello, this is a test file created using Node.js fs module (asynchronously).',
//   (error) => {
//     if (error) {
//       console.log(
//         'There was a problem writing contents to the file asynchronously.',
//       );

//       console.error('error: ', error);
//     } else {
//       console.log('File written successfully (asynchronously).');
//     }
//   },
// );

const contactsSync = fs.readFileSync('contacts.txt', {
  encoding: 'utf-8',
});

console.log('Contacts (synchronously):', contactsSync);

fs.readFile('contacts-async.txt', { encoding: 'utf-8' }, (error, data) => {
  if (error) {
    console.log('There was a problem reading the file asynchronously.');

    console.error('error: ', error);
  } else {
    console.log('Contacts (asynchronously):', data);
  }
});

fs.appendFileSync('./test.txt', new Date().toISOString());

// to copy a file synchronously
// fs.cpSync('./test.txt', './test-copy.txt');

// to delete a file synchronously
// fs.unlinkSync('./test-copy.txt');

const stats = fs.statSync('./test.txt');

console.log('File stats:', stats);

fs.mkdirSync('./my-docs/2025/reports', { recursive: true });
