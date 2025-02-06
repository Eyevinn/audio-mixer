import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { SideNav } from './components/sideNav/SideNav';
import { MixesPage } from './pages/mixes/Mixes';
import { StripsPage } from './pages/strips/Strips';
import { OutputMappingPage } from './pages/outputs/outputMapping/OutputMapping';
import { ConfigureMixPage } from './pages/mixes/mix';
import { WebSocketProvider } from './components/webSocket/WebSocketContext';
import { WebSocketLogOn } from './components/webSocket/WebSocketLogOn';

function App() {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <WebSocketLogOn>
          <div className="bg-zinc-900 min-h-screen flex">
            <SideNav />
            <Routes>
              <>
                <Route path="/strips" element={<StripsPage />} />
                <Route path="/mixes" element={<MixesPage />} />
                <Route path="/mixes/:mixId" element={<ConfigureMixPage />} />
                <Route path="/outputs" element={<OutputMappingPage />} />
              </>
            </Routes>
          </div>
        </WebSocketLogOn>
      </WebSocketProvider>
    </BrowserRouter>
  );
}

export default App;
