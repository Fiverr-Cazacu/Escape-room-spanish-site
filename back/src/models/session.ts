import mongoose  from "mongoose";

export interface ITeam {
    _id?: mongoose.Schema.Types.ObjectId,
    name: string,
    answers: string[],
    answered: string[],
    clued: boolean[],
    score: number
}

const teamSchema = new mongoose.Schema<ITeam>({
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

export interface ISession {
    _id?: mongoose.Schema.Types.ObjectId,
    name: string
    roomId: mongoose.Schema.Types.ObjectId,
    teams: ITeam[],
    duration: number,
    startedAt?: Date,
    createdAt: Date
}

const sessionSchema = new mongoose.Schema<ISession>({
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

const Session = mongoose.model<ISession>("Session", sessionSchema);
export default Session;