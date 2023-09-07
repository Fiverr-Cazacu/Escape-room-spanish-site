import Room from "../models/room";
import Session from "../models/session";
import express, {Request, Response} from "express";
import Joi from "joi";

const router = express.Router();

router.get("/:id", (req: Request, res: Response) => {
    Session.findById(req.query.sessionId)
        .then(session => {
            if (session === null)
                return res.status(404).json({
                    error: "Session not found."
                });
            session.teams.forEach(team => {
                if (team._id?.toString() === req.params.id)
                    res.json(team);
            });
        })
        .catch(() => res.status(404).json({
            error: "Session not found."
        }));
});

const createTeamSchema = Joi.object({
    name: Joi.string().required()
});

router.post("/", async (req: Request, res: Response) => {
    const {error} = createTeamSchema.validate(req.body);
    if (error)
        return res.status(400).json({ error });
    const session = await Session.findById(req.query.sessionId);
    if (!session)
        return res.status(404).json({
            error: "Session not found."
        });
    let crashed = false;
    session.teams.forEach((team) => {
        if (team.name === req.body.name) {
            crashed = true;
            return res.status(400).json({
                error: "Team already exists."
            });
        }
    });
    if (crashed)
        return;
    const room = await Room.findById(session.roomId);
    if (!room)
        return res.status(500).end();
    session.teams.push({
        name: req.body.name,
        answers: [],
        score: 0
    });
    session.save()
        .then((session) => res.send(session))
        .catch(() => res.status(404).json({
            error: "Room not found."
        }));
});

const submitQuestionSchema = Joi.object({
    questionIndex: Joi.number().required(),
    answer: Joi.string().required()
});

router.post("/:id/submit", (req: Request, res: Response) => {
    const {error} = submitQuestionSchema.validate(req.body);
    if (error)
        return res.status(400).json(error);
    Session.findById(req.query.sessionId)
        .then(async session => {
            if (session === null)
                return res.status(404).json({
                    error: "Session not found."
                });
            const team = session.teams.find(
                team => team._id?.toString() === req.params.id
            );
            if (!team)
                return res.status(404).json({
                    error: "Team not found."
                });
            try {
                const room = await Room.findById(session.roomId);
                if (!room)
                    return res.status(500).end();
                if (
                    req.body.questionIndex < 0 || 
                    req.body.questionIndex >= room.questions.length
                )
                    return res.status(400).json({
                        error: "Invalid question index."
                    });
                team.answers.push("Answered \"" + req.body.answer + "\" at " + new Date());
                res.json(await session.save());
            } catch {
                return res.status(500).end();
            }
        })
        .catch(() => res.status(404))
        .finally(() => res.status(200));
});

router.delete("/:teamId", (req: Request, res: Response) => {
    Session.findById(req.query.sessionId)
        .then((session) => {
            if (!session)
                return res.status(404).json({
                    error: "Session not found."
                });
            const oldLength = session.teams.length;
            session.teams = session.teams.filter((team) => team._id?.toString() !== req.params.teamId);
            if (session.teams.length === oldLength)
                return res.status(404).json({
                    error: "Team not found."
                });
            return res.json(session.save());
        })
        .catch(() => res.status(404).json({
            error: "Session not found."
        }));
});

export default router;