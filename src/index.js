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
import MultiplayerSummaryPage from "./pages/multiplayerSummaryPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Main Quizlet-style set page */}
        <Route path="/" element={<Homepage />} />

        {/* TimeClash mode selection screen */}
        <Route path="/timeclash" element={<App />} />

        {/* Single-player flow */}
        <Route path="/single-player" element={<SinglePlayer />} />
        <Route path="/single-summary" element={<SingleSummaryPage />} />

        {/* Multiplayer lobby + game */}
        <Route path="/multiplayer" element={<InviteLink />} />
        <Route path="/multiplayer-game" element={<Multiplayer />} />
        <Route
          path="/multiplayerSummaryPage"
          element={<MultiplayerSummaryPage />}
        />

        {/* Optional backup route */}
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
