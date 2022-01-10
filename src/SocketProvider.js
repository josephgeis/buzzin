import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext(null);

export { SocketContext };

const useSocket = () => useContext(SocketContext).current;

export { useSocket };

function SocketProvider({ children }) {
  const dispatch = useDispatch();
  let socketRef = useRef(null);

  useEffect(() => {
    let socket = io();

    socket.on("connected", (msg) => {
      console.log(msg);
    });

    socket.on("game/update", (game) => {
      console.log("game/update", game);
      dispatch({ type: "game/setGameData", payload: game });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
