const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { createClient } = require("redis");

const client = createClient();

const port = 3000;
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.set("view engine", "ejs");

const initialMessages = async (socket) => {
  client.lrange("message", 0, -1, (err, data) => {
    data.map((item) => {
      const [username, message] = item.split(":");
      socket.emit("message", { username, message });
    });
  });
};

app.get("/chat", (req, res) => {
  const { username } = req.query;
  res.render("chat", { username: username });
});

app.get("/", (req, res) => {
  res.render("home");
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

io.on("connection", async (socket) => {
  initialMessages(socket);
  socket.on("message", async ({ username, message }) => {
    client.lpush("message", `${username}:${message}`);
    io.emit("message", { username, message });
  });
});
