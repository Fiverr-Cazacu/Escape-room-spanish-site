import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import RoomsRouter from "./routers/rooms";
import SessionsRouter from "./routers/sessions";
import TeamRouter from "./routers/teams";

dotenv.config();
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors())

console.log()

mongoose.connect("mongodb+srv://escape:escape12345@escaperoom.ro7f9ed.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("✅ Connected to database"))
    .catch((e) => console.log("❌ Failed to connect to database", e));

app.use("/api/rooms", RoomsRouter);
app.use("/api/sessions", SessionsRouter);
app.use("/api/teams", TeamRouter);

app.listen(process.env.PORT || 8000, () => {
    console.log("✅ Server started on port:", process.env.PORT || 8000);
});