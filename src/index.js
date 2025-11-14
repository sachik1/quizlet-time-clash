import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import SinglePlayer from './pages/SinglePlayer';
import InviteLink from './pages/InviteLink';
import Multiplayer from './pages/Multiplayer';

import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/single-player" element={<SinglePlayer />} />
      <Route path="/invite" element={<InviteLink />} />
      <Route path="/multiplayer" element={<Multiplayer />} />
    </Routes>
  </BrowserRouter>
);
