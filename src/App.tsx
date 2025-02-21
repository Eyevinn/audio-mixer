import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SideNav } from './components/sideNav/SideNav';
import { ErrorToast } from './components/ui/errorToast/ErrorToast';
import { WebSocketLogOn } from './components/webSocket/WebSocketLogOn';
import { GlobalStateProvider } from './context/GlobalStateContext';
import { WebSocketProvider } from './context/WebSocketContext';
import './index.css';
import { ConfigureMixPage } from './pages/mixes/ConfigureMix';
import { MixesPage } from './pages/mixes/Mixes';
import { OutputMappingPage } from './pages/outputs/OutputMapping';
import { StripsPage } from './pages/strips/Strips';

function App() {
  return (
    <BrowserRouter>
      <GlobalStateProvider>
        <WebSocketProvider>
          <WebSocketLogOn>
            <SideNav />
            <Routes>
              <>
                <Route path="/" element={<Navigate to="/strips" replace />} />
                <Route path="/strips" element={<StripsPage />} />
                <Route path="/mixes" element={<MixesPage />} />
                <Route path="/mixes/:mixId" element={<ConfigureMixPage />} />
                <Route path="/outputs" element={<OutputMappingPage />} />
              </>
            </Routes>
            <Toaster
              position="bottom-right"
              toastOptions={{
                error: {
                  style: {
                    fontSize: '14px',
                    background: '#52525b',
                    color: 'white'
                  }
                }
              }}
            />
            <ErrorToast />
          </WebSocketLogOn>
        </WebSocketProvider>
      </GlobalStateProvider>
    </BrowserRouter>
  );
}

export default App;
