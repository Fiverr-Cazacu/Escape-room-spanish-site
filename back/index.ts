import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import RoomsRouter from "./src/routers/rooms";
import SessionsRouter from "./src/routers/sessions";
import TeamRouter from "./src/routers/teams";

dotenv.config();
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors())

mongoose.connect("mongodb+srv://escape:escape12345@escaperoom.ro7f9ed.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("✅ Connected to database"))
    .catch((e: any) => console.log("❌ Failed to connect to database", e));

app.use("/api/rooms", RoomsRouter);
app.use("/api/sessions", SessionsRouter);
app.use("/api/teams", TeamRouter);

app.listen(5000, () => {
    console.log("✅ Server started on port:", 5000);
});

export default app;