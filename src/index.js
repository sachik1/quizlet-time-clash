import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App";
import Homepage from "./pages/homepage";
import SinglePlayer from "./pages/SinglePlayer";
import InviteLink from "./pages/InviteLink";
import Multiplayer from "./pages/Multiplayer";
import SingleSummaryPage from "./pages/singleSummaryPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Game modes */}
        <Route path="/single-player" element={<SinglePlayer />} />
        <Route path="/multiplayer" element={<InviteLink />} />

        {/* Multiplayer actual gameplay */}
        <Route path="/multiplayer-game" element={<Multiplayer />} />

        {/* Single player summary page */}
        <Route path="/single-summary" element={<SingleSummaryPage />} />

        {/* Backup: using App.js if needed for testing */}
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
