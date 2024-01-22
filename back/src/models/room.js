const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    statement: {
        type: String,
        required: true
    },
    clue: String,
    answer: {
        type: String,
        required: true
    },
    clueImage: {
        type: String,
        required: false
    },
    answerImage: {
        type: String,
        required: false
    }
});

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: String,
    createdAt: {
        type: Date,
        default: new Date()
    },
    questions: [questionSchema]
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;