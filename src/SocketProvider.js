import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext(null);

export { SocketContext };

const useSocket = () => useContext(SocketContext);

export { useSocket };

function SocketProvider({ children }) {
  const dispatch = useDispatch();
  let [socket, setSocket] = useState(null);

  useEffect(() => {
    let socket = io();

    socket.on("connected", (msg) => {
      console.log(msg);
    });

    socket.on("game/update", (game) => {
      console.log("game/update", game);
      dispatch({ type: "game/setGameData", payload: game });
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
