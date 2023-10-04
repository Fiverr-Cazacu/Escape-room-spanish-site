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
            session.teams.forEach(async team => {
                if (team._id?.toString() === req.params.id){
                    const room = await Room.findById(session.roomId);
                    console.log(team.answered)
                    return res.json({
                        roomName: room?.name,
                        questions: room?.questions.map((el, i) => {
                            console.log({statement: el.statement, clue: team.clued[i]?el.clue:null, clueImage: team.clued[i]?el.clueImage:null, answered: team.answered[i], answeredImage: team.answered[i]=='gave up'?el.answerImage:null});
                            return {statement: el.statement, clue: team.clued[i]?el.clue:null, clueImage: team.clued[i]?el.clueImage:null, answered: team.answered[i], answeredImage: team.answered[i]=='gave up'?el.answerImage:null}
                        }),
                        teamName: team.name,
                        score: team.score,
                        deadline: new Date(session.startedAt ?? new Date()).getTime() + session.duration
                    })
                }
            });
        })
        .catch((err) => {console.log(err); res.status(404).json({
            error: "Session not found."
        })});
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
        answered: Array(room.questions.length).fill('no'),
        clued: Array(room.questions.length).fill(false),
        score: 0
    });
    session.save()
        .then((session) => res.send(session))
        .catch(() => res.status(404).json({
            error: "Room not found."
        }));
});

const submitQuestionSchema = Joi.object({
    index: Joi.number().required(),
    answer: Joi.string().required()
});

const submitClueSchema = Joi.object({
    index: Joi.number().required()
});

router.post("/clue/:id", (req: Request, res: Response) => {
    const {error} = submitClueSchema.validate(req.body);
    if (error) return res.status(400).json(error);
    Session.findById(req.query.sessionId).then(async session => {
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
                req.body.index < 0 || 
                req.body.index >= room.questions.length
            )
                return res.status(400).json({
                    error: "Invalid question index."
                });
            if (team.clued[req.body.index] == true) {
                return res.json({error: "Clue already given."});
            }

            team.answers.push("Requested clue for question " + req.body.index + " at " + new Date());
            team.clued[req.body.index] = true;
            team.score -= 2;

            res.json(await session.save());
        } catch {
            return res.status(500).end();
        }
    })
    .catch(() => res.status(404))
    .finally(() => res.status(200));
});

router.post("/giveup/:id", (req: Request, res: Response) => {
    const {error} = submitClueSchema.validate(req.body);
    if (error) return res.status(400).json(error);
    Session.findById(req.query.sessionId).then(async session => {
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
                req.body.index < 0 || 
                req.body.index >= room.questions.length
            )
            
                return res.status(400).json({
                    error: "Invalid question index."
                });

            if (team.answered[req.body.index] != 'no') {
                return res.json({error: "Question already answered."});
            }

            team.answers.push("Gave up on question " + req.body.index + " at " + new Date());
            team.answered[req.body.index] = 'gave up';
            team.score -= 5;

            res.json(await session.save());
        } catch {
            return res.status(500).end();
        }
    })
    .catch(() => res.status(404))
    .finally(() => res.status(200));
});

router.post("/submit/:id", (req: Request, res: Response) => {
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
                    req.body.index < 0 || 
                    req.body.index >= room.questions.length
                )
                    return res.status(400).json({
                        error: "Invalid question index."
                    });
                team.answers.push("Answered \"" + req.body.answer + "\" at " + new Date() + " for question number " + req.body.index);
                if (req.body.answer === room.questions[req.body.index].answer) {
                    team.score += 10;
                    team.answered[req.body.index] = 'yes';
                } else {
                    team.score -= 2;
                }
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