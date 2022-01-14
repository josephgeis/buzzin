import { useNavigate, useParams } from "react-router";
import { useSocket } from "../SocketProvider";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useThemeColor, useTitle } from "../utils";
import Footer from "../components/Footer";

function HomeView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const { defaultGamePin } = useParams();

  let [gamePin, setGamePin] = useState(defaultGamePin);
  let [error, setError] = useState(null);

  useTitle("Buzz-In");
  useThemeColor("#a855f7");

  const setErrorMessage = (msg) => {
    setError(msg);
    setTimeout(() => {
      setError(null);
    }, 1000);
  };

  const checkGamePin = (e) => {
    e.preventDefault();
    dispatch({ type: "loading/start" });
    socket.emit("game/checkPin", { gamePin }, (res) => {
      dispatch({ type: "loading/stop" });
      if (res.err) {
        console.log(res.err);
        setErrorMessage(res.err);
      } else {
        dispatch({
          type: "join/setGameData",
          payload: {
            gamePin: res.gamePin,
            gameName: res.gameName,
          },
        });
        navigate("/join");
      }
    });
  };

  return (
    <div
      className={
        "w-full h-full flex flex-col bg-purple-500 justify-center items-center text-white"
      }
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-4xl font-black">Buzz-In</h1>
        <h2 className={`text-lg font-bold ${error && "animate-pulse"}`}>
          {error || "Join Game"}
        </h2>
        <form
          className="flex flex-col items-center space-y-2"
          onSubmit={checkGamePin}
        >
          <input
            type="tel"
            id="gamePin"
            value={gamePin}
            onChange={(e) => setGamePin(e.target.value)}
            className="text-black font-semibold text-center rounded h-10"
            maxLength="8"
            placeholder="Game PIN"
            aria-placeholder="Enter Game PIN"
            aria-label="Game PIN"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white font-semibold rounded h-10 w-full"
          >
            Enter
          </button>
        </form>
        <p>or</p>
        <button
          className="bg-gray-50 text-gray-800 font-semibold rounded h-10 w-full"
          onClick={() => navigate("/create")}
        >
          Create Game
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default HomeView;
