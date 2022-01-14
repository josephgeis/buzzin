import { Routes, Route, Navigate } from "react-router";
import PlayerView from "./views/PlayerView";
import AdminView from "./views/AdminView";
import HomeView from "./views/HomeView";
import CreateGameView from "./views/CreateGameView";
import JoinGameView from "./views/JoinGameView";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/join" element={<JoinGameView />} />
      <Route path="/create" element={<CreateGameView />} />
      <Route path="/play" element={<PlayerView />} />
      <Route path="/admin" element={<AdminView />} />
      <Route path="/:defaultGamePin" element={<HomeView />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
