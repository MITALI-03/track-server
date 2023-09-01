import express, { Request, Response, Router } from "express";
//const User = require("../models/User");
const router: Router = express.Router();
const jwt = require('jsonwebtoken');
require('../models/User')
import { UserModel } from "../models/User";

// Enable JSON parsing middleware
router.use(express.json());

router.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = new UserModel({ email, password });
    await user.save();
    const token=jwt.sign({userId:user._id},'MY_SECRET_KEY');
    res.send({token:token});
  } catch (err: any) {
    return res.status(422).send(err.message);
  }
});

router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(422).send({ error: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(422).send({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token: token });
  } catch (err: any) {
    return res.status(422).send({ error: 'Invalid email or password' });
  }
});
export default router;
