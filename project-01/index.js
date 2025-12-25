const express = require('express');

const users = require('./data/MOCK_DATA.json');

const app = express();

const PORT = process.env.PORT || 8000;

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
            `<li>${user.first_name} ${user.last_name} - ${user.email}</li>`,
        )
        .join('')}
    </ul>
  `;

  return res.send(html);
});

// REST API
app.get('/api/users', (req, res) => {
  return res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  const user = users.find((user) => user.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  } else {
    return res.json(user);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
