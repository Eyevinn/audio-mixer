import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { SideNav } from './components/sideNav/SideNav';
import { MixesPage } from './pages/mixes/Mixes';
import { StripsPage } from './pages/strips/Strips';
import { OutputMappingPage } from './pages/outputs/outputMapping/OutputMapping';
import { ConfigureMixPage } from './pages/mixes/mix';
import { WebSocketProvider } from './context/WebSocketContext';
import { WebSocketLogOn } from './components/webSocket/WebSocketLogOn';
import { GlobalStateProvider } from './context/GlobalStateContext';

function App() {
  return (
    <BrowserRouter>
      <GlobalStateProvider>
        <WebSocketProvider>
          <WebSocketLogOn>
            <SideNav />
            <Routes>
              <>
                <Route path="/strips" element={<StripsPage />} />
                <Route path="/mixes" element={<MixesPage />} />
                <Route path="/mixes/:mixId" element={<ConfigureMixPage />} />
                <Route path="/outputs" element={<OutputMappingPage />} />
              </>
            </Routes>
          </WebSocketLogOn>
        </WebSocketProvider>
      </GlobalStateProvider>
    </BrowserRouter>
  );
}

export default App;
