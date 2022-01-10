import { Routes, Route, Navigate } from "react-router";
import GamePlayerView from "./GamePlayerView";
import GameAdminView from "./GameAdminView";
import GamePinEntryView from "./GamePinEntryView";
import GameCreateView from "./GameCreateView";
import GameJoinView from "./GameJoinView";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GamePinEntryView />} />
      <Route path="/join" element={<GameJoinView />} />
      <Route path="/create" element={<GameCreateView />} />
      <Route path="/play" element={<GamePlayerView />} />
      <Route path="/admin" element={<GameAdminView />} />
      // TODO: auto join
      <Route path="/:defaultGamePin" element={<GamePinEntryView />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRoutes;
