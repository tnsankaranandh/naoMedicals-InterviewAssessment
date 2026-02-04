const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/conversations", require("./routes/conversation.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/summary", require("./routes/summary.routes"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


module.exports = app;
