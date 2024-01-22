const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    answers: [mongoose.Schema.Types.Mixed],
    answered: [mongoose.Schema.Types.Mixed],
    clued: [mongoose.Schema.Types.Mixed],
    score: {
        type: Number,
        required: true,
        default: 0
    },
});

const sessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Room"
    },
    teams: [teamSchema],
    duration: {
        type: Number,
        required: true,
        default: 0
    },
    startedAt: Date,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;