import express, { Request, Response, Router, NextFunction } from "express";
//const User = require("../models/User");
const router: Router = express.Router();
const jwt = require("jsonwebtoken");
import { UserModel } from "../models/User";
interface CustomRequest extends Request {
  user?: any;
}

interface Payload {
  userId: string;
  email: string;
  password: string;
}

export default function requireAuth(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  // Get the user from the jwt token and add id to req object
  const authorization = req.headers.authorization as string;
  if (!authorization) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
    return;
  }

  const token = authorization.replace("Bearer ", "");
  console.log(token);
  jwt.verify(
    token,
    "MY_SECRET_KEY",
    async (err: any, payload: Payload | undefined) => {
      if (err || !payload) {
        res.status(401).send({ error: "You must be logged in" });
        return;
      }

      const { userId, email } = payload;
      console.log(payload);
      console.log(userId);

      try {
        const user = await UserModel.findById(userId);
        console.log(user);

        if (!user) {
          res.status(401).send({ error: "User not found" });
          return;
        }

        req.user = user;
        next();
      } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).send({ error: "Internal server error" });
      }
    }
  );
}
