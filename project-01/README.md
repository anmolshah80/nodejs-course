## Create REST API

- Generate realistic test data in JSON from [Mockaroo](https://www.mockaroo.com/)

- Create `/users` endpoint to send the HTML for users data mapped in `ul` and `li` elements

- Create `/api/users` REST API endpoint to fetch the JSON data from `data/MOCK_DATA.json`

- Create `/api/users/:id` REST API endpoint to fetch the JSON data of the user with specified user ID

- Group together `/api/users/:id` REST API endpoint to fetch a single user with `GET` request method, create a new user with `POST` request method, and delete an existing user with `DELETE` request method

- Add `uuid` npm package to generate a string of random characters for user ID

- Add `nodemon` npm package as a dev dependency to automatically restart the dev server whenever a file change happens
