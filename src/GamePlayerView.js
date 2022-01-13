import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import { useSocket } from "./SocketProvider";
import { formatPin, useThemeColor, useTitle } from "./utils";

function GamePlayerView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const { joinState, gameState } = useSelector((state) => {
    return { joinState: state.join, gameState: state.game };
  });
  const gameName = gameState.gameName || joinState.gameName;
  const gamePin = gameState.gamePin || joinState.gamePin;

  useTitle(gameName ? `${gameName} - Buzz-In` : "Buzz-In");
  useThemeColor("#ffffff");

  useEffect(() => {
    if (!joinState.gamePin || !joinState.playerName) {
      console.log("That's illegal!");
      dispatch({ type: "loading/stop" });
      navigate("/");
      return;
    }

    socket.emit(
      "game/join",
      { gamePin: joinState.gamePin, playerName: joinState.playerName },
      (res) => {
        dispatch({ type: "loading/stop" });

        if (res.err) {
          navigate("/");
          return;
        }

        dispatch({ type: "game/setGameData", payload: res });
      }
    );

    socket.once("game/end", (res) => {
      navigate("/");
    });

    return () => {
      // TODO: Leave game
    };
  }, []);

  const pressBuzzer = (e) => {
    e.preventDefault();
    socket.emit("game/buzz", { gamePin: gameState.gamePin }, (res) => {
      dispatch({ type: "game/setGameData", payload: res });
    });
  };

  if (!joinState.gamePin || !joinState.gameName) {
    return <Navigate to="/" />;
  }

  const { activePlayer } = gameState;

  const backgroundColor = activePlayer
    ? activePlayer.id === socket.id
      ? "bg-green-500"
      : "bg-yellow-500"
    : "bg-blue-500";

  const centerPanel = activePlayer ? (
    activePlayer.id === socket.id ? (
      <div className="flex flex-col items-center space-y-2">
        <h1 className="font-black text-4xl">You're up!</h1>
        <p className="text-xl">Answer quick!</p>
      </div>
    ) : (
      <div className="flex flex-col items-center space-y-2">
        <h1 className="font-black text-4xl">Try again!</h1>
        <p className="text-xl">Someone else beat you to the buzzer.</p>
      </div>
    )
  ) : (
    <button
      className="bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-lg font-bold text-4xl text-white rounded-full h-64 w-64"
      onClick={pressBuzzer}
    >
      Press
    </button>
  );

  return (
    <div className={"w-full h-full flex flex-col " + backgroundColor}>
      <div className="flex bg-white justify-between px-2 py-1">
        <p className="font-bold">Buzz-In</p>
        <p className="font-bold">{gameName || "Loading..."}</p>
      </div>
      <div className="flex flex-grow items-center justify-center text-white">
        {centerPanel}
      </div>
      <div className="flex bg-white justify-between px-2 py-1">
        <p className="font-bold">{formatPin(gamePin)}</p>
        <p className="font-bold">{joinState.playerName}</p>
      </div>
    </div>
  );
}

export default GamePlayerView;
