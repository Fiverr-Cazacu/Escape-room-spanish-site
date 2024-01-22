const express = require("express");
const { Request, Response } = require("express");
const Session = require("../models/session");
const Joi = require("joi");

const router = express.Router();

router.get("/", (req, res) => {
    Session.find({}) 
        .then((sessions) => res.json(sessions))
        .catch(() => res.status(500).json());
});

router.get("/:id", (req, res) => {
    Session.findById(req.params.id)
        .then((session) => res.json(session))
        .catch(() => res.status(404).end());
});

router.get("/:id/started", (req, res) => {
    Session.findById(req.params.id)
        .then((session) => {
            if (!session)
                return res.status(404).json({
                    error: "Session not found."
                });
            return res.json(session.startedAt !== undefined);
        })
        .catch(() => res.status(404).json({
            error: "Session not found."
        }));
});

router.get("/:id/running", (req, res) => {
    Session.findById(req.params.id)
        .then((session) => {
            if (!session)
                return res.status(404).json({
                    error: "Session not found."
                });
            if (session.startedAt === undefined)
                return res.json(false);
            const finishDate = session.startedAt;
            finishDate.setMinutes(finishDate.getMinutes() + session.duration);
            const now = new Date();
            console.log(now, finishDate, Number(finishDate) - Number(now));
            return res.json(+now - +finishDate);
        })
        .catch(() => res.status(404).json({
            error: "Session not found."
        }));
});

const createSessionSchema = Joi.object({
    roomId: Joi.string().required(),
    duration: Joi.number().required(),
    name: Joi.string().required()
});

router.post("/", (req, res) => {
    const {error} = createSessionSchema.validate(req.body);
    if (error)
        return res.status(400).json({error});
    const session = new Session(req.body);
    console.log(session)
    session.save()
        .then((session) => res.send(session))
        .catch(() => res.status(400).json({
            error: "Room not found."
        }));
});

const updateSessionSchema = Joi.object({
    duration: Joi.number().required()
});

router.put("/:id", (req, res) => {
    const {error} = updateSessionSchema.validate(req.body);
    if (error)
        return res.status(400).json({error});
    Session.findById(req.params.id)
        .then(async (session) => {
            if (!session)
                return res.status(404).json({
                    error: "Session not found."
                });
            if (session.startedAt !== undefined)
                return res.status(400).json({
                    error: "Session already started."
                });
            session.duration = req.body.duration;
            return res.json(await session.save());
        })
        .catch(() => res.status(404).json({
            error: "Session not found."
        }));
});

router.put("/:id/start", (req, res) => {
    Session.findById(req.params.id)
        .then(async (session) => {
            if (!session)
                return res.status(404).json({
                    error: "Session not found."
                });
            session.startedAt = new Date();
            return res.json(await session.save());
        })
        .catch(() => res.status(404).json({
            error: "Session not found."
        }));
});

router.put("/:id/stop", (req, res) => {
    Session.findById(req.params.id)
        .then(async (session) => {
            if (!session)
                return res.status(404).json({
                    error: "Session not found."
                });
            session.startedAt = undefined;
            return res.json(await session.save());
        });
});

router.put("/:id/end", (req, res) => {
    Session.findById(req.params.id)
        .then(async (session) => {
            if (!session)
                return res.status(404).json({
                    error: "Session not found."
                });
            session.startedAt = new Date('01.01.2000');
            return res.json(await session.save());
        });
});

router.delete("/:id", (req, res) => {
    Session.findByIdAndDelete(req.params.id)
        .then(() => res.end())
        .catch(() => res.status(404).json({
            error: "Session not found."
        }));
});

module.exports = router;