import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import AdminPage from './pages/AdminPage';
import GameLevelPage from './pages/GameLevelPage';
import OSBootPage from './pages/OSBootPage';
import OSDesktopPage from './pages/OSDesktopPage';
import './index.css';
import './styles/game-level.css';
import './styles/os-boot.css';
import FileExplorer from './pages/apps/FileExplorer';
import Terminal from './pages/apps/Terminal';
import LogViewer from './pages/apps/LogViewer';
import CaseNotes from './pages/apps/CaseNotes';
import NetworkScanner from './pages/apps/NetworkScanner';
import DatabaseClient from './pages/apps/DatabaseClient';
import HashVerifier from './pages/apps/HashVerifier';
import HtmlViewer from './pages/apps/HtmlViewer';
import TextViewer from './pages/apps/TextViewer'; // ✅ ADD THIS IMPORT
import { CaseProvider } from './contexts/CaseContext';

function App() {
  return (
    <CaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/game-level" element={<GameLevelPage />} />
          <Route path="/game-level/:id" element={<GameLevelPage />} />
          <Route path="/os-boot" element={<OSBootPage />} />
          <Route path="/os-desktop" element={<OSDesktopPage />} />
          <Route path="/file-explorer" element={<FileExplorer />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/log-viewer" element={<LogViewer />} />
          <Route path="/case-notes" element={<CaseNotes />} />
          <Route path="/network-scanner" element={<NetworkScanner />} />
          <Route path="/database-client" element={<DatabaseClient />} />
          <Route path="/hash-verifier" element={<HashVerifier />} />
          <Route path="/html-viewer" element={<HtmlViewer />} />
          <Route path="/text-viewer" element={<TextViewer />} /> {/* ✅ ADD THIS ROUTE */}
        </Routes>
      </BrowserRouter>
    </CaseProvider>
  );
}

export default App;