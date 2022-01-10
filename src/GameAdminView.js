import { useEffect, useState } from "react";

import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { useSocket } from "./SocketProvider";
import { formatPin } from "./utils";

function GameAdminView() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const gameState = useSelector((state) => state.game);
  const { activePlayer, gamePin, gameName } = gameState;

  let [resetting, setResetting] = useState(false);

  const backgroundColor = activePlayer ? "bg-teal-500" : "bg-blue-500";

  useEffect(() => {}, []);

  const resetPlayer = (e) => {
    e.preventDefault();
    setResetting(true);
    socket.emit("game/reset", {}, (res) => {
      setResetting(false);
      dispatch({ type: "game/setGameData", payload: res });
    });
  };

  if (!gameState.gamePin) {
    return <Navigate to="/create" />;
  }

  const centerPanel = activePlayer ? (
    <div className="flex flex-col items-center space-y-2">
      <h1 className="font-black text-4xl">{activePlayer.name}</h1>
      <button
        className="bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:bg-gray-600 shadow-lg font-semibold text-xl text-white rounded-full px-4 py-2"
        onClick={resetPlayer}
        disabled={resetting}
      >
        {resetting ? "Resetting..." : "Reset"}
      </button>
    </div>
  ) : (
    <div className="flex flex-col items-center space-y-2">
      <h1 className="font-black text-4xl">Waiting...</h1>
    </div>
  );

  return (
    <div className={"w-full h-full flex flex-col " + backgroundColor}>
      <div className="flex bg-white justify-between px-2 py-1">
        <p className="font-bold">Buzz-In</p>
        <p className="font-bold">{gameName}</p>
      </div>
      <div className="grid grid-cols-2 flex-grow items-center justify-evenly text-white">
        {centerPanel}
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-lg">Join at {window.location.host}</h1>
          <div className="bg-white p-2 rounded-xl">
            <QRCode
              className="rounded-lg"
              value={`${window.location.protocol}//${window.location.host}/${gamePin}`}
            />
          </div>
          <p className="font-bold text-4xl">
            {(gamePin && formatPin(gamePin)) || "Loading..."}
          </p>
        </div>
      </div>
      <div className="flex bg-white px-2 py-1">
        <p className="font-bold">
          {(gamePin && formatPin(gamePin)) || "Loading..."}
        </p>
      </div>
    </div>
  );
}

export default GameAdminView;
