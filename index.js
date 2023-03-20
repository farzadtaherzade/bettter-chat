const express = require("express");
const app = express();
const server = require("http").createServer(app);

const port = 3000;
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.set("view engine", "ejs");
let username = "";

app.get("/chat", (req, res) => {
  res.render("chat", { username: username });
});

app.get("/", (req, res) => {
  res.render("home");
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("user: ", socket.id);

  socket.on("new-user", (data) => {
    socket.broadcast.emit("update", `new user ${data}`);
    username = data;
  });
  socket.on("message", (data) => {
    socket.broadcast.emit("message", { data, username });
  });
});
