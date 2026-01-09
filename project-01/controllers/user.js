const User = require('../models/user');

const MOCK_DATA_FILE_PATH = './data/MOCK_DATA.json';

// let users = require(MOCK_DATA_FILE_PATH);

async function handleGetAllFormattedUsers(req, res, next) {
  console.log('req.url', req.url);
  console.log('req.baseUrl', req.baseUrl);
  console.log('req.originalUrl', req.originalUrl);

  // Source -> https://expressjs.com/en/guide/routing.html
  if (req.baseUrl !== '/users') {
    return next();
  }

  const allDbUsers = await User.find({});

  const html = `
    <p style="font-weight: bold; margin-bottom: 1.75rem; margin-left: 1rem;">List of users (${
      allDbUsers.length
    }):</p>

    <ul style="display: flex; flex-direction: column; gap: 1rem;">
      ${allDbUsers
        .map(
          (user) =>
            `<li>${user.firstName} ${user.lastName} (${user.gender}) - ${user.email}</li>`,
        )
        .join('')}
    </ul>
  `;

  return res.send(html);
}

async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});

  // set custom header (always prefix `X-` to denote a custom header)
  res.setHeader('X-Full-Name', 'Anmol Shah');

  return res.json(allDbUsers);
}

async function handleGetUserById(req, res) {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res
      .status(404)
      .json({ status: 'failed', message: 'User not found' });
  } else {
    return res.json(user);
  }
}

async function handleUpdateUserById(req, res) {
  const { id } = req.params;
  const body = req.body;

  if (!body) {
    return res.status(400).send({
      status: 'failed',
      message: 'all fields are missing',
      missingFields: FORM_DATA_KEYS,
    });
  }

  const result = await User.findByIdAndUpdate(id, {
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  // if (!user) {
  //   return res
  //     .status(404)
  //     .json({ status: 'failed', message: 'User not found' });
  // }

  // users = users.map((user) => {
  //   if (user.id === id) {
  //     return {
  //       ...user,
  //       ...body,
  //     };
  //   }

  //   return user;
  // });

  // fs.writeFile(MOCK_DATA_FILE_PATH, JSON.stringify(users), (error) => {
  //   if (error) {
  //     console.log('Patch req error: ', error);

  //     return res.status(500).send({
  //       status: 'failed',
  //       message: `An error occurred while updating the user with ID: ${id}`,
  //     });
  //   }

  //   const updatedUser = users.find((user) => user.id === id);

  //   return res.send(updatedUser);
  // });

  return res.status(200).send({ status: 'success', user: result });
}

async function handleDeleteUserById(req, res) {
  const { id } = req.params;

  // const user = users.find((user) => user.id === id);

  // if (!user) {
  //   return res
  //     .status(404)
  //     .send({ status: 'failed', message: 'User not found' });
  // }

  // users = users.filter((user) => user.id !== id);

  // fs.writeFile(MOCK_DATA_FILE_PATH, JSON.stringify(users), (error) => {
  //   if (error) {
  //     console.log('Delete req error: ', error);

  //     return res.status(500).send({
  //       status: 'failed',
  //       message: `An error occurred while deleting the user with ID: ${id}`,
  //     });
  //   }

  //   return res.send(users);
  // });

  const result = await User.findByIdAndDelete(id);

  return res.status(200).json({ status: 'success', userId: result._id });
}

async function handleCreateNewUser(req, res) {
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

  // const newUser = {
  //   id,
  //   first_name: body.first_name,
  //   last_name: body.last_name,
  //   email: body.email,
  //   gender: body.gender,
  //   job_title: body.job_title,
  // };

  // users.push(newUser);

  // fs.writeFile(MOCK_DATA_FILE_PATH, JSON.stringify(users), (error) => {
  //   if (error) {
  //     console.log('Post req error: ', error);

  //     return res
  //       .status(500)
  //       .send({ message: 'An error occurred while creating a new user' });
  //   }

  //   const createdUser = users.find((user) => user.id === id);

  //   return res.status(201).send({ status: 'success', user: createdUser });
  // });

  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  res.status(201).json({ status: 'success', user: result });
}

module.exports = {
  handleGetAllFormattedUsers,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
};
