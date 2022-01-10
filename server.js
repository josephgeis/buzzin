require("dotenv").config();

const path = require("path");

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {});

class Game {
  constructor(gamePin, gameName) {
    this.gamePin = gamePin;
    this.gameName = gameName;
    this.activePlayer = null;

    this.setActivePlayer = this.setActivePlayer.bind(this);
    this.clearActivePlayer = this.clearActivePlayer.bind(this);
  }

  setActivePlayer(id, name) {
    this.activePlayer = {
      id,
      name,
    };
  }

  clearActivePlayer() {
    this.activePlayer = null;
  }
}

let games = {};

function generateGamePin() {
  let gamePin;
  do {
    gamePin = (() => {
      let pin = "";
      let length = Math.floor(Math.random() * 3) + 6;
      for (let i = 0; i < length; i++) {
        pin += Math.floor(Math.random() * 10);
      }
      return pin;
    })();
  } while (games[gamePin]);

  return gamePin;
}

app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

io.on("connection", (socket) => {
  console.log("a wild socket appears! " + socket.id);

  // MARK: Game join flow
  socket.on("game/checkPin", (data, res) => {
    console.log("game/checkPin", data.gamePin);

    let game = games[data.gamePin];

    if (!game) {
      res({ err: "Game doesn't exist." });
    } else {
      res({
        gamePin: game.gamePin,
        gameName: game.gameName,
      });
    }
  });

  socket.on("game/join", (data, res) => {
    console.log("game/join", data);

    let game = games[data.gamePin];

    if (!game) {
      res({ err: "Game doesn't exist." });
    } else {
      res({
        gamePin: game.gamePin,
        gameName: game.gameName,
      });
    }

    socket.join(`${data.gamePin}/player`);

    socket.data.gamePin = data.gamePin;
    socket.data.playerName = data.playerName;

    res({
      ...game,
    });
  });

  // MARK: Game create flow
  socket.on("game/create", (data, res) => {
    // Create a new game
    console.log("game/create", data);

    // Generate a new unique game pin
    let gamePin = generateGamePin();

    // Store the game pin and game data
    let game = new Game(gamePin, data.gameName);
    games[gamePin] = game;

    // Subscribe the client to host events
    socket.join(`${gamePin}/host`);
    socket.data.hostedGame = gamePin;

    // Return the game pin and game name as confirmation
    res({
      ...game,
    });
  });

  socket.on("game/buzz", (data, res) => {
    console.log("game/buzz", data);

    let game = games[socket.data.gamePin];

    if (!game) {
      res({ err: "Game doesn't exist." });

      return;
    }

    if (!game.activePlayer) {
      game.setActivePlayer(socket.id, socket.data.playerName);
      socket
        .to([`${game.gamePin}/player`, `${game.gamePin}/host`])
        .emit("game/update", {
          ...game,
        });

      res({
        ...game,
      });
    }
  });

  socket.on("game/reset", (data, res) => {
    console.log("game/reset", data);

    let game = games[socket.data.hostedGame];

    if (!game) {
      // res({ err: "Game doesn't exist." });
      console.log("game/reset", "Game doesn't exist.");
      return;
    }

    game.clearActivePlayer();
    socket
      .to([`${game.gamePin}/player`, `${game.gamePin}/host`])
      .emit("game/update", {
        ...game,
      });

    res({
      ...game,
    });
  });

  socket.on("disconnect", (reason) => {
    // If the client is hosting a game, remove the game
    if (socket.data.hostedGame) {
      console.log("ended game", socket.data.hostedGame);
      delete games[socket.data.hostedGame];

      // notify players that the game has ended
      socket.to(`${socket.data.hostedGame}/player`).emit("game/end");

      io.in(`${socket.data.hostedGame}/player`).socketsLeave(
        `${socket.data.hostedGame}/player`
      );
    }
  });
});

server.listen(process.env.PORT || 8080);
