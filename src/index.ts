import express, { Request, Response, Router } from "express";
import authRoutes from './routes/authRoutes';
import requireAuth from './middlewares/requireAuth';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import trackRoutes from './routes/trackRoutes'

interface CustomRequest extends Request {
  user?: any;
}

const app = express();
const router: Router = express.Router();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes)

const mongoURI =
  "mongodb+srv://mitaligadiya07:z0014Y3hDK912ZXe@cluster0.pqphljn.mongodb.net/Tracker?retryWrites=true&w=majority";

mongoose.connect(mongoURI);
mongoose.connection.on('connected', () => {
  console.log("connected to mongo");
});
mongoose.connection.on('error', (err: Error) => {
  console.error("error connected to mongo", err);
});

app.get('/', requireAuth, (req: CustomRequest, res: Response) => {
  res.send(`your email: ${req.user.email}`);
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
