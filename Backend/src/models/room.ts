import mongoose from "mongoose";

export interface IQuestion {
    statement: string,
    clue?: string,
    answer: string
}

const questionSchema = new mongoose.Schema<IQuestion>({
    statement: {
        type: String,
        required: true
    },
    clue: String,
    answer: {
        type: String,
        required: true
    }
});

export interface IRoom {
    name: string,
    description?: string,
    createdAt: Date,
    questions: IQuestion[]
}

const roomSchema = new mongoose.Schema<IRoom>({
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

const Room = mongoose.model<IRoom>("Room", roomSchema);
export default Room;