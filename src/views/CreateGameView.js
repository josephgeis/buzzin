import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import FullScreenLayout from "../layouts/FullScreenLayout";
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
        navigate("/admin");
      }
    });
  };

  return (
    <FullScreenLayout className="bg-teal-500 text-white">
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
    </FullScreenLayout>
  );
}

export default CreateGameView;
