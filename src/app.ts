import { Response } from 'express';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
const DB_NAME = 'mongodb://localhost:27017/mestodb';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 30,
  },
  about: {
    type: String,
    minlength: 3,
    maxlength: 200,
  },
  avatar: String,
});
// определяем модель User
const UserModel = mongoose.model('User', userScheme);

// Database connection
mongoose.connect(DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));

const USERS_URL = 'users';

app.get(`/${USERS_URL}`, async (req: Request, res: Response) => {
  const users = await UserModel.find();
  res.send(users).status(200);
});

app.get(`/${USERS_URL}/:userId`, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById((req as unknown as { params: { userId: string } }).params.userId);
    res.send(user);
  } catch (error) {
    res.status(404).send({ message: 'Book not found' });
  }
});

app.post(`/${USERS_URL}`, async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body as unknown as IUser;
  const user = new UserModel({ name, about, avatar });
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// region Card
const cardScheme = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 30,
  },
  link: String,
  owner: mongoose.ObjectId,
  likes: {
    type: [mongoose.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
// определяем модель User
const CardModel = mongoose.model('Card', cardScheme);
// создаем объект модели User
const card = new CardModel({ name: 'Карл', about: 'Карл у Клары украл кораллы', avatar: 'https://polinka.top/uploads/posts/2023-05/1682909181_polinka-top-p-kartinki-na-avatarku-krutie-krasivo-2.jpg' });

// endregion Card
