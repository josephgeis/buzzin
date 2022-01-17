import { useNavigate } from "react-router";
import { useSocket } from "../SocketProvider";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useThemeColor, useTitle } from "../utils";
import FullScreenLayout from "../layouts/FullScreenLayout";

function JoinGameView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  useTitle("Buzz-In");
  useThemeColor("#a855f7");

  const joinState = useSelector((state) => state.join);

  let [playerName, setPlayerName] = useState("");

  const openGamePlayer = (e) => {
    e.preventDefault();
    dispatch({ type: "loading/start" });
    dispatch({ type: "join/setPlayerName", payload: playerName });
    navigate("/play");
  };

  return (
    <FullScreenLayout className="bg-purple-500 text-white">
      <h1 className="text-4xl font-black">Buzz-In</h1>
      <h2 className="text-lg font-bold">Joining {joinState.gameName}</h2>
      <form
        className="flex flex-col items-center space-y-2"
        onSubmit={openGamePlayer}
      >
        <input
          type="text"
          id="gamePin"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="text-black font-semibold text-center rounded h-10"
          maxLength="18"
          placeholder="Your Name"
          aria-placeholder="Enter Your Name"
          aria-label="Your Name"
        />
        <button
          type="submit"
          className="bg-gray-800 text-white font-semibold rounded h-10 w-full"
        >
          Play
        </button>
      </form>
      <p>or</p>
      <button
        className="bg-gray-50 text-gray-800 font-semibold rounded h-10 w-full"
        onClick={() => navigate("/")}
      >
        Go Back
      </button>
    </FullScreenLayout>
  );
}

export default JoinGameView;
