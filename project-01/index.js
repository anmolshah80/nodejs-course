const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const MOCK_DATA_FILE_PATH = './data/MOCK_DATA.json';

let users = require(MOCK_DATA_FILE_PATH);

const app = express();

const PORT = process.env.PORT || 8000;

const FORM_DATA_KEYS = [
  'first_name',
  'last_name',
  'email',
  'gender',
  'job_title',
];

// Middleware
app.use(express.urlencoded({ extended: false }));

// Middleware
app.use((req, res, next) => {
  const logData = `\n${Date.now()}: ${req.method} ${req.url} from IP ${req.ip}`;

  fs.appendFile('log.txt', logData, (error) => {
    if (error) {
      console.log('Error logging the request info: ', error);
    }

    next();
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

app.get('/users', (req, res) => {
  const html = `
    <p style="font-weight: bold; margin-bottom: 1.75rem; margin-left: 1rem;">List of users (${
      users.length
    }):</p>

    <ul style="display: flex; flex-direction: column; gap: 1rem;">
      ${users
        .map(
          (user) =>
            `<li>${user.first_name} ${user.last_name} (${user.gender}) - ${user.email}</li>`,
        )
        .join('')}
    </ul>
  `;

  return res.send(html);
});

// REST API
app.get('/api/users', (req, res) => {
  // set custom header (always prefix `X-` to denote a custom header)
  res.setHeader('X-Full-Name', 'Anmol Shah');

  return res.json(users);
});

// Route grouping
app
  .route('/api/users/:id')
  .get((req, res) => {
    const { id } = req.params;

    const user = users.find((user) => user.id === id);

    if (!user) {
      return res
        .status(404)
        .json({ status: 'failed', message: 'User not found' });
    } else {
      return res.json(user);
    }
  })
  .patch((req, res) => {
    const { id } = req.params;
    const body = req.body;

    if (!body) {
      return res.status(400).send({
        status: 'failed',
        message: 'all fields are missing',
        missingFields: FORM_DATA_KEYS,
      });
    }

    const user = users.find((user) => user.id === id);

    if (!user) {
      return res
        .status(404)
        .json({ status: 'failed', message: 'User not found' });
    }

    users = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          ...body,
        };
      }

      return user;
    });

    fs.writeFile(MOCK_DATA_FILE_PATH, JSON.stringify(users), (error) => {
      if (error) {
        console.log('Patch req error: ', error);

        return res.status(500).send({
          status: 'failed',
          message: `An error occurred while updating the user with ID: ${id}`,
        });
      }

      const updatedUser = users.find((user) => user.id === id);

      return res.send(updatedUser);
    });
  })
  .delete((req, res) => {
    const { id } = req.params;

    const user = users.find((user) => user.id === id);

    if (!user) {
      return res
        .status(404)
        .send({ status: 'failed', message: 'User not found' });
    }

    users = users.filter((user) => user.id !== id);

    fs.writeFile(MOCK_DATA_FILE_PATH, JSON.stringify(users), (error) => {
      if (error) {
        console.log('Delete req error: ', error);

        return res.status(500).send({
          status: 'failed',
          message: `An error occurred while deleting the user with ID: ${id}`,
        });
      }

      return res.send(users);
    });
  });

app.post('/api/users', (req, res) => {
  const id = uuidv4();

  const body = req.body;

  if (!body) {
    return res.status(400).send({
      status: 'failed',
      message: 'all fields are missing',
      missingFields: FORM_DATA_KEYS,
    });
  }

  const bodyProperties = Object.keys(body);

  const isFormDataValid = FORM_DATA_KEYS.every((value) => {
    if (bodyProperties.includes(value)) return true;

    return false;
  });

  const missingFields = FORM_DATA_KEYS.filter(
    (formDataKey) => !bodyProperties.includes(formDataKey),
  );

  if (!isFormDataValid) {
    return res.status(400).send({
      status: 'failed',
      message: 'some fields are missing',
      missingFields,
    });
  }

  const newUser = {
    id,
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title,
  };

  users.push(newUser);

  fs.writeFile(MOCK_DATA_FILE_PATH, JSON.stringify(users), (error) => {
    if (error) {
      console.log('Post req error: ', error);

      return res
        .status(500)
        .send({ message: 'An error occurred while creating a new user' });
    }

    const createdUser = users.find((user) => user.id === id);

    return res.status(201).send({ status: 'success', user: createdUser });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
