const express = require("express");
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");

// const RoomsRouter = require("./src/routers/rooms");
// const SessionsRouter = require("./src/routers/sessions");
// const TeamRouter = require("./src/routers/teams");

// dotenv.config();
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

// mongoose
//   .connect(
//     "mongodb+srv://escape:escape12345@escaperoom.ro7f9ed.mongodb.net/?retryWrites=true&w=majority"
//   )
//   .then(() => console.log("✅ Connected to database"))
//   .catch((e) => console.log("❌ Failed to connect to database", e));

// app.use("/api/rooms", RoomsRouter);
// app.use("/api/sessions", SessionsRouter);
// app.use("/api/teams", TeamRouter);

app.get("/", (req, res) => {
  res.json({ message: "Felicitari" });
});

app.listen(5000, () => {
  console.log("✅ Server started on port:", 5000);
});

module.exports = app;
