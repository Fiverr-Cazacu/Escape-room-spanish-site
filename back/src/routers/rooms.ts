import Room, { IRoom } from "../models/room";
import express, {Request, Response} from "express";
import Joi from "joi";
import Session from "../models/session";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    Room.find({})
        .then((rooms: IRoom[]) => res.send(rooms))
        .catch(() => res.status(500).json());
});

router.get("/:id", (req: Request, res: Response) => {
    Room.findById(req.params.id)
        .then(room => {
            if (room === null)
                return res.status(404).json({
                    "error": "Room not found."
                });
            res.json(room)
        })
        .catch(() => res.status(404).json({
            "error": "Room not found."
        }));
});

const createRoomSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    questions: Joi.array().items(Joi.object({
        statement: Joi.string().required(),
        clue: Joi.string(),
        answer: Joi.string().required(),
        clueImage: Joi.string().required(),
        answerImage: Joi.string().required()
    })).required().min(1)
});

router.post("/", (req: Request, res: Response) => {
    console.log(req.body)
    const {error} = createRoomSchema.validate(req.body);
    if (error)
        return res.status(400).json({ error });
    const room = new Room(req.body);
    console.log(room)
    room.save()
        .then((room: IRoom) => res.send(room))
        .catch(() => res.status(400).json({
            error: "Name is already used."
        }));
});

router.put("/:id", (req: Request, res: Response) => {
    Room.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.end())
        .catch(() => res.status(404).json({
            error: "Room not found."
        }));
});

router.delete("/:id", (req: Request, res: Response) => {
    Room.findByIdAndDelete(req.params.id)
        .then(() => {
            Session.deleteMany({ roomId: new mongoose.Types.ObjectId(req.params.id) }).then(() => {res.end()}).catch();
        })
        .catch(() => res.status(404).json({
            error: "Room not found."
        }));
});

export default router