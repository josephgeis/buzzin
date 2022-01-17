import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import ReactGA from "react-ga4";

import Footer from "../components/Footer";
import { useSocket } from "../SocketProvider";
import { useThemeColor, useTitle } from "../utils";

function CreateGameView() {
  const navigate = useNavigate();
  const socket = useSocket();
  const dispatch = useDispatch();

  useTitle("Create Game - Buzz-In");
  useThemeColor("#14b8a6");

  let [gameName, setGameName] = useState("");

  const createGame = (e) => {
    e.preventDefault();
    dispatch({ type: "loading/start" });
    socket.emit("game/create", { gameName }, (res) => {
      dispatch({ type: "loading/stop" });
      if (res.err) {
        console.log(res.err);
      } else {
        dispatch({
          type: "game/setGameData",
          payload: {
            gamePin: res.gamePin,
            gameName: res.gameName,
          },
        });

        if (process.env.REACT_APP_ENABLE_GA === "true") {
          ReactGA.event({
            category: "Buzz-In",
            action: "Create Game",
          });
        }

        navigate("/admin");
      }
    });
  };

  return (
    <div
      className={
        "w-full h-full flex flex-col bg-teal-500 justify-center items-center text-white"
      }
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-4xl font-black">Buzz-In</h1>
        <h2 className="text-lg font-bold">Create Game</h2>
        <form
          className="flex flex-col items-center space-y-2"
          onSubmit={createGame}
        >
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="text-black font-semibold text-center rounded h-10"
            maxLength="18"
            placeholder="Game Name"
            aria-placeholder="Enter Game Name"
            aria-label="Game Name"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white font-semibold rounded h-10 w-full"
          >
            Create Game
          </button>
        </form>
        <p>or</p>
        <button
          className="bg-gray-50 text-gray-800 font-semibold rounded h-10 w-full"
          onClick={() => navigate("/")}
        >
          Join Game
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default CreateGameView;
