import { Request, Response, Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import TrackModel from "../models/Track";
import { IUser } from "../models/User";

interface CustomRequest extends Request {
  user?: IUser;
}

const router: Router = Router();

router.use(requireAuth);

router.get('/tracks', async (req: CustomRequest, res: Response) => {
  try {
    const tracks = await TrackModel.find({ userId: req.user?._id });
    res.send(tracks);
  } catch (error) {
    console.error("Error retrieving tracks:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post('/tracks',async(req: CustomRequest, res: Response)=>{
    const {name,locations}=req.body;
    if(!name||!locations){
        return res.status(422).send({error:"you must provide name and location"})
    }
    try{
    const track=new TrackModel({name,locations,userId:req.user?._id})
    await track.save();
    res.send(track)}
    catch(err){
        return res.status(422).send({error:"you must provide name and location"})

    }


})

export default router;
